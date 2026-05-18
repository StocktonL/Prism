import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'
import {
  LayoutDashboard,
  Users,
  Megaphone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Patients', to: '/patients', icon: <Users className="h-4 w-4" /> },
  { label: 'Campaigns', to: '/campaigns', icon: <Megaphone className="h-4 w-4" /> },
]

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/campaigns': 'Campaigns',
}

export default function AppLayout() {
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] ?? 'Prism'

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col bg-slate-900">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-700/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-900/30">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Prism</span>
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
          <p className="text-xs text-slate-600">Prism v0.1.0</p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
          <h1 className="text-base font-semibold text-slate-800">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
