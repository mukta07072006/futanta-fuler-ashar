import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'হোম' },
  { to: '/about', label: 'আমাদের সম্পর্কে' },
  { to: '/membership', label: 'সদস্যপদ' },
  { to: '/library', label: 'লাইব্রেরি' },
  { to: '/events', label: 'ইভেন্টস' },
  { to: '/blog', label: 'ব্লগ' },
  { to: '/media', label: 'মিডিয়া' },
  { to: '/contact', label: 'যোগাযোগ' },
  { to: '/admin', label: 'অ্যাডমিন' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="container flex items-center justify-between py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="text-xl sm:text-2xl font-bold text-primary">ফুটন্ত ফুলের আসর</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-2xl transition hover:text-primary ${
                  isActive ? 'bg-accent text-primary' : 'text-slate-700'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-2xl border border-slate-200"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm.75 4.5a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="container py-3 grid grid-cols-1 gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-2xl transition ${
                    isActive ? 'bg-accent text-primary' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}