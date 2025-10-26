export default function Library() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">লাইব্রেরি</h2>
      <p className="text-slate-700">Firebase Storage সংযোগের পর এখানে PDF এবং গবেষণা তালিকা দেখাবে।</p>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="card">
            <div className="font-medium">Sample PDF #{i}</div>
            <button className="btn-primary mt-3">ডাউনলোড</button>
          </div>
        ))}
      </div>
    </div>
  )
}