import { useNavigate } from 'react-router-dom'
import {
  Zap,
  ShieldCheck,
  MessageSquare,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  ShoppingBag,
  CalendarRange,
  Bell,
  Upload,
  BarChart3,
  Lock,
} from 'lucide-react'

function startDemo(navigate: ReturnType<typeof useNavigate>) {
  localStorage.setItem('prizm_demo', 'true')
  navigate('/app/dashboard')
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">Prizm</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => startDemo(navigate)}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
            >
              Try Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-xs font-semibold text-teal-700">Built for independent optometry practices</span>
        </div>

        <h1 className="mx-auto mt-4 max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-900">
          Turn unused vision benefits into
          <span className="text-teal-600"> optical revenue</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 leading-relaxed">
          Prizm automatically sends every patient a personalized message with their exact benefit dollar amounts —
          before their insurance expires. Year-round. No manual work.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => startDemo(navigate)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
          >
            <Zap className="h-4 w-4" /> Try the Live Demo
          </button>
          <a
            href="mailto:stockton@prizmvision.com?subject=Demo Request"
            className="flex items-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"
          >
            Request a Demo <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-4 text-xs text-slate-400">No credit card required · HIPAA compliant · Cancel anytime</p>
      </section>

      {/* Aha moment */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-700 p-8 shadow-xl">
          <div className="relative z-10 text-center mb-8">
            <p className="text-sm font-medium text-teal-200 mb-2">The first thing you see after uploading your patient list</p>
            <p className="text-6xl font-black text-white tracking-tight">$127,050</p>
            <p className="mt-3 text-teal-100 text-lg">in recoverable optical revenue sitting in your patient list right now</p>
          </div>
          <div className="relative z-10 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Frame allowances', value: '$82,350', sub: '548 patients' },
              { label: 'Contact lens benefits', value: '$44,700', sub: '299 patients' },
              { label: 'At 20% response rate', value: '~$25,410', sub: 'estimated recovery' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 px-4 py-4 text-center backdrop-blur-sm">
                <p className="text-xs text-teal-200 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-teal-300 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/5" />
          <div className="absolute -right-4 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900">Up and running in one afternoon</h2>
          <p className="mt-3 text-slate-500">No EHR integration required. Works with every practice management system.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              n: '01',
              icon: <Upload className="h-6 w-6 text-teal-600" />,
              title: 'Upload your patient list',
              body: 'Export a CSV from any EHR — RevolutionEHR, Eyefinity, Crystal PM, or any other. Prizm maps your columns automatically.',
              bg: 'bg-teal-50',
            },
            {
              n: '02',
              icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
              title: 'Prizm verifies every benefit',
              body: 'We check each patient\'s exact frame allowance, contact lens benefit, exam coverage, and expiration date — in real time.',
              bg: 'bg-blue-50',
            },
            {
              n: '03',
              icon: <MessageSquare className="h-6 w-6 text-violet-600" />,
              title: 'Campaigns send automatically',
              body: 'Every patient gets a personalized message with their exact dollar amounts. You approve once, Prizm handles the rest year-round.',
              bg: 'bg-violet-50',
            },
          ].map((step) => (
            <div key={step.n} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.bg}`}>
                  {step.icon}
                </div>
                <span className="text-3xl font-black text-slate-100">{step.n}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What makes it different */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Not a blast. A conversation.</h2>
            <p className="mt-3 text-slate-500 max-w-xl mx-auto">
              Generic benefit reminders get ignored. Messages with exact dollar amounts get appointments.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
                bg: 'bg-emerald-50',
                title: 'Exact dollar amounts',
                body: '"You have $150 in frame benefits expiring Dec 31" — not a generic reminder.',
              },
              {
                icon: <Zap className="h-5 w-5 text-teal-600" />,
                bg: 'bg-teal-50',
                title: 'Always-on engine',
                body: 'Prizm sends year-round, not just a Q4 blast. Staggered sends keep your front desk manageable.',
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-violet-600" />,
                bg: 'bg-violet-50',
                title: 'Revenue tracking',
                body: 'See exactly how much optical revenue each campaign recovered — reply rate, appointments, dollars.',
              },
              {
                icon: <Lock className="h-5 w-5 text-blue-600" />,
                bg: 'bg-blue-50',
                title: 'HIPAA compliant',
                body: 'BAA included. Row-level security on all patient data. MFA required. Audit logs on every action.',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${f.bg}`}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Campaign types */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900">Five campaigns built for optometry</h2>
          <p className="mt-3 text-slate-500">Every template includes verified benefit amounts — personalized per patient at send time.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: <CalendarRange className="h-5 w-5 text-rose-600" />, bg: 'bg-rose-50', border: 'border-rose-200', label: 'End of Year Benefits', sub: 'Benefits expire Dec 31' },
            { icon: <Bell className="h-5 w-5 text-teal-600" />, bg: 'bg-teal-50', border: 'border-teal-200', label: 'Mid-Year Reminder', sub: 'July reset plans' },
            { icon: <MessageSquare className="h-5 w-5 text-violet-600" />, bg: 'bg-violet-50', border: 'border-violet-200', label: 'Contact Lens Reorder', sub: '30-day supply window' },
            { icon: <ShoppingBag className="h-5 w-5 text-amber-600" />, bg: 'bg-amber-50', border: 'border-amber-200', label: 'Trunk Show', sub: 'Benefit-aware invite' },
            { icon: <Zap className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50', border: 'border-blue-200', label: 'Back to School', sub: 'Family campaigns' },
          ].map((c) => (
            <div key={c.label} className={`rounded-xl border ${c.border} bg-white p-4`}>
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
                {c.icon}
              </div>
              <p className="text-sm font-bold text-slate-800">{c.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900">Simple pricing</h2>
            <p className="mt-3 text-slate-500">One plan. Everything included. No per-message fees.</p>
          </div>
          <div className="mx-auto max-w-md">
            <div className="rounded-3xl border-2 border-teal-200 bg-white p-8 shadow-lg text-center">
              <p className="text-sm font-semibold text-teal-600 mb-2">Standard</p>
              <p className="text-6xl font-black text-slate-900">$399</p>
              <p className="text-slate-400 mt-1">per month · everything included</p>
              <div className="my-6 space-y-3 text-left">
                {[
                  'Unlimited patients',
                  'Insurance eligibility verification',
                  'All 5 campaign templates',
                  'AI-personalized messages',
                  'SMS + email delivery',
                  'Revenue tracking dashboard',
                  'HIPAA BAA included',
                  'Cancel anytime',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => startDemo(navigate)}
                className="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-md"
              >
                Try the Live Demo
              </button>
              <p className="mt-3 text-xs text-slate-400">
                Founding customer pricing: $199/month for your first 6 months
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-4xl font-black text-slate-900">See your practice's numbers in 5 minutes</h2>
        <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
          Upload your patient list and Prizm shows you exactly how much recoverable revenue is sitting in your practice — before you pay anything.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => startDemo(navigate)}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-base font-bold text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
          >
            <Zap className="h-5 w-5" /> Try the Live Demo
          </button>
          <a
            href="mailto:stockton@prizmvision.com?subject=Demo Request"
            className="rounded-xl border-2 border-slate-200 px-8 py-4 text-base font-bold text-slate-700 hover:border-teal-300 hover:text-teal-700 transition-colors"
          >
            Talk to a human
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-teal-500 to-cyan-600">
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-700">Prizm</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1">
            <Lock className="h-3 w-3 text-emerald-600" />
            <span className="text-xs font-medium text-emerald-700">HIPAA Compliant</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 Prizm Vision. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
