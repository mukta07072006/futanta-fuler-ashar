import { useState, useEffect, useMemo } from 'react'
import { getList } from '../services/api'
import { FiSearch, FiAlertCircle, FiCalendar, FiX, FiExternalLink } from 'react-icons/fi'

const NOTICES_KEY = 'notices'

export default function Notice() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState(null)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const list = await getList(NOTICES_KEY)
        const normalized = list.map(it => ({ id: it._id || it.id, ...it }))
        const sorted = normalized.sort((a, b) => new Date(b.date) - new Date(a.date))
        setNotices(sorted)
      } catch (error) {
        console.error('Error fetching notices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  const types = useMemo(() => {
    const t = new Set()
    notices.forEach(n => {
      if (n.type && String(n.type).trim()) t.add(String(n.type).trim())
    })
    return ['all', ...Array.from(t)]
  }, [notices])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return notices.filter(n => {
      const matchesSearch = term
        ? [n.title, n.description, n.extra].some(v => String(v || '').toLowerCase().includes(term))
        : true
      const matchesType = activeType === 'all' ? true : String(n.type || '').trim() === activeType
      const matchesUrgent = urgentOnly ? Boolean(n.urgent) : true
      return matchesSearch && matchesType && matchesUrgent
    })
  }, [notices, search, activeType, urgentOnly])

  // Function to render clickable links in text
  const renderTextWithLinks = (text) => {
    if (!text) return null
    
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 underline inline-flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
            <FiExternalLink size={12} />
          </a>
        )
      }
      return part
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-green-700">নোটিশ বোর্ড</h1>
            <p className="text-slate-600 mt-1">সকল গুরুত্বপূর্ণ ঘোষণা এবং বিজ্ঞপ্তি</p>
          </div>

          {/* Controls */}
          <div className="bg-white border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="শিরোনাম বা বিবরণে খোঁজ করুন"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
              </div>

              {/* Urgent toggle */}
              <label className="inline-flex items-center gap-2 text-sm text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(e) => setUrgentOnly(e.target.checked)}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="flex items-center gap-1">
                  <FiAlertCircle className="text-red-600" />
                  জরুরি
                </span>
              </label>
            </div>

            {/* Types */}
            {types.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      activeType === t
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {t === 'all' ? 'সব' : t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notices List */}
          <div className="space-y-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">কোন নোটিশ নেই</h3>
                <p className="text-slate-500">বর্তমানে কোন নোটিশ প্রকাশ করা হয়নি</p>
              </div>
            ) : (
              filtered.map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className={`bg-white rounded-xl border p-5 transition-colors cursor-pointer hover:shadow-md ${
                    notice.urgent 
                      ? 'border-red-300 hover:border-red-400' 
                      : 'border-green-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">
                        {notice.title}
                      </h3>
                      {notice.description && (
                        <p className="text-slate-700 mb-3 leading-relaxed line-clamp-2">
                          {renderTextWithLinks(notice.description)}
                        </p>
                      )}
                    </div>
                    
                    {notice.urgent && (
                      <span className="ml-4 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full whitespace-nowrap border border-red-200">
                        জরুরি
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 inline-flex items-center gap-1">
                      <FiCalendar className="text-green-700" />
                      {new Date(notice.date).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    
                    {notice.extra && (
                      <span className="text-sm text-slate-500">
                        {notice.extra}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notice Detail Modal */}
          {selectedNotice && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div 
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedNotice.title}</h2>
                    {selectedNotice.type && selectedNotice.type !== 'all' && (
                      <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        {selectedNotice.type}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <FiX size={24} className="text-slate-500" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  {selectedNotice.urgent && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700 font-medium">
                        <FiAlertCircle />
                        জরুরি নোটিশ
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">বিস্তারিত</h3>
                    {selectedNotice.description ? (
                      <div className="prose prose-green max-w-none">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {renderTextWithLinks(selectedNotice.description)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500">কোন বিবরণ নেই</p>
                    )}
                  </div>

                  {/* Additional details if available */}
                  {(selectedNotice.extra || selectedNotice.additionalInfo) && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="text-md font-semibold text-slate-800 mb-2">অতিরিক্ত তথ্য</h4>
                      <p className="text-slate-600">
                        {selectedNotice.extra || selectedNotice.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t bg-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-green-700" />
                        প্রকাশের তারিখ: {new Date(selectedNotice.date).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </div>
                      {selectedNotice.author && (
                        <div className="mt-2">
                          <span className="font-medium">প্রকাশক:</span> {selectedNotice.author}
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setSelectedNotice(null)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      বন্ধ করুন
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              সকল নোটিশ অফিসিয়াল ভাবে প্রকাশিত হয় এবং সদস্যদের জন্য বাধ্যতামূলক
            </p>
            <p className="text-slate-400 text-xs mt-2">
              নোটিশ দেখতে ক্লিক করুন | লিংক সমূহ ক্লিকযোগ্য
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}