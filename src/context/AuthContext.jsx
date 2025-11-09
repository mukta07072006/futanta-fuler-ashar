import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../supabase/client'

const AuthContext = createContext({ user: null })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false)
      return
    }

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      const u = data.session?.user || null
      setUser(u)
      setIsAdmin(checkAdmin(u))
      setLoading(false)
    }
    init()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null
      setUser(u)
      setIsAdmin(checkAdmin(u))
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) return null
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setUser(data.user)
    setIsAdmin(checkAdmin(data.user))
    return data.user
  }

  const loginWithGoogle = async () => {
    if (!isSupabaseConfigured || !supabase) return null
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) throw error
    // For OAuth, user will be updated via onAuthStateChange after redirect
    return data?.user || null
  }

  const logout = async () => {
    if (!isSupabaseConfigured || !supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setIsAdmin(false)
  }

  function checkAdmin(u) {
    if (!u?.email) return false
    const allow = (import.meta.env.VITE_ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
    return allow.length ? allow.includes(u.email.toLowerCase()) : false
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}