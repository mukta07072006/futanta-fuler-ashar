import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../supabase/client'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isSupabaseConfigured || !supabase) {
      setStatus('ERROR: Supabase not configured. Contact admin.')
      return
    }
    if (!password || !confirm) {
      setStatus('ERROR: Enter and confirm new access key')
      return
    }
    if (password !== confirm) {
      setStatus('ERROR: Access keys do not match')
      return
    }
    if (password.length < 6) {
      setStatus('ERROR: Minimum length is 6 characters')
      return
    }
    try {
      setSubmitting(true)
      setStatus('UPDATING: Applying new access key...')
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        setStatus('UPDATE FAILED: Please retry or request a new link')
      } else {
        setStatus('SUCCESS: Access key updated. Redirecting...')
        setTimeout(() => navigate('/login', { replace: true }), 1500)
      }
    } catch {
      setStatus('UPDATE FAILED: Unexpected error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white border border-green-200 rounded-xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-700">Reset Access Key</h2>
          <p className="text-slate-600 text-sm mt-1">Set a new password for your account</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 text-sm mb-2">New Password</label>
            <input
              type="password"
              className="w-full bg-white border border-green-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-slate-700 text-sm mb-2">Confirm New Password</label>
            <input
              type="password"
              className="w-full bg-white border border-green-200 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={submitting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg border border-green-700/30 transition-all"
        >
          {submitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
        </button>

        {status && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-slate-800">{status}</p>
          </div>
        )}
      </form>
    </div>
  )
}
