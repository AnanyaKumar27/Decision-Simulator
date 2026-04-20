import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { logout } from '../services/authService'

const NAV = [
  { to: '/', icon: 'Home', label: 'Dashboard' },
  { to: '/builder', icon: 'New', label: 'New Scenario' },
  { to: '/history', icon: 'List', label: 'History' },
]

export default function Layout({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map((word) => word[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="min-h-screen flex bg-transparent">
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="px-6 py-7 border-b border-white/10">
          <span className="font-display font-bold text-xl text-white tracking-tight">
            Decision<span className="text-brand-400">Lab</span>
          </span>
          <p className="text-surface-muted text-xs mt-1 uppercase tracking-[0.24em]">Curated Decisions</p>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-2">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-150
                 ${isActive
                   ? 'bg-white/10 text-white border border-white/10 shadow-lg'
                   : 'text-surface-muted hover:text-white hover:bg-white/5'}`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-300 text-xs font-bold font-display">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || 'User'}</p>
              <p className="text-xs text-surface-muted truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-surface-muted hover:text-white transition-colors text-sm"
              title="Logout"
            >
              Log out
            </button>
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#22181dcc]/90 backdrop-blur-xl flex items-center justify-between px-4 py-3">
        <span className="font-display font-bold text-lg">
          Decision<span className="text-brand-400">Lab</span>
        </span>
        <button onClick={() => setOpen(!open)} className="text-white text-sm">
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#22181df0] pt-16 px-4 backdrop-blur-xl">
          <nav className="space-y-2">
            {NAV.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-full text-base font-medium
                   ${isActive ? 'bg-white/10 text-white' : 'text-surface-muted'}`
                }
              >
                <span>{icon}</span>
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-red-400 text-base w-full"
            >
              <span>Out</span> Logout
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        {children}
      </main>
    </div>
  )
}
