import CountdownTimer from '../components/CountdownTimer'
import { NavLink } from 'react-router-dom'

const notices = [
  { id: 1, title: 'সদস্য নিবন্ধন চলছে', date: '2025-11-01' },
  { id: 2, title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', date: '2025-12-15' },
]

const publications = [
  { id: 1, title: 'শিশুদের জন্য গল্প সংগ্রহ (PDF)' },
  { id: 2, title: 'গবেষণা প্রতিবেদন ২০২৫ (PDF)' },
]

export default function Home() {
  const nextEvent = new Date()
  nextEvent.setMonth(nextEvent.getMonth() + 1)

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="grid gap-6 lg:grid-cols-2 items-center">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">ফুটন্ত ফুলের আসর</h1>
          <p className="text-slate-700">শিশু কিশোরদের আদর্শ নাগরিক হিসেবে গড়ে তোলায় আমাদের লক্ষ্য</p>
          <NavLink to="/membership" className="btn-primary w-max">এখনই যোগ দিন</NavLink>
        </div>
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-3">আগামী বড় ইভেন্টের কাউন্টডাউন</h3>
          <CountdownTimer targetDate={nextEvent} />
        </div>
      </section>

      {/* Mission & Vision preview */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold text-slate-800">আমাদের লক্ষ্য</h3>
          <p className="text-slate-700 mt-2 text-sm">
            শিশু-কিশোরদের ভিতরে সৃজনশীলতা, নৈতিকতা ও নেতৃত্ব গুণের বিকাশ ঘটানো।
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-slate-800">আমাদের দৃষ্টি</h3>
          <p className="text-slate-700 mt-2 text-sm">
            একটি আদর্শ সমাজ যেখানে প্রতিটি শিশু আত্মবিশ্বাসী, সৃজনশীল ও মানবিক।
          </p>
        </div>
      </section>

      {/* Latest Notices */}
      <section className="card">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">সর্বশেষ নোটিশ</h3>
          <NavLink to="/admin" className="text-primary hover:underline text-sm">ম্যানেজ করুন</NavLink>
        </div>
        <ul className="mt-3 divide-y divide-slate-100">
          {notices.map(n => (
            <li key={n.id} className="py-2 flex items-center justify-between">
              <span className="text-slate-700">{n.title}</span>
              <span className="text-slate-500 text-sm">{n.date}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured Publications */}
      <section className="card">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">ফিচার্ড প্রকাশনা</h3>
          <NavLink to="/library" className="text-primary hover:underline text-sm">সব দেখুন</NavLink>
        </div>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {publications.map(p => (
            <li key={p.id} className="p-3 rounded-2xl bg-slate-50">{p.title}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}