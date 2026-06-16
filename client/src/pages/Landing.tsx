import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap,
  ShieldCheck,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  BarChart3,
  Lock,
  ArrowRight,
  TrendingUp,
  Bell,
  FileCheck,
  Users,
  Sparkles,
  X,
  MessageSquare,
} from 'lucide-react'

// ─── Lead capture modal ───────────────────────────────────────────────────────
import { useForm, ValidationError } from '@formspree/react'

type ModalVariant = 'demo' | 'contact'

function DemoModal({ onClose, onSubmit, variant = 'demo' }: { onClose: () => void; onSubmit: () => void; variant?: ModalVariant }) {
  const [state, handleSubmit] = useForm('mykveaoq')
  const isContact = variant === 'contact'

  // After successful submission: enter demo or show confirmation
  useEffect(() => {
    if (state.succeeded && !isContact) {
      setTimeout(() => onSubmit(), 400)
    }
  }, [state.succeeded])

  // Contact variant — confirmation screen
  if (isContact && state.succeeded) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 border border-teal-100">
            <CheckCircle2 className="h-6 w-6 text-teal-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">You're on the list</h2>
          <p className="text-sm text-slate-600 mb-6">Our team will reach out personally within 24 hours to schedule your demo and walk through your practice's numbers.</p>
          <button onClick={onClose} className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors">
            Got it
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 mb-4">
            {isContact
              ? <MessageSquare className="h-5 w-5 text-teal-600" />
              : <Zap className="h-5 w-5 text-teal-600" />}
          </div>
          <h2 className="text-xl font-black text-slate-900">
            {isContact ? 'Let\'s talk' : 'Get instant access to the demo'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600">
            {isContact
              ? 'Leave your info and a note. Our team will reach out personally within 24 hours.'
              : 'We\'ll show you your practice\'s recoverable revenue — free, no credit card.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Hidden field tells you whether this was a demo signup or contact request */}
          <input type="hidden" name="type" value={isContact ? 'Contact Request' : 'Demo Signup'} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Your name</label>
              <input
                required
                name="name"
                placeholder="Sarah Johnson"
                className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Practice name</label>
              <input
                required
                name="practice"
                placeholder="Valley Eye Care"
                className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Work email</label>
            <input
              required
              type="email"
              name="email"
              placeholder="sarah@valleyeyecare.com"
              className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
            <ValidationError field="email" errors={state.errors} className="text-xs text-red-400 mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Phone number</label>
            <input
              required
              type="tel"
              name="phone"
              placeholder="(801) 555-1234"
              className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">
              {isContact ? 'What\'s on your mind?' : 'Anything you\'d like us to know? (optional)'}
            </label>
            <textarea
              required={isContact}
              name="message"
              placeholder={isContact
                ? 'How many patients do you have? Which EHR do you use? Any questions about Prizm?'
                : 'e.g. "We have about 2,000 patients on VSP and EyeMed..."'}
              rows={3}
              className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 transition-colors resize-none"
            />
            <ValidationError field="message" errors={state.errors} className="text-xs text-red-400 mt-1" />
          </div>
          <button
            type="submit"
            disabled={state.submitting}
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors disabled:opacity-60 mt-2 shadow-lg shadow-teal-600/20"
          >
            {state.submitting
              ? (isContact ? 'Sending...' : 'Opening demo...')
              : (isContact ? 'Send — I\'ll hear from you soon →' : 'Show me the demo →')}
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-slate-500">No credit card · HIPAA compliant · We'll follow up within 24 hours</p>
      </div>
    </div>
  )
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 sm:px-8 py-5 sm:py-6 bg-white">
      <span className="text-2xl sm:text-4xl font-black text-slate-900">{value}</span>
      <span className="text-xs sm:text-sm text-slate-500 text-center leading-tight">{label}</span>
    </div>
  )
}

// ─── Mock message bubble ──────────────────────────────────────────────────────
interface BubbleProps {
  initials: string
  name: string
  tag: string
  tagColor: string
  message: string
  time?: string
}

function MessageBubble({ initials, name, tag, tagColor, message, time = 'Just now' }: BubbleProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl border border-slate-100">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
          <p className="text-xs text-slate-400">SMS · {time}</p>
        </div>
        <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${tagColor}`}>{tag}</span>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{message}</p>
    </div>
  )
}

// ─── Verification card mock ───────────────────────────────────────────────────
function VerificationCard() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-lg shadow-slate-200/60">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Eligibility Check</span>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          VSP · Active
        </span>
      </div>
      <p className="text-base font-bold text-slate-900 mb-4">Sarah Mitchell · DOB 03/22/1985</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: 'Frame Allowance', value: '$150', status: 'unused' },
          { label: 'Contact Lens', value: '$130', status: 'unused' },
          { label: 'Exam Copay', value: '$10', status: 'covered' },
          { label: 'Plan Expires', value: 'Dec 31', status: 'warning' },
        ].map((b) => (
          <div key={b.label} className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
            <p className="text-xs text-slate-500 mb-0.5">{b.label}</p>
            <p className="text-sm font-bold text-slate-900">{b.value}</p>
            <span className={`text-xs font-medium ${
              b.status === 'unused' ? 'text-emerald-600' :
              b.status === 'warning' ? 'text-amber-600' : 'text-teal-600'
            }`}>
              {b.status === 'unused' ? '● Unused' : b.status === 'warning' ? '● Expiring' : '● Covered'}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-teal-50 border border-teal-100 px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-teal-700">AI recommendation</span>
        <span className="text-xs font-semibold text-teal-700">Send frame + CL campaign →</span>
      </div>
    </div>
  )
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  function openDemo() { setShowModal(true) }
  function openContact() { setShowContactModal(true) }

  function enterDemo() {
    setShowModal(false)
    localStorage.setItem('prizm_demo', 'true')
    navigate('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-slate-900">

      {showModal && <DemoModal onClose={() => setShowModal(false)} onSubmit={enterDemo} variant="demo" />}
      {showContactModal && <DemoModal onClose={() => setShowContactModal(false)} onSubmit={() => setShowContactModal(false)} variant="contact" />}

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 shadow-sm">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900">Prizm</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#verification" className="hover:text-slate-900 transition-colors">Eligibility</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="/blog" className="hover:text-slate-900 transition-colors">Blog</a>
            <a
              href="/founding"
              className="font-semibold text-amber-600 hover:text-amber-700 transition-colors"
            >
              Founding Offer
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="rounded-lg border border-teal-600/40 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
            >
              Sign Up
            </button>
            <button
              onClick={openDemo}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
            >
              Try Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero — light / clinical */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 via-white to-[#FAFBFF]">
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                <span className="text-xs font-semibold text-teal-700">Vision benefit reminder software for independent optometry</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-900">
                Your patients are sitting on{' '}
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">unspent vision benefits.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-slate-600 leading-relaxed">
                Independent practices recover $15–50K in optical revenue every year by reaching patients before their benefits expire. Prizm finds the money and runs the campaigns automatically — personalized with each patient's exact dollar amounts.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={openDemo}
                  className="flex items-center gap-2 rounded-xl bg-teal-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                >
                  <Zap className="h-4 w-4" /> See your practice's numbers
                </button>
                <button
                  onClick={openContact}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Talk to us <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> HIPAA compliant</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Up and running today</span>
              </div>
            </div>

            {/* Right — full dashboard preview */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="ml-3 text-xs text-slate-400">app.prizmvision.com/dashboard</span>
                </div>
                {/* App shell: sidebar + main */}
                <div className="flex">
                  {/* Sidebar */}
                  <div className="hidden sm:flex w-36 flex-shrink-0 flex-col gap-1 border-r border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-1.5 px-2 pb-3">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-teal-500 to-cyan-600">
                        <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-white"><path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" /></svg>
                      </div>
                      <span className="text-xs font-bold text-slate-900">Prizm</span>
                    </div>
                    {[
                      { label: 'Dashboard', active: true },
                      { label: 'Eligibility', active: false },
                      { label: 'Patients', active: false },
                      { label: 'Campaigns', active: false },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${item.active ? 'bg-teal-50 text-teal-700' : 'text-slate-500'}`}>
                        {item.label}
                      </div>
                    ))}
                  </div>
                  {/* Main panel */}
                  <div className="flex-1 p-4">
                    <p className="text-xs font-semibold text-slate-500">Good afternoon 👋</p>
                    {/* Aha banner */}
                    <div className="mt-2 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-700 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-100">Recoverable optical revenue</p>
                      <p className="mt-0.5 text-3xl font-extrabold tracking-tight text-white">$127,050</p>
                      <p className="mt-1 text-[11px] text-teal-50">467 patients have unused benefits — frames, contacts &amp; exams waiting</p>
                    </div>
                    {/* Stat row */}
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-lg border border-slate-100 bg-white p-2.5">
                        <p className="text-[10px] text-slate-500">Frame benefits</p>
                        <p className="text-sm font-bold text-teal-700">$82,700</p>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-white p-2.5">
                        <p className="text-[10px] text-slate-500">Contact lens</p>
                        <p className="text-sm font-bold text-cyan-700">$44,350</p>
                      </div>
                      <div className="rounded-lg border border-slate-100 bg-white p-2.5">
                        <p className="text-[10px] text-slate-500">Expiring soon</p>
                        <p className="text-sm font-bold text-amber-700">312 pts</p>
                      </div>
                    </div>
                    {/* Patient rows */}
                    <div className="mt-3 space-y-1.5">
                      {[
                        { nm: 'Sarah Mitchell', ins: 'VSP', amt: '$150 frames' },
                        { nm: 'James Okafor', ins: 'EyeMed', amt: '$200 contacts' },
                        { nm: 'Maria Chen', ins: 'VSP', amt: '$150 frames' },
                      ].map((r) => (
                        <div key={r.nm} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{r.nm}</p>
                            <p className="text-[10px] text-slate-400">{r.ins}</p>
                          </div>
                          <span className="text-xs font-bold text-teal-700">{r.amt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry stats */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200">
            <Stat value="15+" label="campaign types — benefit reminders, trunk shows, back to school, and more" />
            <Stat value="$2.4B" label="in vision benefits expire unused every year — your patients' money" />
            <Stat value="90-day" label="benefit cache — verify once, run multiple campaigns for free" />
            <Stat value="$449/mo" label="flat — no per-message fees, no per-verification charges" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">How Prizm works</p>
          <h2 className="text-4xl font-black tracking-[-0.02em]">Up and running this afternoon</h2>
          <p className="mt-3 text-slate-600 max-w-lg mx-auto">No EHR integration. No IT department. Works with every practice management system via CSV export.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: '01',
              icon: <Users className="h-6 w-6 text-teal-600" />,
              title: 'Upload your patient list',
              body: 'Export a CSV from RevolutionEHR, Eyefinity, Crystal PM, or any EHR. Prizm maps your columns and cleans the data automatically.',
              accent: 'teal',
            },
            {
              n: '02',
              icon: <ShieldCheck className="h-6 w-6 text-violet-600" />,
              title: 'Prizm verifies every benefit in real time',
              body: 'We check frame allowance, contact lens benefits, exam coverage, and expiration date for every patient — direct from the insurance carrier.',
              accent: 'violet',
            },
            {
              n: '03',
              icon: <MessageSquare className="h-6 w-6 text-cyan-600" />,
              title: 'Personalized campaigns go out automatically',
              body: "Every patient gets a message with their exact dollar amounts. You approve once. Prizm sends year-round — staggered so your front desk isn't flooded.",
              accent: 'cyan',
            },
          ].map((step) => (
            <div key={step.n} className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
              <span className="absolute top-5 right-6 text-5xl font-black text-slate-100">{step.n}</span>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-200">
                {step.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Eligibility */}
      <section id="verification" className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">Real-time eligibility</p>
              <h2 className="text-4xl font-black leading-tight tracking-[-0.02em]">
                Know exactly what every patient has left — before they walk in
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Prizm checks directly with VSP, EyeMed, Davis Vision, Spectera, and all major carriers. No phone calls. No portal logins. Every patient's benefits are verified and attached to their record automatically.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: <DollarSign className="h-4 w-4 text-emerald-600" />, text: 'Frame allowance, contact lens benefit, and exam copay — exact amounts' },
                  { icon: <Bell className="h-4 w-4 text-amber-600" />, text: 'Expiration dates tracked so campaigns fire before benefits lapse' },
                  { icon: <FileCheck className="h-4 w-4 text-teal-600" />, text: 'Deductible status and prior auth requirements flagged automatically' },
                  { icon: <TrendingUp className="h-4 w-4 text-violet-600" />, text: 'Full eligibility history per patient for every visit' },
                ].map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      {f.icon}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-lg shadow-slate-200/60">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Benefits Verified Today</p>
                <div className="space-y-2">
                  {[
                    { patient: 'Sarah Mitchell', carrier: 'VSP',          frame: '$150', cl: '$130', status: 'Active',   color: 'text-emerald-600' },
                    { patient: 'James Okafor',   carrier: 'EyeMed',       frame: '$200', cl: '$0',   status: 'Active',   color: 'text-emerald-600' },
                    { patient: 'Linda Chen',     carrier: 'Davis Vision', frame: '$150', cl: '$100', status: 'Active',   color: 'text-emerald-600' },
                    { patient: 'Marcus Webb',    carrier: 'Spectera',     frame: '$0',   cl: '$0',   status: 'Inactive', color: 'text-slate-400'   },
                  ].map((p) => (
                    <div key={p.patient} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.patient}</p>
                        <p className="text-xs text-slate-500">{p.carrier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">{p.frame !== '$0' ? `${p.frame} frames` : p.cl !== '$0' ? `${p.cl} CL` : '—'}</p>
                        <p className={`text-xs font-medium ${p.color}`}>{p.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-teal-50 border border-teal-100 px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-teal-700">38 verified today</span>
                  <span className="text-sm font-bold text-teal-700">$4,820 in benefits found</span>
                </div>
              </div>

              <VerificationCard />
            </div>
          </div>
        </div>
      </section>

      {/* Aha moment — bold teal accent block */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-700 p-6 sm:p-10 shadow-2xl shadow-teal-600/20 text-center">
          <p className="text-sm font-semibold text-teal-100 mb-2">What you see 60 seconds after uploading your patient list</p>
          <p className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mt-2">$127,050</p>
          <p className="mt-3 text-teal-50 text-xl">in recoverable optical revenue sitting in your patient list right now</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
            {[
              { label: 'Frame allowances', value: '$82,350', sub: '548 patients with unused frames' },
              { label: 'Contact lens benefits', value: '$44,700', sub: '299 patients overdue for CL reorder' },
              { label: 'At 20% response rate', value: '~$25,410', sub: 'conservative estimated recovery' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/15 border border-white/20 px-4 py-4 text-center backdrop-blur-sm">
                <p className="text-xs text-teal-50 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-teal-100/80 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
          <button
            onClick={openDemo}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-teal-700 hover:bg-teal-50 transition-colors shadow-xl"
          >
            <Zap className="h-4 w-4" /> See your practice's numbers
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">Everything included</p>
            <h2 className="text-4xl font-black tracking-[-0.02em]">Not a blast. A revenue engine.</h2>
            <p className="mt-3 text-slate-600 max-w-lg mx-auto">Generic benefit reminders get ignored. Personalized messages with exact dollar amounts get appointments.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
                bg: 'bg-emerald-50 border-emerald-100',
                title: 'Exact dollar amounts',
                body: '"You have $150 in frame benefits expiring Dec 31" — not a generic reminder. Prizm pulls the real number for every patient.',
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-teal-600" />,
                bg: 'bg-teal-50 border-teal-100',
                title: 'Real-time insurance verification',
                body: 'Direct connections to VSP, EyeMed, Davis Vision, Spectera, and all major vision carriers. Checks happen automatically.',
              },
              {
                icon: <FileCheck className="h-5 w-5 text-violet-600" />,
                bg: 'bg-violet-50 border-violet-100',
                title: 'Automatic campaign scheduling',
                body: 'Set it once and Prizm sends the right message at the right time — 30-day expiry alerts, mid-year reminders, CL reorder windows. No manual work.',
              },
              {
                icon: <Zap className="h-5 w-5 text-cyan-600" />,
                bg: 'bg-cyan-50 border-cyan-100',
                title: 'Year-round, always-on',
                body: "Prizm sends campaigns automatically all year — not just a Q4 blast. Staggered delivery keeps your front desk from being overwhelmed.",
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-amber-600" />,
                bg: 'bg-amber-50 border-amber-100',
                title: 'Revenue attribution',
                body: 'Track exactly how much optical revenue each campaign recovered — reply rate, appointments booked, dollars attributed.',
              },
              {
                icon: <Lock className="h-5 w-5 text-rose-600" />,
                bg: 'bg-rose-50 border-rose-100',
                title: 'HIPAA compliant by design',
                body: 'BAA included. Row-level security on all patient data. MFA required. Audit logs on every read and write. Not an afterthought.',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border ${f.bg}`}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">Pricing</p>
          <h2 className="text-4xl font-black tracking-[-0.02em]">Simple. Everything included.</h2>
          <p className="mt-3 text-slate-600">No hidden fees. No contracts. Cancel anytime.</p>
        </div>
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border border-teal-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            <div className="flex items-end gap-2 mb-1">
              <span className="text-6xl font-black text-slate-900">$449</span>
              <span className="text-slate-500 mb-2">/month</span>
            </div>
            <p className="text-sm text-slate-600 mb-1">Includes 1,500 verifications · $0.15/check after that.</p>
            <p className="text-xs text-slate-500 mb-6">Most practices never exceed the included amount.</p>
            <div className="space-y-3 mb-8">
              {[
                'Real-time insurance eligibility verification',
                'All campaign templates',
                'AI-personalized messages per patient',
                'SMS + email delivery',
                'Revenue tracking and attribution',
                'HIPAA BAA included',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 flex-shrink-0" />
                  <span className="text-sm text-slate-700">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={openDemo}
              className="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
            >
              Try the Live Demo
            </button>
            <a
              href="/founding"
              className="mt-4 block rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center hover:bg-amber-100 transition-colors"
            >
              <p className="text-xs text-amber-700 font-medium">Founding customer offer</p>
              <p className="text-sm text-amber-800 mt-0.5">$199/month locked for life — first 10 customers only →</p>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-[-0.02em]">
            Your patients have money waiting.<br />
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Are you going to tell them?</span>
          </h2>
          <p className="mt-5 text-lg text-slate-600 max-w-xl mx-auto">
            Upload your patient list today. In 60 seconds, Prizm shows you exactly how much recoverable revenue is sitting in your practice — before you pay anything.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={openDemo}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-4 text-base font-bold text-white hover:bg-teal-700 transition-colors shadow-xl shadow-teal-600/20"
            >
              <Zap className="h-5 w-5" /> See your numbers free
            </button>
            <button
              onClick={openContact}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-4 text-base font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Talk to a human <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Looking for the founding customer rate?{' '}
            <a href="/founding" className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
              Apply for $199/month →
            </a>
          </p>
        </div>
      </section>

      {/* EHR Compatibility */}
      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-10">Works with every major practice management system</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { name: 'RevolutionEHR', share: '~35% of practices' },
              { name: 'Eyefinity', share: '~25% of practices' },
              { name: 'Crystal PM', share: '~15% of practices' },
              { name: 'Compulink', share: '~10% of practices' },
              { name: 'My Vision Express', share: '~8% of practices' },
            ].map((ehr) => (
              <div key={ehr.name} className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 text-center shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <FileCheck className="h-4 w-4 text-teal-600" />
                </div>
                <span className="text-sm font-semibold text-slate-900">{ehr.name}</span>
                <span className="text-xs text-slate-500">{ehr.share}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-6">No EHR integration required — export a CSV, upload, done. Setup takes under an hour.</p>
        </div>
      </section>

      {/* Trust / Built-on strip */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">Secured &amp; powered by</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {[
              { name: 'Twilio', desc: 'HIPAA-eligible SMS' },
              { name: 'Supabase', desc: 'HIPAA-tier database' },
              { name: 'Stripe', desc: 'PCI-compliant billing' },
              { name: 'Vercel', desc: 'SOC 2 hosting' },
              { name: 'Stedi', desc: 'Eligibility API' },
              { name: 'Anthropic', desc: 'AI messaging' },
            ].map((vendor) => (
              <div key={vendor.name} className="flex flex-col items-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
                <span className="text-sm font-bold text-slate-700 tracking-tight">{vendor.name}</span>
                <span className="text-xs text-slate-400">{vendor.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-900 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">Prizm</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">AI-powered campaign automation for independent optometry practices.</p>
              <p className="text-xs text-slate-500">Highland, UT</p>
              <a href="mailto:stockton@prizmvision.com" className="text-xs text-slate-500 hover:text-teal-400 transition-colors">stockton@prizmvision.com</a>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'How it works', href: '#how-it-works' },
                  { label: 'Eligibility', href: '#eligibility' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Blog', href: '/blog' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Company</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Founding Offer', href: '/founding' },
                  { label: 'Contact', href: 'mailto:stockton@prizmvision.com' },
                  { label: 'Demo', href: '#' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Legal &amp; Security</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'HIPAA Compliance', href: '/privacy' },
                  { label: 'BAA Available', href: 'mailto:stockton@prizmvision.com' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">© 2026 Prizm Vision, LLC · Highland, UT · All rights reserved.</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1">
                <ShieldCheck className="h-3 w-3 text-teal-400" />
                <span className="text-xs font-medium text-teal-400">BAA Available</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
