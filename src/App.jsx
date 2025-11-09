import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Membership from './pages/Membership'
import Library from './pages/Library'
import Events from './pages/Events'
import Blog from './pages/Blog'
import Media from './pages/Media'
import Notice from './pages/Notice'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  return (
    <div className="min-h-screen bg-background text-text font-bangla">
      {!isLoginPage && <Navbar />}
      <main className="container py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/library" element={<Library />} />
          <Route path="/events" element={<Events />} />
          <Route path="/blog/*" element={<Blog />} />
          <Route path="/media" element={<Media />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/notice" element={<Notice />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  )
}

export default App
