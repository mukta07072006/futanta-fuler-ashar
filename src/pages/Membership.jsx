import { useState } from 'react'

export default function Membership() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Submitting...')
    try {
      // Optional: send to Google Sheets webhook if provided
      const webhook = import.meta.env.VITE_SHEETS_WEBHOOK_URL
      if (webhook) {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      setStatus('Submitted successfully!')
      setForm({ name: '', email: '', phone: '' })
    } catch (err) {
      setStatus('Submission failed. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">সদস্য নিবন্ধন</h2>
      <form onSubmit={handleSubmit} className="card space-y-4 max-w-lg">
        <input
          className="w-full border border-slate-200 rounded-2xl px-4 py-2"
          placeholder="নাম"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          className="w-full border border-slate-200 rounded-2xl px-4 py-2"
          placeholder="ইমেইল"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full border border-slate-200 rounded-2xl px-4 py-2"
          placeholder="ফোন"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button className="btn-primary" type="submit">জমা দিন</button>
        {status && <p className="text-sm text-slate-600">{status}</p>}
      </form>
    </div>
  )
}