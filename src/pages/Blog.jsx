import { NavLink, Routes, Route, useParams } from 'react-router-dom'

const posts = [
  { id: '1', title: 'শিশুদের নৈতিক শিক্ষা', category: 'শিক্ষা', content: 'বিস্তারিত...' },
  { id: '2', title: 'সৃজনশীলতা বাড়ানোর উপায়', category: 'সৃজনশীলতা', content: 'বিস্তারিত...' },
]

function BlogList() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">ব্লগ</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map(p => (
          <div key={p.id} className="card">
            <div className="font-semibold text-slate-800">{p.title}</div>
            <div className="text-slate-600 text-sm">{p.category}</div>
            <NavLink to={`/blog/${p.id}`} className="text-primary hover:underline text-sm mt-2 inline-block">পড়ুন</NavLink>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlogPost() {
  const { id } = useParams()
  const post = posts.find(p => p.id === id)
  if (!post) return <div className="card">পোস্ট পাওয়া যায়নি।</div>
  return (
    <article className="space-y-3">
      <h1 className="text-2xl font-bold text-slate-900">{post.title}</h1>
      <p className="text-slate-600 text-sm">ক্যাটাগরি: {post.category}</p>
      <div className="card">{post.content}</div>
    </article>
  )
}

export default function Blog() {
  return (
    <Routes>
      <Route index element={<BlogList />} />
      <Route path=":id" element={<BlogPost />} />
    </Routes>
  )
}