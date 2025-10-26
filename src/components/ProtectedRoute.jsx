import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { isFirebaseConfigured } from '../firebase/config.js'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // If Firebase isn't configured yet, allow access (demo mode)
  if (!isFirebaseConfigured) {
    return children
  }

  if (loading) {
    return <div className="container py-8">লোড হচ্ছে...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}