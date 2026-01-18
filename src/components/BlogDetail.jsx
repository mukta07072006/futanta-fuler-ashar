import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { getById } from '../services/api'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=20&w=500&auto=format&fit=crop'

export default function BlogDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(false)
    
    getById('blogs', id)
      .then(data => {
        if (!isMounted) return
        setPost(data)
        setLoading(false)
      })
      .catch(() => {
        if (!isMounted) return
        setError(true)
        setLoading(false)
      })
    
    return () => { isMounted = false }
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f2f4]">
      <div className="w-8 h-8 border-2 border-[#2196f3] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (error || !post) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f2f4]">
      <div className="text-center bg-white p-8 rounded border border-gray-200">
        <p className="text-gray-600 mb-4">ব্লগ পোস্ট পাওয়া যায়নি</p>
        <NavLink to="/" className="inline-block px-4 py-2 bg-[#2196f3] text-white rounded">
          হোমে ফিরে যান
        </NavLink>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f1f2f4] py-6 px-4">
      <div className="max-w-[900px] mx-auto">
        
        {/* Back Button */}
        <NavLink 
          to="/blog" 
          className="inline-block mb-4 text-[#2196f3] text-sm font-medium"
        >
          ← ব্লগ তালিকায় ফিরে যান
        </NavLink>

        {/* Main Content */}
        <article className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Featured Image */}
          {post.thumbnail && (
            <div className="w-full h-[300px] md:h-[400px] bg-gray-100">
              <img 
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = FALLBACK_IMAGE)}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-10">
            
            {/* Category & Date */}
            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-500">
              {post.category && (
                <span className="bg-[#2196f3] text-white px-3 py-1 rounded text-xs font-bold">
                  {post.category}
                </span>
              )}
              <span>
                {new Date(post.created_at).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.split(',').map((tag, i) => (
                  <span 
                    key={i}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-sm md:prose-lg max-w-none text-gray-700 leading-relaxed">
              {post.content ? (
                <div 
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />
              ) : (
                <p className="text-gray-400">কোনো কন্টেন্ট পাওয়া যায়নি</p>
              )}
            </div>

            {/* Updated Time */}
            {post.updated_at && post.updated_at !== post.created_at && (
              <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-400">
                সর্বশেষ আপডেট: {new Date(post.updated_at).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}