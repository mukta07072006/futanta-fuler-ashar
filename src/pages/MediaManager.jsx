import { useEffect, useState } from 'react'
import { getList, createItem, deleteItem } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { FaDownload, FaEye, FaTrash, FaVideo, FaImage, FaCloudUploadAlt } from 'react-icons/fa'

function transformCloudinaryThumb(url) {
  try {
    const idx = url.indexOf('/upload/')
    if (idx === -1) return url
    const before = url.slice(0, idx + 8)
    const after = url.slice(idx + 8)
    return `${before}c_fill,w_400,h_300,q_auto/${after}`
  } catch {
    return url
  }
}

function youtubeId(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1)
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v') || ''
    return ''
  } catch {
    return ''
  }
}

export default function MediaManager() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progressMap, setProgressMap] = useState({})

  // Video form state
  const [videoTitle, setVideoTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoDesc, setVideoDesc] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const list = await getList('media')
        setItems(list.map(x => ({ id: x._id || x.id, ...x })))
      } catch (e) {
        console.error('Media load failed', e)
        setStatus('মিডিয়া লোড করতে সমস্যা হয়েছে')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const cloudReady = Boolean(cloudName && uploadPreset)

  const uploadBatchToCloudinary = async files => {
    if (!cloudName || !uploadPreset) {
      setStatus('Cloudinary কনফিগার নেই (.env এ VITE_CLOUDINARY_CLOUD_NAME এবং VITE_CLOUDINARY_UPLOAD_PRESET দিন)')
      return
    }
    if (!files?.length) return
    setUploading(true)
    setStatus('আপলোড শুরু হয়েছে...')
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    const folder = import.meta.env.VITE_CLOUDINARY_FOLDER
    const results = []
    for (const file of files) {
      const key = file.name
      setProgressMap(prev => ({ ...prev, [key]: 0 }))
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', uploadPreset)
      if (folder) formData.append('folder', folder)
      try {
        const resp = await fetch(url, { method: 'POST', body: formData })
        if (!resp.ok) {
          let detail = ''
          try {
            const errJson = await resp.json()
            detail = errJson?.error?.message || errJson?.message || ''
            console.error('Cloudinary error response:', errJson)
          } catch {}
          throw new Error(detail ? `Upload failed: ${detail}` : 'Upload failed')
        }
        const json = await resp.json()
        const secure = json.secure_url || json.url
        const thumb = transformCloudinaryThumb(secure)
        results.push({ title: file.name, type: 'photo', url: secure, thumbnail: thumb })
        setProgressMap(prev => ({ ...prev, [key]: 100 }))
      } catch (e) {
        console.error('Batch upload error', e)
        setProgressMap(prev => ({ ...prev, [key]: -1 }))
        setStatus(`আপলোডে সমস্যা: ${e?.message || 'অজানা ত্রুটি'}`)
      }
    }
    // Insert uploaded photos into media table
    try {
      for (const r of results) {
        await createItem('media', { ...r, description: '' })
      }
      setStatus('সব ছবি সফলভাবে যুক্ত হয়েছে')
      const list = await getList('media')
      setItems(list.map(x => ({ id: x._id || x.id, ...x })))
    } catch (e) {
      console.error('Insert media failed', e)
      setStatus('মিডিয়াতে যুক্ত করতে সমস্যা হয়েছে')
    } finally {
      setUploading(false)
    }
  }

  const onFilesSelected = e => {
    const files = Array.from(e.target.files || [])
    const images = files.filter(f => f.type.startsWith('image/'))
    uploadBatchToCloudinary(images)
  }

  const addVideo = async () => {
    const t = videoTitle.trim()
    const u = videoUrl.trim()
    if (!t || !/^https?:\/\//.test(u)) {
      setStatus('ভিডিও শিরোনাম ও বৈধ URL প্রয়োজন')
      return
    }
    try {
      const vid = youtubeId(u)
      const thumb = vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : null
      await createItem('media', { title: t, description: videoDesc.trim(), type: 'video', url: u, thumbnail: thumb })
      setStatus('ভিডিও যুক্ত হয়েছে')
      setVideoTitle('')
      setVideoUrl('')
      setVideoDesc('')
      const list = await getList('media')
      setItems(list.map(x => ({ id: x._id || x.id, ...x })))
    } catch (e) {
      console.error('Add video failed', e)
      setStatus('ভিডিও যুক্ত করতে সমস্যা হয়েছে')
    }
  }

  const removeItem = async id => {
    if (!window.confirm('আপনি কি নিশ্চিত যে আপনি মুছতে চান?')) return
    try {
      await deleteItem('media', id)
      setStatus('মুছে ফেলা হয়েছে')
      const list = await getList('media')
      setItems(list.map(x => ({ id: x._id || x.id, ...x })))
    } catch (e) {
      console.error('Delete media failed', e)
      setStatus('মুছে ফেলতে সমস্যা হয়েছে')
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">অনুমতি নেই</h1>
          <p className="text-gray-600">আপনার এই পৃষ্ঠাটি দেখার অনুমতি নেই</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">মিডিয়া ম্যানেজার</h2>
        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
          {items.length} টি মিডিয়া
        </div>
      </div>

      {/* Cloudinary Status Banner */}
      {!cloudReady && (
        <div className="p-4 rounded-xl border border-blue-300 bg-blue-50 text-blue-800">
          <div className="flex items-center gap-2 mb-1">
            <FaCloudUploadAlt className="text-blue-600" />
            <span className="font-medium">Cloudinary সেটআপ প্রয়োজন</span>
          </div>
          <p className="text-sm">
            .env ফাইলে <code>VITE_CLOUDINARY_CLOUD_NAME</code> এবং <code>VITE_CLOUDINARY_UPLOAD_PRESET</code> সেট করুন
          </p>
        </div>
      )}

      {/* Status Messages */}
      {status && (
        <div className={`p-4 rounded-xl border text-sm ${
          status.includes('সমস্যা') || status.includes('ব্যর্থ') 
            ? 'border-red-300 bg-red-50 text-red-800' 
            : 'border-green-300 bg-green-50 text-green-800'
        }`}>
          {status}
        </div>
      )}

      {/* Upload Section */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <FaImage className="text-orange-600" />
          <h3 className="font-semibold text-slate-800">একাধিক ছবি আপলোড করুন</h3>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-400 transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={onFilesSelected} 
            className="hidden" 
            id="media-upload"
            disabled={!cloudReady || uploading}
          />
          <label 
            htmlFor="media-upload" 
            className={`cursor-pointer block ${(!cloudReady || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaCloudUploadAlt className="mx-auto text-3xl text-gray-400 mb-2" />
            <p className="text-gray-600 mb-2">ছবিগুলো এখানে ক্লিক করে বা ড্র্যাগ করুন</p>
            <p className="text-sm text-gray-500">JPG, PNG, JPEG ফরম্যাট (সর্বোচ্চ ১০MB)</p>
          </label>
        </div>

        {uploading && (
          <div className="text-sm text-gray-600 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
            আপলোড হচ্ছে...
          </div>
        )}

        {!!Object.keys(progressMap).length && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-700 text-sm">আপলোড প্রোগ্রেস:</h4>
            {Object.entries(progressMap).map(([name, p]) => (
              <div key={name} className="flex items-center gap-3 text-sm">
                <span className="w-32 truncate text-gray-600">{name}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full">
                  <div className={`h-2 rounded-full transition-all duration-300 ${
                    p < 0 ? 'bg-red-500' : p === 100 ? 'bg-green-500' : 'bg-orange-500'
                  }`} style={{ width: `${Math.max(0, p)}%` }}></div>
                </div>
                <span className="w-12 text-right font-medium ${
                  p < 0 ? 'text-red-600' : p === 100 ? 'text-green-600' : 'text-orange-600'
                }">
                  {p < 0 ? 'ব্যর্থ' : `${p}%`}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Add Section */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2">
          <FaVideo className="text-orange-600" />
          <h3 className="font-semibold text-slate-800">ভিডিও যোগ করুন</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">শিরোনাম</label>
            <input 
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
              placeholder="ভিডিও শিরোনাম" 
              value={videoTitle} 
              onChange={e => setVideoTitle(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ভিডিও URL</label>
            <input 
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
              placeholder="https://youtube.com/... বা https://example.com/video.mp4" 
              value={videoUrl} 
              onChange={e => setVideoUrl(e.target.value)} 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">বিবরণ (ঐচ্ছিক)</label>
          <textarea 
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
            rows={3} 
            placeholder="ভিডিও সম্পর্কে সংক্ষিপ্ত বিবরণ" 
            value={videoDesc} 
            onChange={e => setVideoDesc(e.target.value)} 
          />
        </div>

        <button 
          onClick={addVideo} 
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 justify-center"
        >
          <FaVideo />
          ভিডিও যুক্ত করুন
        </button>
      </div>

      {/* Media List Section */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="font-semibold text-slate-800">বিদ্যমান মিডিয়া</h3>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
            {items.length} টি
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-3"></div>
            <p className="text-gray-600">মিডিয়া লোড হচ্ছে...</p>
          </div>
        ) : !items.length ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📷</div>
            <p className="text-gray-600">কোনো মিডিয়া পাওয়া যায়নি</p>
            <p className="text-sm text-gray-500 mt-1">উপরে ছবি আপলোড করুন বা ভিডিও যোগ করুন</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map(it => (
              <div key={it.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                {/* Media Preview */}
                <div className="mb-4 relative">
                  {it.type === 'photo' ? (
                    <img 
                      src={it.thumbnail || it.url} 
                      alt={it.title || ''} 
                      className="w-full h-48 object-cover rounded-lg" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center">
                      <FaVideo className="text-white text-2xl" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {it.type === 'photo' ? 'ছবি' : 'ভিডিও'}
                    </span>
                  </div>
                </div>

                {/* Media Info */}
                <div className="space-y-2 mb-4">
                  <h4 className="font-semibold text-slate-800 truncate">{it.title || '—'}</h4>
                  {it.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{it.description}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    {new URL(it.url).hostname}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <a 
                    href={it.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 justify-center transition-colors"
                  >
                    <FaEye className="text-sm" />
                    দেখুন
                  </a>
                  <a 
                    href={it.url} 
                    download={it.type === 'photo' ? it.title + '.jpg' : it.title + '.mp4'}
                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 justify-center transition-colors"
                  >
                    <FaDownload className="text-sm" />
                    ডাউনলোড
                  </a>
                  <button 
                    onClick={() => removeItem(it.id)} 
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 justify-center transition-colors"
                  >
                    <FaTrash className="text-sm" />
                    মুছুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}