import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isSupabaseConfigured } from '../supabase/client.js'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  // If Supabase isn't configured yet, allow access (demo mode)
  if (!isSupabaseConfigured) {
    return children
  }

  if (loading) {
    return <div className="container py-8">লোড হচ্ছে...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}