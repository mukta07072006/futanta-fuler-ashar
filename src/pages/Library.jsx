import { useEffect, useState } from 'react'
import { getList } from '../services/api'
import noImage from '../assets/NO.jpg'

export default function Library() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getList('library')
        setItems(list.map(it => ({ id: it._id || it.id, ...it })))
      } catch (e) {
        console.error('Failed to load library items', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const openUrl = (url) => {
    if (!url) return
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">লাইব্রেরি</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          আমাদের সংগ্রহশালা থেকে বই ও ডকুমেন্ট ডাউনলোড করুন
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !items.length && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-slate-800 mb-2">এখনো কোনো বই যুক্ত করা হয়নি</h3>
          <p className="text-slate-500">শীঘ্রই আমাদের লাইব্রেরি আপডেট করা হবে</p>
        </div>
      )}

      {/* Real items list */}
      {!loading && items.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.id} className="group border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-50 relative">
                <img
                  src={it.thumbnail || noImage}
                  alt={it.title || 'কভার ছবি'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => (e.currentTarget.src = noImage)}
                />
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-medium text-slate-900 line-clamp-2 text-lg">
                  {it.title || 'Untitled'}
                </h3>
                
                {(it.category || it.type) && (
                  <span className="inline-block text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100">
                    {it.category || it.type}
                  </span>
                )}
                
                {(it.description || it.content) && (
                  <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                    {it.description || it.content}
                  </p>
                )}
                
                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    onClick={() => openUrl(it.url || it.downloadUrl)}
                    disabled={!it.url && !it.downloadUrl}
                  >
                    ডাউনলোড
                  </button>
                  
                  {(it.url || it.downloadUrl) && (
                    <a
                      className="flex items-center justify-center px-3 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm hover:border-orange-400 hover:text-orange-700 transition-colors duration-200"
                      href={it.url || it.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}