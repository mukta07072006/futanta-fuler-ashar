import { useEffect, useState } from 'react'
import { NavLink, Routes, Route, useParams } from 'react-router-dom'
import { getList, getById } from '../services/api'

function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)

  const getExcerpt = (text, maxChars = 160) => {
    if (!text) return ''
    const clean = String(text).replace(/\s+/g, ' ').trim()
    if (clean.length <= maxChars) return clean
    const slice = clean.slice(0, maxChars)
    const lastSpace = slice.lastIndexOf(' ')
    return (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + '…'
  }

  useEffect(() => {
    const load = async () => {
      try {
        const list = await getList('blogs')
        const mapped = list.map(it => ({ id: it._id || it.id, ...it }))
        setPosts(mapped)
        const cats = Array.from(new Set(mapped.map(it => it.category).filter(Boolean)))
        setCategories(cats)
        setActiveCategory(cats[0] || null)
      } catch (e) {
        console.error('Failed to load blogs', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ব্লগ পোস্ট লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (!posts.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">এখনো কোনো ব্লগ পোস্ট নেই</h2>
          <p className="text-gray-600">শীঘ্রই নতুন ব্লগ পোস্ট আসছে!</p>
        </div>
      </div>
    )
  }

  const visiblePosts = activeCategory ? posts.filter(p => p.category === activeCategory) : posts

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'Noto Sans Bengali, ui-sans-serif, sans-serif' }}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ফুলের আসর ব্লগ</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            শিক্ষা, সংস্কৃতি এবং সম্প্রদায় সম্পর্কে চিন্তাভাবনা এবং অন্তর্দৃষ্টি
          </p>
        </div>

        {/* Category Tabs */}
        {!!categories.length && (
          <div className="flex gap-2 flex-wrap justify-center mb-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                  activeCategory === cat
                    ? 'border-green-600 text-green-700 bg-green-50'
                    : 'border-gray-300 text-gray-700 hover:border-green-400 hover:text-green-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visiblePosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
            >
              {/* Content */}
              <div className="p-6">
                {/* Category Badge */}
                {post.category && (
                  <span className="inline-block bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    {post.category}
                  </span>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {post.title}
                </h3>

                {/* Content Excerpt Preview */}
                {(post.content || post.description) && (
                  <p className="text-gray-600 mb-4">
                    {getExcerpt(post.content || post.description)}
                  </p>
                )}

                {/* Read More Button */}
                <NavLink 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                >
                  সম্পূর্ণ পড়ুন
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOne = async () => {
      try {
        const item = await getById('blogs', id)
        setPost(item ? { id: item._id || item.id, ...item } : null)
      } catch (e) {
        console.error('Failed to load blog post', e)
      } finally {
        setLoading(false)
      }
    }
    loadOne()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ব্লগ পোস্ট লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">পোস্ট পাওয়া যায়নি</h1>
          <p className="text-gray-600">এই ব্লগ পোস্টটি পাওয়া যায়নি বা মুছে ফেলা হয়েছে</p>
          <NavLink to="/blog" className="text-orange-600 hover:underline mt-4 inline-block">
            ← সব ব্লগ দেখুন
          </NavLink>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'Noto Sans Bengali, ui-sans-serif, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <NavLink 
          to="/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          সব ব্লগ দেখুন
        </NavLink>

        <article className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <span className="inline-block bg-orange-100 text-orange-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                {post.category}
              </span>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {post.description && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.description}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(post.created_at || post.date || Date.now()).toLocaleDateString('bn-BD')}
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">ট্যাগস:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.split(',').map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export default function Blog() {
  return (
    <Routes>
      <Route index element={<BlogList />} />
      <Route path=":id" element={<BlogPost />} />
    </Routes>
  )
}
