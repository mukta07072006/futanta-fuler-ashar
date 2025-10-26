export default function Media() {
  const photos = Array.from({ length: 8 }, (_, i) => ({ id: i + 1 }))
  const videos = Array.from({ length: 4 }, (_, i) => ({ id: i + 1 }))
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">মিডিয়া গ্যালারি</h2>
      <div className="card">
        <h3 className="font-semibold text-slate-800">ছবি</h3>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-3">
          {photos.map(p => (
            <div key={p.id} className="rounded-2xl bg-slate-100 h-24" />
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold text-slate-800">ভিডিও</h3>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mt-3">
          {videos.map(v => (
            <div key={v.id} className="rounded-2xl bg-slate-100 h-24" />
          ))}
        </div>
      </div>
    </div>
  )
}