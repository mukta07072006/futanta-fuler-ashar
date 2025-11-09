import { useState, useEffect, useMemo } from 'react'
import { getList } from '../services/api'
import { FiSearch, FiAlertCircle, FiCalendar } from 'react-icons/fi'

const NOTICES_KEY = 'notices'

export default function Notice() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [urgentOnly, setUrgentOnly] = useState(false)

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
                  className={`bg-white rounded-xl border p-5 transition-colors ${
                    notice.urgent ? 'border-red-300' : 'border-green-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-1">
                        {notice.title}
                      </h3>
                      {notice.description && (
                        <p className="text-slate-700 mb-3 leading-relaxed">
                          {notice.description}
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

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              সকল নোটিশ অফিসিয়াল ভাবে প্রকাশিত হয় এবং সদস্যদের জন্য বাধ্যতামূলক
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}