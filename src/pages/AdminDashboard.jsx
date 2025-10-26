import { useState } from 'react'

const tabs = [
  { key: 'members', label: 'Members' },
  { key: 'library', label: 'Library' },
  { key: 'notices', label: 'Notices' },
  { key: 'events', label: 'Events' },
  { key: 'blogs', label: 'Blogs' },
]

export default function AdminDashboard() {
  const [active, setActive] = useState('members')

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`px-4 py-2 rounded-2xl border ${active === t.key ? 'bg-accent text-primary border-accent' : 'border-slate-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-3">{tabs.find(t => t.key === active)?.label}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="border border-slate-200 rounded-2xl px-4 py-2" placeholder="Title" />
          <input className="border border-slate-200 rounded-2xl px-4 py-2" placeholder="Category / Type" />
          <textarea className="border border-slate-200 rounded-2xl px-4 py-2 sm:col-span-2" placeholder="Description" rows={3} />
          <button className="btn-primary sm:col-span-2">Save</button>
        </div>
      </div>
    </div>
  )
}