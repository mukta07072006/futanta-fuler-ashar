import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus('Initializing system access...')
    
    try {
      if (!email || !password) {
        setStatus('ERROR: Credentials required for system access')
        setIsLoading(false)
        return
      }
      
      setStatus('Authenticating credentials...')
      await login(email, password)
      
      setStatus('ACCESS GRANTED - Redirecting to secure zone...')
      const redirectTo = location.state?.from?.pathname || '/admin'
      navigate(redirectTo, { replace: true })
    } catch {
      setStatus('SECURITY BREACH: Authentication failed. Verify credentials.')
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    try {
      if (!isSupabaseConfigured || !supabase) {
        setStatus('ERROR: Supabase not configured. Contact admin.')
        return
      }
      if (!email) {
        setStatus('ERROR: Provide USER_IDENTIFIER to reset access key')
        return
      }
      setIsResetting(true)
      setStatus('RESET INIT: Sending recovery email...')
      const redirectTo = `${window.location.origin}/reset-password`
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
      if (error) {
        setStatus('RESET FAILED: Unable to send recovery email.')
      } else {
        setStatus('RECOVERY LINK SENT: Check your inbox.')
      }
    } catch {
      setStatus('RESET FAILED: An unexpected error occurred.')
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="w-72 h-72 bg-cyan-500 rounded-full blur-3xl absolute -top-20 -left-20 animate-pulse"></div>
          <div className="w-72 h-72 bg-purple-500 rounded-full blur-3xl absolute -bottom-20 -right-20 animate-pulse"></div>
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(12,20,39,0.9)_1px,transparent_1px),linear-gradient(90deg,rgba(12,20,39,0.9)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      <form onSubmit={handleLogin} className="relative z-10 bg-gray-800/80 backdrop-blur-md border border-cyan-500/30 rounded-xl p-8 max-w-md w-full space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              DATABASE ACCESS
            </h2>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-gray-400 text-sm font-mono">SECURE ADMIN PORTAL v2.4.1</p>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-cyan-300 text-sm font-mono mb-2 tracking-wider">
              [USER_IDENTIFIER]
            </label>
            <input
              type="email"
              className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-100 font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
              placeholder="user@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-cyan-300 text-sm font-mono mb-2 tracking-wider">
              [ACCESS_KEY]
            </label>
            <input
              type="password"
              className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-100 font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Login Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-mono py-3 px-4 rounded-lg border border-cyan-400/30 hover:border-cyan-300/50 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed tracking-wider font-bold shadow-lg shadow-cyan-500/20"
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>AUTHENTICATING...</span>
            </span>
          ) : (
            'INITIATE ACCESS'
          )}
        </button>

        {/* Forgot Password */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isResetting || isLoading}
            className="text-cyan-300 hover:text-cyan-200 text-sm font-mono underline disabled:opacity-50"
          >
            FORGOT ACCESS KEY?
          </button>
          <span className="text-gray-500 text-xs font-mono">Reset via email link</span>
        </div>

        {/* Status Message */}
        {status && (
          <div className="p-3 bg-gray-900/50 border border-cyan-500/20 rounded-lg">
            <p className={`text-sm font-mono tracking-wide ${
              status.includes('GRANTED') ? 'text-green-400' : 
              status.includes('ERROR') || status.includes('BREACH') ? 'text-red-400' : 
              'text-cyan-300'
            }`}>
              {`> ${status}`}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-700/50">
          <p className="text-gray-500 text-xs font-mono">
            {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })} | SECURITY LEVEL: MAXIMUM
          </p>
        </div>
      </form>
    </div>
  )
}
