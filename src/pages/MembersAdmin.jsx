import { useEffect, useState } from 'react'
import { getList } from '../services/api'

export default function MembersAdmin() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')

  const loadMembers = async () => {
    setLoading(true)
    setStatus('')
    try {
      const list = await getList('memberships')
      setMembers(Array.isArray(list) ? list : [])
    } catch (e) {
      console.error('MembersAdmin: list load failed', e)
      setStatus('তালিকা লোড করতে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const filtered = members.filter((m) => {
    const hay = [m.name, m.email, m.phone, m.institution, m.class].map((x) => (x || '').toString().toLowerCase()).join(' ')
    return hay.includes(q.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">সদস্য তালিকা</h1>
            <div className="flex items-center gap-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="অনুসন্ধান (নাম, ইমেইল, ক্লাস)"
              />
              <button onClick={loadMembers} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50">রিফ্রেশ</button>
              {loading && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>}
            </div>
          </div>
          {status && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{status}</div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ছবি</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">নাম</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ক্লাস</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">প্রতিষ্ঠান</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ইমেইল</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ফোন</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length ? (
                  filtered.map((m) => (
                    <tr key={m.id} className="border-t">
                      <td className="px-4 py-3">
                        {m.photo_url ? (
                          <img src={m.photo_url} alt={m.name || ''} className="h-12 w-12 object-cover rounded" />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded"></div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800">{m.name || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{m.class || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{m.institution || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{m.email || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{m.phone || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{m.created_at ? new Date(m.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-600">
                      {loading ? 'তালিকা লোড হচ্ছে...' : 'কোনো সদস্য পাওয়া যায়নি'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-sm text-gray-600">মোট সদস্য: {filtered.length}</div>
        </div>
      </div>
    </div>
  )
}