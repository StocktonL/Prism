import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import {
  LayoutDashboard,
  Users,
  Megaphone,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard',  to: '/app/dashboard',  icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Eligibility', to: '/app/eligibility', icon: <ShieldCheck className="h-4 w-4" /> },
  { label: 'Patients',   to: '/app/patients',   icon: <Users className="h-4 w-4" /> },
  { label: 'Campaigns',  to: '/app/campaigns',  icon: <Megaphone className="h-4 w-4" /> },
]

const pageTitles: Record<string, string> = {
  '/app/dashboard':  'Dashboard',
  '/app/eligibility': 'Eligibility Verification',
  '/app/patients':   'Patients',
  '/app/campaigns':  'Campaigns',
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const pageTitle = pageTitles[location.pathname] ?? 'Prizm'

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar — desktop only */}
      <aside className="hidden md:flex w-60 flex-col bg-slate-900">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-700/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-900/30">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L12 19L2 19Z" /><path d="M12 2L22 19L12 19Z" fill-opacity="0.55" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Prizm</span>
        </div>

        {/* Nav label */}
        <div className="px-4 pt-6 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Menu</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-700/60 p-4">
          <p className="text-xs text-slate-600">Prizm v0.1.0</p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
          <h1 className="text-base font-semibold text-slate-800">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                {user?.email?.[0]?.toUpperCase() ?? 'P'}
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-slate-700/60 bg-slate-900">
        <div className="flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-1 py-3 px-1 text-xs font-medium transition-colors',
                  isActive ? 'text-teal-400' : 'text-slate-400'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
