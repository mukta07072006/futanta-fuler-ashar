import { useEffect, useState } from 'react'
import { getList } from '../services/api'

function isYouTube(url = '') {
  try {
    const u = new URL(url)
    return u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')
  } catch {
    return false
  }
}

function YouTubeEmbed({ url, title }) {
  try {
    const u = new URL(url)
    let id = ''
    if (u.hostname.includes('youtu.be')) {
      id = u.pathname.slice(1)
    } else {
      id = u.searchParams.get('v') || ''
    }
    if (!id) return null
    const embed = `https://www.youtube.com/embed/${id}`
    return (
      <iframe
        className="w-full aspect-video rounded-xl"
        src={embed}
        title={title || 'YouTube video'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    )
  } catch {
    return null
  }
}

function MediaCard({ item, type, onView, onDownload }) {
  const isPhoto = type === 'photo'
  
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200">
      {/* Media content */}
      <div className="relative">
        {isPhoto ? (
          <img
            src={item.url || item.thumbnail}
            alt={item.title || ''}
            className="w-full h-48 object-cover cursor-pointer"
            onClick={() => onView(item)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-48 bg-black flex items-center justify-center">
            {isYouTube(item.url) ? (
              <YouTubeEmbed url={item.url} title={item.title} />
            ) : item.url ? (
              <video className="w-full h-full object-cover" controls>
                <source src={item.url} />
              </video>
            ) : (
              <div className="text-white">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              </div>
            )}
          </div>
        )}
        
        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3">
            <button
              onClick={() => onView(item)}
              className="bg-white text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors"
              title="View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            {isPhoto && (
              <button
                onClick={() => onDownload(item)}
                className="bg-white text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors"
                title="Download"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Media info - Only show type badge and date */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {type === 'photo' ? 'ছবি' : 'ভিডিও'}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(item.created_at || item._id).toLocaleDateString('bn-BD')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Media() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setStatus('')
      try {
        const list = await getList('media')
        const normalized = (list || []).map(it => ({ id: it._id || it.id, ...it }))
        setItems(normalized)
      } catch (e) {
        console.error('Failed to load media', e)
        setStatus('মিডিয়া লোড করতে সমস্যা হয়েছে')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const photos = items.filter(x => (x.type || '').toLowerCase() === 'photo')
  const videos = items.filter(x => (x.type || '').toLowerCase() === 'video')

  const handleViewMedia = (media) => {
    setSelectedMedia(media)
    setShowModal(true)
  }

  const handleDownloadMedia = (media) => {
    if (media.url) {
      const link = document.createElement('a')
      link.href = media.url
      link.download = media.title || 'download'
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedMedia(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">মিডিয়া গ্যালারি</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            আমাদের সংগঠনের বিভিন্ন অনুষ্ঠান ও কার্যক্রমের ছবি এবং ভিডিওসমূহ
          </p>
        </div>

        {status && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-8 text-center">
            {status}
          </div>
        )}

        {/* Photos Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              ছবি
            </h2>
            <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              মোট: {photos.length}
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-slate-200 h-64 animate-pulse" />
              ))
            ) : photos.length ? (
              photos.map(photo => (
                <MediaCard
                  key={photo.id}
                  item={photo}
                  type="photo"
                  onView={handleViewMedia}
                  onDownload={handleDownloadMedia}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <p className="text-slate-600">কোনো ছবি পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        </div>

        {/* Videos Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <svg className="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              ভিডিও
            </h2>
            <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              মোট: {videos.length}
            </div>
          </div>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-slate-200 h-64 animate-pulse" />
              ))
            ) : videos.length ? (
              videos.map(video => (
                <MediaCard
                  key={video.id}
                  item={video}
                  type="video"
                  onView={handleViewMedia}
                  onDownload={handleDownloadMedia}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  <path d="M14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <p className="text-slate-600">কোনো ভিডিও পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal for viewing media */}
        {showModal && selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={handleCloseModal}>
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="relative">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {selectedMedia.type === 'photo' ? (
                  <img
                    src={selectedMedia.url || selectedMedia.thumbnail}
                    alt={selectedMedia.title || ''}
                    className="w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="w-full aspect-video">
                    {isYouTube(selectedMedia.url) ? (
                      <YouTubeEmbed url={selectedMedia.url} title={selectedMedia.title} />
                    ) : (
                      <video className="w-full h-full" controls autoPlay>
                        <source src={selectedMedia.url} />
                      </video>
                    )}
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {selectedMedia.title || 'Untitled'}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {selectedMedia.type === 'photo' ? 'ছবি' : 'ভিডিও'}
                    </span>
                    <span className="text-sm text-slate-500">
                      {new Date(selectedMedia.created_at || selectedMedia._id).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                  {selectedMedia.type === 'photo' && (
                    <button
                      onClick={() => handleDownloadMedia(selectedMedia)}
                      className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      ডাউনলোড করুন
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}