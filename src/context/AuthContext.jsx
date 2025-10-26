import { createContext, useContext, useEffect, useState } from 'react'
import { auth, provider, isFirebaseConfigured } from '../firebase/config'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth'

const AuthContext = createContext({ user: null })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const login = async (email, password) => {
    if (!isFirebaseConfigured) return null
    const res = await signInWithEmailAndPassword(auth, email, password)
    setUser(res.user)
    return res.user
  }

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) return null
    const res = await signInWithPopup(auth, provider)
    setUser(res.user)
    return res.user
  }

  const logout = async () => {
    if (!isFirebaseConfigured) return
    await signOut(auth)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}