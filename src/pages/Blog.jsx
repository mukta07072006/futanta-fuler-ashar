import { useEffect, useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { getList } from '../services/api'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=20&w=500&auto=format&fit=crop'

export default function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('সব')

  useEffect(() => {
    let isMounted = true
    getList('blogs').then(list => {
      if (!isMounted) return
      setPosts(list.map(it => ({ id: it.id, ...it })))
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { isMounted = false }
  }, [])

  const categories = useMemo(() => {
    return ['সব', ...new Set(posts.map(it => it.category).filter(Boolean))]
  }, [posts])

  const filteredPosts = useMemo(() => {
    return activeCategory === 'সব' ? posts : posts.filter(p => p.category === activeCategory)
  }, [activeCategory, posts])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f2f4]">
      <div className="w-8 h-8 border-2 border-[#2196f3] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f1f2f4] py-6 px-4">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Category Header */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-xl font-bold text-gray-700">ব্লগ কালেকশন</h1>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded text-sm ${
                    activeCategory === cat 
                    ? 'bg-[#2196f3] text-white' 
                    : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded shadow-sm flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative p-3 bg-white flex justify-center h-48 sm:h-56">
                <img 
                  src={post.thumbnail || FALLBACK_IMAGE} 
                  loading="lazy"
                  alt={post.title || 'ব্লগ পোস্ট'}
                  width="200"
                  height="224"
                  className="w-full h-full object-cover rounded-sm shadow-sm"
                  onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                />
                {post.category && (
                  <span className="absolute top-3 right-3 bg-[#2196f3] text-white text-[10px] font-bold px-2 py-0.5 rounded-l shadow-sm">
                    {post.category}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-3 pt-0 flex flex-col flex-grow text-center">
                <h3 className="text-gray-800 font-bold text-sm line-clamp-2 leading-snug mb-2 min-h-[40px]">
                  {post.title}
                </h3>
                
                <div className="text-[11px] text-gray-400 mb-4 uppercase">
                  {new Date(post.created_at).toLocaleDateString('bn-BD')}
                </div>

                <div className="mt-auto">
                  <NavLink 
                    to={`/blog/${post.id}`}
                    className="inline-block w-full py-1.5 border border-[#2196f3] text-[#2196f3] text-xs font-bold rounded"
                  >
                    বিস্তারিত পড়ুন
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white rounded border border-gray-200">
            <p className="text-gray-400">এই ক্যাটাগরিতে কোনো পোস্ট পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  )
}