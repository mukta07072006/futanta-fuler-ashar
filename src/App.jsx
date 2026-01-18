import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Membership from './pages/Membership'
import Library from './pages/Library'
import Events from './pages/Events'
import Blog from './pages/Blog'
import Media from './pages/Media'
import Notice from './pages/Notice'
import AdminDashboard from './pages/AdminDashboard'
import MembersAdmin from './pages/MembersAdmin'
import MediaManager from './pages/MediaManager'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'
import BlogDetail from './components/BlogDetail'

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  return (
    <div className="min-h-screen bg-background text-text font-bangla">
      {!isLoginPage && <Navbar />}
      <main className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/library" element={<Library />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blog/*" element={<Blog />} />
          <Route path="/media" element={<Media />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/members" element={<ProtectedRoute requireAdmin={true}><MembersAdmin /></ProtectedRoute>} />
          <Route path="/admin/media" element={<ProtectedRoute requireAdmin={true}><MediaManager /></ProtectedRoute>} />
          <Route path="/notice" element={<Notice />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  )
}

export default App
