import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getList } from '../services/api'
import noImage from '../assets/empty.jpg'

// Animation for the "Coming Up" scroll effect
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 60, damping: 20 } 
  }
}

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
    <div className="min-h-screen bg-[#f1f2f4] py-8 font-sans">
      <div className="max-w-[1300px] mx-auto px-4">
        
        {/* Header Section */}
        <div className="bg-white rounded shadow-sm border border-gray-200 p-6 mb-6 flex justify-between items-center">
           <div>
              <h1 className="text-2xl font-bold text-gray-800">লাইব্রেরি কালেকশন</h1>
              <p className="text-sm text-gray-500 mt-1">সর্বমোট {items.length} টি বই ও ডকুমেন্ট</p>
           </div>
           {/* Filter/Sort Placeholder - mimic e-commerce headers */}
           <div className="hidden sm:flex gap-2">
              <select className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-600 outline-none focus:border-blue-500">
                 <option>Sort by: Newest</option>
                 <option>Sort by: Popular</option>
              </select>
           </div>
        </div>

        {/* Loading State - Skeleton Grid */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white p-3 rounded border border-gray-100 animate-pulse">
                <div className="bg-gray-200 aspect-[2/3] w-full mb-3 rounded-sm"></div>
                <div className="h-4 bg-gray-200 w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 w-full rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Content Grid */}
        {!loading && (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
          >
            {items.map((it) => (
              <motion.div
                key={it.id}
                variants={cardVariants}
                className="group relative bg-white border border-gray-200 rounded hover:shadow-lg hover:border-transparent transition-all duration-300 flex flex-col"
              >
                {/* Book Cover Section */}
                <div className="p-4 flex justify-center bg-white relative overflow-hidden">
                  <div className="relative w-full aspect-[2/3] max-w-[160px] shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={it.thumbnail || noImage}
                      alt={it.title}
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.src = noImage)}
                    />
                    
                    {/* View Details Overlay (Rokomari Style) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                       <button 
                         onClick={() => openUrl(it.url || it.downloadUrl)}
                         className="bg-white/90 text-gray-800 text-xs font-bold px-4 py-2 rounded-full transform scale-90 group-hover:scale-100 transition-transform"
                       >
                         PREVIEW
                       </button>
                    </div>
                  </div>

                  {/* Badge (e.g., PDF/New) - Mimics Discount Badge */}
                  {(it.category || it.type) && (
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-l-md shadow-sm z-10">
                      {it.category || it.type}
                    </span>
                  )}
                </div>

                {/* Info Section */}
                <div className="px-3 pb-3 flex flex-col flex-grow text-center">
                  
                  {/* Title */}
                  <h3 className="text-gray-800 font-semibold text-[15px] leading-tight line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer" title={it.title}>
                    {it.title || 'Untitled'}
                  </h3>

                 

                  {/* Action Button */}
                  <button
                    onClick={() => openUrl(it.url || it.downloadUrl)}
                    disabled={!it.url && !it.downloadUrl}
                    className="w-full border border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white font-medium text-sm py-1.5 rounded transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    {it.url || it.downloadUrl ? 'ডাউনলোড' : 'Unavailable'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Empty State */}
        {!loading && items.length === 0 && (
           <div className="text-center py-20 bg-white rounded shadow border border-gray-100">
              <div className="text-6xl mb-4 text-gray-200">☹</div>
              <p className="text-gray-500 text-lg">কোনো ফলাফল পাওয়া যায়নি</p>
           </div>
        )}
      </div>
    </div>
  )
}