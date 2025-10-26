import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    // Placeholder login; will connect to Firebase Auth later
    if (email && password) {
      setStatus('Logged in (demo).')
      navigate('/admin')
    } else {
      setStatus('Please enter credentials.')
    }
  }

  return (
    <form onSubmit={handleLogin} className="card space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-slate-900">Admin Login</h2>
      <input
        type="email"
        className="w-full border border-slate-200 rounded-2xl px-4 py-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full border border-slate-200 rounded-2xl px-4 py-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn-primary" type="submit">Login</button>
      {status && <p className="text-sm text-slate-600">{status}</p>}
    </form>
  )
}