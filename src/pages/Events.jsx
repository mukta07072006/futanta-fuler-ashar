import CountdownTimer from '../components/CountdownTimer'

export default function Events() {
  const upcoming = new Date()
  upcoming.setDate(upcoming.getDate() + 20)
  const pastEvents = [
    { title: 'শিশুদের চিত্রাঙ্কন প্রতিযোগিতা', date: '2025-08-05' },
    { title: 'পাঠচক্র: গল্পের আসর', date: '2025-06-10' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">ইভেন্টস</h2>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-2">আগামী ইভেন্ট</h3>
        <CountdownTimer targetDate={upcoming} />
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800">গত ইভেন্টসমূহ</h3>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {pastEvents.map((e, i) => (
            <li key={i} className="p-3 bg-slate-50 rounded-2xl">
              <div className="font-medium text-slate-800">{e.title}</div>
              <div className="text-slate-600 text-sm">{e.date}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}