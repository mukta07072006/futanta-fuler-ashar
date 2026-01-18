import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const links = [
  { to: '/', label: 'হোম' },
  { to: '/about', label: 'আমাদের সম্পর্কে' },
  {
    type: 'dropdown',
    label: 'অ্যাডমিন', // Add a label for the dropdown button
    items: [
      { to: '/admin', label: 'অ্যাডমিন ড্যাশবোর্ড' },
      { to: '/admin/members', label: 'সদস্য তালিকা' }
    ]
  },
  { to: '/membership', label: 'সদস্যপদ' },
  { to: '/library', label: 'লাইব্রেরি' },
  { to: '/events', label: 'ইভেন্টস' },
  { to: '/contact', label: 'যোগাযোগ' },
  { to: '/blog', label: 'ব্লগ' },
  { to: '/media', label: 'মিডিয়া' },
  { to: '/notice', label: 'নোটিশ' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  const toggleDropdown = (label) => {
    setOpenDropdown((prev) => (prev === label ? null : label))
  }

  const closeAll = () => {
    setMenuOpen(false)
    setOpenDropdown(null)
  }

  return (
    <header
      className="
        sticky top-0 z-50
        bg-white
        border-b border-slate-100
      "
    >
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2" onClick={closeAll}>
          <img
            src={logo}
            alt="ফুটন্ত ফুলের আসর লোগো"
            className="h-10 w-10 object-contain"
            loading="lazy"
          />
          <span className="text-xl font-bold text-green-700">
            ফুটন্ত ফুলের আসর
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3">
          {links.map((link) => {
            if (link.type === 'dropdown') {
              const isOpen = openDropdown === link.label

              return (
                <div key={link.label} className="relative">
                  <button
                    type="button"
                    onClick={() => toggleDropdown(link.label)}
                    className="px-3 py-2 rounded-xl text-slate-700 hover:text-green-700 flex items-center gap-1"
                  >
                    {link.label}
                    <span
                      className={`text-xs transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-md">
                      {link.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={closeAll}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm ${
                              isActive
                                ? 'bg-green-100 text-green-700'
                                : 'text-slate-700 hover:bg-green-50'
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeAll}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl ${
                    isActive
                      ? 'bg-green-100 text-green-700'
                      : 'text-slate-700 hover:text-green-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden p-2 border rounded-xl"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100">
          <div className="container py-3 space-y-2">
            {links.map((link) => {
              if (link.type === 'dropdown') {
                const isOpen = openDropdown === link.label

                return (
                  <div key={link.label}>
                    <button
                      className="w-full text-left px-3 py-2 rounded-xl bg-slate-50"
                      onClick={() => toggleDropdown(link.label)}
                    >
                      {link.label}
                    </button>

                    {isOpen && (
                      <div className="pl-4 mt-1 space-y-1 border-l">
                        {link.items.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={closeAll}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-xl ${
                                isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'text-slate-700 hover:bg-green-50'
                              }`
                            }
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeAll}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-xl ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-slate-700 hover:bg-green-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
