export default function About() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">আমাদের সম্পর্কে</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold text-slate-800">ভূমিকা</h3>
          <p className="text-slate-700 mt-2 text-sm">
            ফুটন্ত ফুলের আসর একটি প্রতিষ্ঠান যা শিশু-কিশোরদের আদর্শ নাগরিক হিসেবে গড়ে তুলতে কাজ করে।
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-slate-800">লক্ষ্য ও উদ্দেশ্য</h3>
          <ul className="text-slate-700 mt-2 text-sm list-disc pl-5 space-y-1">
            <li>সৃজনশীলতা ও নেতৃত্ব গুণের বিকাশ</li>
            <li>নৈতিক মূল্যবোধে শিক্ষিত করা</li>
            <li>সমাজসেবায় অংশগ্রহণ</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800">এক্সিকিউটিভ ও অ্যাডভাইজরি বোর্ড</h3>
        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 mt-3">
          {[
            { name: 'জনাব ক', role: 'সভাপতি' },
            { name: 'জনাব খ', role: 'সহ-সভাপতি' },
            { name: 'জনাব গ', role: 'সাধারণ সম্পাদক' },
          ].map((m, i) => (
            <li key={i} className="p-3 bg-slate-50 rounded-2xl">
              <div className="font-medium text-slate-800">{m.name}</div>
              <div className="text-slate-600 text-sm">{m.role}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}