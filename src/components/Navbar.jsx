import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'

const links = [
  { to: '/', label: 'হোম' },
  { 
    type: 'dropdown', 
    label: 'আমাদের সম্পর্কে', 
    items: [
      { to: '/about', label: 'আমাদের সম্পর্কে' },
      { to: '/admin', label: 'অ্যাডমিন ড্যাশবোর্ড' },
      { to: '/admin/members', label: 'সদস্য তালিকা' }
    ]
  },
  { to: '/membership', label: 'সদস্যপদ' },
  { to: '/library', label: 'লাইব্রেরি' },
  { to: '/events', label: 'ইভেন্টস' },
  { 
    type: 'dropdown', 
    label: 'কন্টেন্ট', 
    items: [
      { to: '/blog', label: 'ব্লগ' },
     { to: '/media', label: 'মিডিয়া' },
      { to: '/notice', label: 'নোটিশ' }
    ]
  }
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false)
  const [contentDropdownOpen, setContentDropdownOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="container flex items-center justify-between py-3">
        <NavLink to="/" className="flex items-center gap-2">
        <img src={logo} alt="ফুটন্ত ফুলের আসর লোগো" className="h-10 w-10 object-contain" />
          <span className="text-xl sm:text-2xl font-bold text-green-700">ফুটন্ত ফুলের আসর</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-4">
          {links.map((link) => {
            if (link.type === 'dropdown') {
              const isAboutDropdown = link.label === 'আমাদের সম্পর্কে'
              const isContentDropdown = link.label === 'কন্টেন্ট'
              const isOpen = isAboutDropdown ? aboutDropdownOpen : isContentDropdown ? contentDropdownOpen : false
              const setIsOpen = isAboutDropdown ? setAboutDropdownOpen : isContentDropdown ? setContentDropdownOpen : () => {}

              return (
                <div key={link.label} className="relative group">
                  <button
                    className="px-3 py-2 rounded-2xl transition hover:text-green-700 text-slate-700 flex items-center gap-1"
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                  >
                    {link.label}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isOpen && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
                      onMouseEnter={() => setIsOpen(true)}
                      onMouseLeave={() => setIsOpen(false)}
                    >
                      {link.items.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-sm transition hover:bg-green-50 ${
                              isActive ? 'text-green-700 bg-green-100' : 'text-slate-700'
                            }`
                          }
                          onClick={() => setIsOpen(false)}
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
                className={({ isActive }) =>
                  `px-3 py-2 rounded-2xl transition hover:text-green-700 ${
                    isActive ? 'bg-green-100 text-green-700' : 'text-slate-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          })}
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
            {links.map((link) => {
              if (link.type === 'dropdown') {
                const isAboutDropdown = link.label === 'আমাদের সম্পর্কে'
                const isContentDropdown = link.label === 'কন্টেন্ট'
                const isOpen = isAboutDropdown ? aboutDropdownOpen : isContentDropdown ? contentDropdownOpen : false
                const setIsOpen = isAboutDropdown ? setAboutDropdownOpen : isContentDropdown ? setContentDropdownOpen : () => {}

                return (
                  <div key={link.label} className="space-y-2">
                    <button
                      className="w-full text-left px-3 py-2 rounded-2xl transition text-slate-700 bg-slate-50"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      {link.label}
                    </button>
                    {isOpen && (
                      <div className="pl-4 space-y-2 border-l-2 border-slate-200 ml-2">
                        {link.items.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => {
                              setOpen(false)
                              setIsOpen(false)
                            }}
                            className={({ isActive }) =>
                              `block px-3 py-2 rounded-2xl transition ${
                                isActive ? 'bg-green-100 text-green-700' : 'text-slate-700 hover:bg-green-50'
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
                  onClick={() => setOpen(false)}
                className={({ isActive }) =>
                    `px-3 py-2 rounded-2xl transition ${
                      isActive ? 'bg-green-100 text-green-700' : 'text-slate-700 hover:bg-green-50'
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