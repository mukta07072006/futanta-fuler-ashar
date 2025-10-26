import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Sending...')
    try {
      // Optional EmailJS config: requires VITE_EMAILJS_* envs
      const service = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const template = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      if (service && template && publicKey) {
        const payload = { from_name: form.name, reply_to: form.email, message: form.message }
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service_id: service, template_id: template, user_id: publicKey, template_params: payload }),
        })
      }
      setStatus('Message sent!')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('Failed to send. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">যোগাযোগ</h2>
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
        <textarea
          className="w-full border border-slate-200 rounded-2xl px-4 py-2"
          placeholder="বার্তা"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button className="btn-primary" type="submit">পাঠান</button>
        {status && <p className="text-sm text-slate-600">{status}</p>}
      </form>
      <div className="card">
        <h3 className="font-semibold text-slate-800">লোকেশন</h3>
        <div className="mt-3 bg-slate-100 rounded-2xl h-48 flex items-center justify-center text-slate-500 text-sm">
          Google Map Embed Here
        </div>
      </div>
    </div>
  )
}