import { useState, useEffect } from 'react'
import { createItem, getList, deleteItem as apiDelete } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Navigate, Link } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { 
  FaShieldAlt, 
  FaUserShield, 
  FaUser, 
  FaIdCard, 
  FaUserCog, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaExclamationTriangle, 
  FaExclamationCircle,
  FaCode
} from 'react-icons/fa';

const tabs = [
  { key: 'library', label: 'লাইব্রেরি', icon: '📚' },
  { key: 'notices', label: 'নোটিশ', icon: '📢' },
  { key: 'events', label: 'ইভেন্ট', icon: '🎉' },
  { key: 'blogs', label: 'ব্লগ', icon: '✍️' },
]

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const [active, setActive] = useState('library')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [extra, setExtra] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [status, setStatus] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileStatus, setProfileStatus] = useState('')

  // Function to upload image to Supabase storage
  const uploadImage = async (file) => {
    if (!file) return null
    
    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const bucketName = `${active}-images`
      
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file)
      
      if (error) throw error
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName)
      
      return publicUrl
    } catch (error) {
      console.error('Image upload failed:', error)
      setStatus('ছবি আপলোড ব্যর্থ হয়েছে')
      return null
    } finally {
      setUploading(false)
    }
  }

  // Handle image file selection
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    // Check file type and size
    if (!file.type.startsWith('image/')) {
      setStatus('শুধুমাত্র ইমেজ ফাইল আপলোড করুন')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setStatus('ফাইলের সাইজ 5MB এর কম হতে হবে')
      return
    }
    
    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      setThumbnail(imageUrl)
      setStatus('ছবি সফলভাবে আপলোড হয়েছে!')
    }
  }

  // Note: Avoid early returns before hooks to keep hook order stable

  const collectionForTab = (tab) => {
    switch (tab) {
      case 'library':
        return 'library'
      case 'notices':
        return 'notices'
      case 'events':
        return 'events'
      case 'blogs':
        return 'blogs'
      default:
        return null
    }
  }

  const getExtraFieldPlaceholder = () => {
    switch (active) {
      case 'library':
        return 'ডাউনলোড লিংক URL (যেমন: Google Drive/Public URL)'
      case 'events':
      case 'notices':
        return 'তারিখ (যেমন: 2025-11-21)'
      case 'blogs':
        return 'ট্যাগস (কমা দ্বারা পৃথক)'
      default:
        return 'অতিরিক্ত তথ্য'
    }
  }

  const getThumbnailPlaceholder = () => {
    switch (active) {
      case 'library':
        return 'বইয়ের থাম্বনেইল URL'
      case 'blogs':
        return 'ব্লগ ছবি URL'
      case 'events':
        return 'ইভেন্ট ছবি URL'
      default:
        return 'ছবি URL (ঐচ্ছিক)'
    }
  }

  // Load admin profile details by UID
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return
      try {
        setProfileLoading(true)
        setProfileStatus('')
        const { data, error } = await supabase
          .from('profile')
          .select('*')
          .eq('UID', user.id)
          .maybeSingle()
        if (error) {
          console.error('Profile fetch failed', error)
          setProfileStatus('প্রোফাইল তথ্য আনতে সমস্যা হয়েছে')
        }
        setProfile(data || null)
      } catch (e) {
        console.error('Profile fetch error', e)
        setProfileStatus('প্রোফাইল তথ্য আনতে সমস্যা হয়েছে')
      } finally {
        setProfileLoading(false)
      }
    }
    loadProfile()
  }, [user])

  // Disable Save based on active tab's required fields
  const isSaveDisabled = () => {
    const t = title.trim()
    if (!t) return true
    if (active === 'library') return !extra.trim() // Download URL required
    if (active === 'events' || active === 'notices') return !extra.trim() // Date required
    if (active === 'blogs') return !description.trim() // Content required
    return false
  }

  const handleSave = async () => {
    const col = collectionForTab(active)
    if (!col) {
      setStatus('এই ট্যাবটি এখানে কনফিগারযোগ্য৤ নয়। নয়।')
      return
    }
    
    if (!title.trim()) {
      setStatus('শিরোনাম প্রয়োজন।')
      return
    }

    setSaving(true)
    setStatus('সংরক্ষণ করা হচ্ছে...')
    
    try {
      let payload = { title: title.trim() }
      
      if (active === 'library') {
        payload = { 
          ...payload, 
          description: description.trim(), 
          type: category.trim(), 
          url: extra.trim(),
          downloadUrl: extra.trim(),
          thumbnail: thumbnail.trim()
        }
      } else if (active === 'notices') {
        payload = { 
          ...payload, 
          description: description.trim(), 
          type: category.trim(), 
          date: extra.trim(),
          thumbnail: thumbnail.trim()
        }
      } else if (active === 'events') {
        payload = { 
          ...payload, 
          description: description.trim(), 
          type: category.trim(), 
          date: extra.trim(),
          thumbnail: thumbnail.trim()
        }
      } else if (active === 'blogs') {
        payload = { 
          ...payload, 
          content: description.trim(), 
          category: category.trim(),
          tags: extra.trim(),
          thumbnail: thumbnail.trim()
        }
      }

      await createItem(active, payload)
      setStatus('সফলভাবে সংরক্ষণ করা হয়েছে!')
      setTitle('')
      setCategory('')
      setDescription('')
      setExtra('')
      setThumbnail('')
      await refreshList()
    } catch (e) {
      console.error('Admin save failed', e)
      setStatus('সংরক্ষণ ব্যর্থ হয়েছে। কনসোল চেক করুন।')
    } finally {
      setSaving(false)
    }
  }

  const refreshList = async () => {
    const col = collectionForTab(active)
    if (!col) {
      setItems([])
      return
    }
    setLoading(true)
    try {
      const list = await getList(active)
      // Normalize id field
      setItems(list.map(it => ({ id: it._id || it.id, ...it })))
    } catch (e) {
      console.error('Admin list load failed', e)
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে আপনি এই আইটেমটি মুছতে চান?')) {
      return
    }
    
    const col = collectionForTab(active)
    if (!col) return
    
    try {
      await apiDelete(active, id)
      setStatus('আইটেম মুছে ফেলা হয়েছে')
      await refreshList()
    } catch (e) {
      console.error('Delete failed', e)
      setStatus('মুছে ফেলতে ব্যর্থ হয়েছে')
    }
  }

  // Load list when tab changes
  useEffect(() => {
    refreshList()
  }, [active])

  // Normalize role for consistent display
  const roleRaw = (profile?.['Role'] ?? '').toString()
  const role = roleRaw.trim().toLowerCase()
  const roleLabel = role === 'developer' ? 'ডেভেলপার' : role === 'admin' ? 'অ্যাডমিন' : role === 'moderator' ? 'মডারেটর' : 'ব্যবহারকারী'
  const roleBadgeClass = role === 'developer'
    ? 'bg-purple-100 text-purple-700 border border-purple-200'
    : role === 'admin'
    ? 'bg-red-100 text-red-700 border border-red-200'
    : role === 'moderator'
    ? 'bg-blue-100 text-blue-700 border border-blue-200'
    : 'bg-green-100 text-green-700 border border-green-200'
  const roleIconColor = role === 'developer' ? 'text-purple-600' : role === 'admin' ? 'text-red-600' : role === 'moderator' ? 'text-blue-600' : 'text-green-600'
  const Initial = ((profile?.['Name'] || user?.email || '?').charAt(0) || '?').toUpperCase()

  // Redirect if not authenticated or not admin (placed after hooks to maintain order)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Admin Profile Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">অ্যাডমিন তথ্য</h2>
            {profileLoading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            )}
          </div>
          {profile ? (
            <div className="space-y-6">
              {/* Header with avatar and role badge */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${role === 'developer' ? 'bg-purple-100 text-purple-700' : role === 'admin' ? 'bg-red-100 text-red-700' : role === 'moderator' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{Initial}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{profile['Name'] || '—'}</h3>
                    <p className="text-gray-600">{user?.email || '—'}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${roleBadgeClass}`}>
                  {role === 'developer' ? (
                    <FaCode className={`w-5 h-5 ${roleIconColor}`} />
                  ) : role === 'admin' ? (
                    <FaShieldAlt className={`w-5 h-5 ${roleIconColor}`} />
                  ) : role === 'moderator' ? (
                    <FaUserShield className={`w-5 h-5 ${roleIconColor}`} />
                  ) : (
                    <FaUser className={`w-5 h-5 ${roleIconColor}`} />
                  )}
                  <span className="font-semibold text-sm">{roleLabel}</span>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid sm:grid-cols-2 gap-6">
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-600">
              <FaExclamationTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p>কোন প্রোফাইল তথ্য পাওয়া যায়নি।</p>
            </div>
          )}
          {profileStatus && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <FaExclamationCircle className="w-4 h-4" />
              <span className="text-sm">{profileStatus}</span>
            </div>
          )}
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ADMIN DASHBOARD</h1>
          <p className="text-gray-600">কন্টেন্ট ম্যানেজমেন্ট সিস্টেম</p>
        </div>
        <div className="flex justify-center mb-6">
          <Link
            to="/admin/media"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700"
          >
            <span>🖼️</span>
            <span>মিডিয়া ম্যানেজার</span>
          </Link>
        </div>
        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                active === t.key 
                  ? 'bg-orange-600 text-white border-orange-600 shadow-lg' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-600'
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="font-medium">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-3 h-8 rounded-full ${
              active === 'library' ? 'bg-blue-500' :
              active === 'notices' ? 'bg-green-500' :
              active === 'events' ? 'bg-purple-500' :
              active === 'blogs' ? 'bg-pink-500' : 'bg-orange-500'
            }`}></div>
            <h2 className="text-xl font-semibold text-gray-800">
              {tabs.find(t => t.key === active)?.label} যোগ করুন
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                শিরোনাম *
              </label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="শিরোনাম লিখুন"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category/Type */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {active === 'blogs' ? 'বিভাগ' : 'ধরন'}
              </label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder={active === 'blogs' ? 'বিভাগ' : 'ধরন'}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            {/* Thumbnail Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                থাম্বনেইল
              </label>
              
              {/* File Upload Button */}
              <div className="mb-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-all">
                  <span>📁</span>
                  <span>ছবি আপলোড করুন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {uploading && (
                  <div className="inline-flex items-center gap-2 ml-4 text-sm text-gray-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    আপলোড হচ্ছে...
                  </div>
                )}
              </div>
              
              {/* URL Input */}
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                type="url"
                placeholder={getThumbnailPlaceholder()}
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />
              
              {/* Preview */}
              {thumbnail && (
                <div className="mt-2">
                  <img 
                    src={thumbnail} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            {/* Extra Field */}
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700">
                {active === 'library' ? 'লিংক' : 
                 active === 'blogs' ? 'ট্যাগস' : 
                 active === 'events' || active === 'notices' ? 'তারিখ' : 'অতিরিক্ত তথ্য'}
              </label>
              <input
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                type={active === 'events' || active === 'notices' ? 'date' : active === 'library' ? 'url' : 'text'}
                placeholder={getExtraFieldPlaceholder()}
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
              />
              {active === 'library' && extra && !/^https?:\/\//.test(extra) && (
                <p className="text-xs text-red-600">দয়া করে একটি বৈধ URL দিন</p>
              )}
            </div>

            {/* Description/Content */}
            <div className="space-y-2 md:col-span-3">
              <label className="block text-sm font-medium text-gray-700">
                {active === 'blogs' ? 'বিষয়বস্তু' : 'বিবরণ'}
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                placeholder={active === 'blogs' ? 'বিষয়বস্তু লিখুন...' : 'বিবরণ লিখুন...'}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-3">
              <button 
                onClick={handleSave}
                disabled={saving || isSaveDisabled()}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    সংরক্ষণ করা হচ্ছে...
                  </>
                ) : (
                  'সংরক্ষণ করুন'
                )}
              </button>
            </div>

            {/* Status Message */}
            {status && (
              <div className="md:col-span-3">
                <div className={`p-3 rounded-xl text-sm font-medium ${
                  status.includes('সফল') ? 'bg-green-100 text-green-800' :
                  status.includes('ব্যর্থ') ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {status}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Existing Items List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-8 rounded-full bg-gray-500"></div>
            <h2 className="text-xl font-semibold text-gray-800">
              বিদ্যমান {tabs.find(t => t.key === active)?.label}
            </h2>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
              {items.length} টি
            </span>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">লোড হচ্ছে...</p>
            </div>
          )}

          {!loading && !items.length && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg">কোনো আইটেম পাওয়া যায়নি</p>
              <p className="text-gray-400 text-sm">উপরে ফর্সফ টি ব্যবহার করে নতুন আইটেম যোগ করুন</p>
            </div>
          )}

          {!loading && items.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((it) => (
                <div key={it.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-orange-300 transition-all">
                  {/* Thumbnail Preview */}
                  {it.thumbnail && (
                    <div className="mb-3">
                      <img 
                        src={it.thumbnail} 
                        alt={it.title}
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
                      {it.title || it.name}
                    </h3>
                    
                    {(it.category || it.type) && (
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs inline-block">
                        {it.category || it.type}
                      </div>
                    )}

                    {(it.content || it.description) && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {it.content || it.description}
                      </p>
                    )}

                    {/* Additional info based on type */}
                    {it.date && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>📅</span>
                        <span>{it.date}</span>
                      </div>
                    )}

                    {it.url && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>🔗</span>
                        <a href={it.url} target="_blank" rel="noopener noreferrer" className="truncate text-orange-700 hover:underline">
                          {it.url}
                        </a>
                      </div>
                    )}

                    {it.tags && (
                      <div className="flex flex-wrap gap-2">
                        {it.tags.split(',').map(tag => (
                          <span key={tag.trim()} className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">{tag.trim()}</span>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-200">
                      <button 
                        onClick={() => removeItem(it.id)}
                        className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                      >
                        <span>🗑️</span>
                        মুছুন
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
