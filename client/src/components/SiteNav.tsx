import { useNavigate } from 'react-router-dom'

export default function SiteNav() {
  const navigate = useNavigate()

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L12 19L2 19Z" /><path d="M12 2L22 19L12 19Z" fill-opacity="0.55" />
            </svg>
          </div>
          <span className="font-display text-xl font-semibold tracking-tight text-slate-900">Prizm</span>
        </a>
        <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <a href="/#how-it-works" className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors">How it works</a>
          <a href="/#verification" className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors">Eligibility</a>
          <a href="/blog" className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors">Blog</a>
          <a
            href="/founding"
            className="px-3 py-2 rounded-lg font-semibold text-amber-700 hover:text-amber-800 hover:bg-amber-50 transition-colors"
          >
            Founding Offer
          </a>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="hidden sm:block px-2 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Sign In
          </button>
          <a
            href="/founding"
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 transition-colors shadow-sm"
          >
            Try Demo
          </a>
        </div>
      </div>
    </nav>
  )
}
