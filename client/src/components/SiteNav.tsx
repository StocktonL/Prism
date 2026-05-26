import { useNavigate } from 'react-router-dom'

export default function SiteNav() {
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-900/50">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Prizm</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="/#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="/#verification" className="hover:text-white transition-colors">Eligibility</a>
          <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="/blog" className="hover:text-white transition-colors">Blog</a>
          <a
            href="/founding"
            className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Founding Offer
          </a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="rounded-lg border border-teal-500/50 px-4 py-2 text-sm font-semibold text-teal-400 hover:bg-teal-500/10 transition-colors"
          >
            Sign Up
          </button>
          <a
            href="/founding"
            className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-400 transition-colors shadow-lg shadow-teal-900/40"
          >
            Try Demo
          </a>
        </div>
      </div>
    </nav>
  )
}
