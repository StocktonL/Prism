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
        <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-8 shadow-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 border border-teal-500/30">
            <CheckCircle2 className="h-6 w-6 text-teal-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-2">You're on the list</h2>
          <p className="text-sm text-slate-400 mb-6">Our team will reach out personally within 24 hours to schedule your demo and walk through your practice's numbers.</p>
          <button onClick={onClose} className="w-full rounded-xl bg-teal-500 py-3 text-sm font-bold text-white hover:bg-teal-400 transition-colors">
            Got it
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30 mb-4">
            {isContact
              ? <MessageSquare className="h-5 w-5 text-teal-400" />
              : <Zap className="h-5 w-5 text-teal-400" />}
          </div>
          <h2 className="text-xl font-black text-white">
            {isContact ? 'Let\'s talk' : 'Get instant access to the demo'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-400">
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
              <label className="text-xs font-medium text-slate-400 mb-1 block">Your name</label>
              <input
                required
                name="name"
                placeholder="Sarah Johnson"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1 block">Practice name</label>
              <input
                required
                name="practice"
                placeholder="Valley Eye Care"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Work email</label>
            <input
              required
              type="email"
              name="email"
              placeholder="sarah@valleyeyecare.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors"
            />
            <ValidationError field="email" errors={state.errors} className="text-xs text-red-400 mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Phone number</label>
            <input
              required
              type="tel"
              name="phone"
              placeholder="(801) 555-1234"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">
              {isContact ? 'What\'s on your mind?' : 'Anything you\'d like us to know? (optional)'}
            </label>
            <textarea
              required={isContact}
              name="message"
              placeholder={isContact
                ? 'How many patients do you have? Which EHR do you use? Any questions about Prizm?'
                : 'e.g. "We have about 2,000 patients on VSP and EyeMed..."'}
              rows={3}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/50 transition-colors resize-none"
            />
            <ValidationError field="message" errors={state.errors} className="text-xs text-red-400 mt-1" />
          </div>
          <button
            type="submit"
            disabled={state.submitting}
            className="w-full rounded-xl bg-teal-500 py-3 text-sm font-bold text-white hover:bg-teal-400 transition-colors disabled:opacity-60 mt-2 shadow-lg shadow-teal-900/40"
          >
            {state.submitting
              ? (isContact ? 'Sending...' : 'Opening demo...')
              : (isContact ? 'Send — I\'ll hear from you soon →' : 'Show me the demo →')}
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-slate-600">No credit card · HIPAA compliant · We'll follow up within 24 hours</p>
      </div>
    </div>
  )
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 sm:px-8 py-5 sm:py-6 bg-slate-950">
      <span className="text-2xl sm:text-4xl font-black text-white">{value}</span>
      <span className="text-xs sm:text-sm text-slate-400 text-center leading-tight">{label}</span>
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
    <div className="rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Eligibility Check</span>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          VSP · Active
        </span>
      </div>
      <p className="text-base font-bold text-white mb-4">Sarah Mitchell · DOB 03/22/1985</p>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: 'Frame Allowance', value: '$150', status: 'unused' },
          { label: 'Contact Lens', value: '$130', status: 'unused' },
          { label: 'Exam Copay', value: '$10', status: 'covered' },
          { label: 'Plan Expires', value: 'Dec 31', status: 'warning' },
        ].map((b) => (
          <div key={b.label} className="rounded-xl bg-slate-800 px-3 py-2.5">
            <p className="text-xs text-slate-500 mb-0.5">{b.label}</p>
            <p className="text-sm font-bold text-white">{b.value}</p>
            <span className={`text-xs font-medium ${
              b.status === 'unused' ? 'text-emerald-400' :
              b.status === 'warning' ? 'text-amber-400' : 'text-teal-400'
            }`}>
              {b.status === 'unused' ? '● Unused' : b.status === 'warning' ? '● Expiring' : '● Covered'}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-teal-500/10 border border-teal-500/20 px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-teal-300">AI recommendation</span>
        <span className="text-xs font-semibold text-teal-400">Send frame + CL campaign →</span>
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
    <div className="min-h-screen bg-slate-950 text-white">

      {showModal && <DemoModal onClose={() => setShowModal(false)} onSubmit={enterDemo} variant="demo" />}
      {showContactModal && <DemoModal onClose={() => setShowContactModal(false)} onSubmit={() => setShowContactModal(false)} variant="contact" />}

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-900/50">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">Prizm</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#verification" className="hover:text-white transition-colors">Eligibility</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
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
            <button
              onClick={openDemo}
              className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-400 transition-colors shadow-lg shadow-teal-900/40"
            >
              Try Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-16">
          <div className="text-center mb-14">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              <span className="text-xs font-semibold text-teal-300">AI-powered campaign automation for optometry</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-3xl sm:text-5xl md:text-6xl font-black leading-[1.08] tracking-tight">
              $2.4 billion in vision benefits
              <br />
              <span className="text-teal-400">expire unused every year.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
              Prizm tells every patient exactly how much they have left — their frame allowance, contact lens benefit, exam coverage — and sends personalized campaigns that bring them back before it expires.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={openDemo}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-7 py-3.5 text-sm font-bold text-white hover:bg-teal-400 transition-colors shadow-xl shadow-teal-900/40"
              >
                <Zap className="h-4 w-4" /> See your practice's numbers
              </button>
              <button
                onClick={openContact}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                Talk to us <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-600">No credit card required · HIPAA compliant · Up and running today</p>
          </div>

          {/* Message bubbles */}
          <div className="mx-auto max-w-5xl">
            <div className="grid sm:grid-cols-3 gap-4">
              <MessageBubble
                initials="SM"
                name="Sarah Mitchell"
                tag="Benefits"
                tagColor="text-emerald-600 bg-emerald-50"
                message="Hi Sarah, did you know your VSP plan covers $150 toward new glasses? It's been a while since your last pair — we'd love to help you use it. Reply YES to book. — Valley Eye Care"
              />
              <MessageBubble
                initials="MW"
                name="Marcus Webb"
                tag="Expiring"
                tagColor="text-rose-600 bg-rose-50"
                message="Hi Marcus, wanted to give you a heads up — our records show you have $150 in frame benefits and $200 in contact lens benefits expiring Dec 31. Most patients don't realize these don't carry over to next year. Reply YES to book. — Valley Eye Care"
                time="8m ago"
              />
              <MessageBubble
                initials="KP"
                name="Kevin Park"
                tag="Brand Match"
                tagColor="text-amber-600 bg-amber-50"
                message="Hi Kevin, did you know your VSP plan still has $150 in frame benefits you haven't used? We're hosting a Maui Jim trunk show Nov 14–16 and thought you'd want to know — those benefits apply to any pair in the collection. Want us to hold a spot? — Valley Eye Care"
                time="11m ago"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Industry stats */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
            <Stat value="25,000" label="independent optometry practices in the US" />
            <Stat value="$2.4B" label="in vision benefits that expire unused every year" />
            <Stat value="$150" label="average unused frame allowance per patient" />
            <Stat value="20%" label="average response rate on benefit-specific messages" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">How Prizm works</p>
          <h2 className="text-4xl font-black">Up and running this afternoon</h2>
          <p className="mt-3 text-slate-400 max-w-lg mx-auto">No EHR integration. No IT department. Works with every practice management system via CSV export.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              n: '01',
              icon: <Users className="h-6 w-6 text-teal-400" />,
              title: 'Upload your patient list',
              body: 'Export a CSV from RevolutionEHR, Eyefinity, Crystal PM, or any EHR. Prizm maps your columns and cleans the data automatically.',
              accent: 'teal',
            },
            {
              n: '02',
              icon: <ShieldCheck className="h-6 w-6 text-violet-400" />,
              title: 'Prizm verifies every benefit in real time',
              body: 'We check frame allowance, contact lens benefits, exam coverage, and expiration date for every patient — direct from the insurance carrier.',
              accent: 'violet',
            },
            {
              n: '03',
              icon: <MessageSquare className="h-6 w-6 text-cyan-400" />,
              title: 'Personalized campaigns go out automatically',
              body: "Every patient gets a message with their exact dollar amounts. You approve once. Prizm sends year-round — staggered so your front desk isn't flooded.",
              accent: 'cyan',
            },
          ].map((step) => (
            <div key={step.n} className="relative rounded-2xl border border-white/5 bg-white/[0.03] p-7 hover:bg-white/[0.05] transition-colors">
              <span className="absolute top-5 right-6 text-5xl font-black text-white/5">{step.n}</span>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                {step.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eligibility + Claims */}
      <section id="verification" className="border-t border-white/5 bg-white/[0.02] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">Real-time eligibility</p>
              <h2 className="text-4xl font-black leading-tight">
                Know exactly what every patient has left — before they walk in
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Prizm checks directly with VSP, EyeMed, Davis Vision, Spectera, and all major carriers. No phone calls. No portal logins. Every patient's benefits are verified and attached to their record automatically.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: <DollarSign className="h-4 w-4 text-emerald-400" />, text: 'Frame allowance, contact lens benefit, and exam copay — exact amounts' },
                  { icon: <Bell className="h-4 w-4 text-amber-400" />, text: 'Expiration dates tracked so campaigns fire before benefits lapse' },
                  { icon: <FileCheck className="h-4 w-4 text-teal-400" />, text: 'Deductible status and prior auth requirements flagged automatically' },
                  { icon: <TrendingUp className="h-4 w-4 text-violet-400" />, text: 'Full eligibility history per patient for every visit' },
                ].map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                      {f.icon}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-900 border border-slate-700/60 p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Claims Snapshot · Today</p>
                <div className="space-y-2">
                  {[
                    { patient: 'Sarah Mitchell', carrier: 'VSP', amount: '$287', status: 'Submitted', color: 'text-blue-400' },
                    { patient: 'James Okafor', carrier: 'EyeMed', amount: '$412', status: 'Approved', color: 'text-emerald-400' },
                    { patient: 'Linda Chen', carrier: 'Davis Vision', amount: '$195', status: 'Approved', color: 'text-emerald-400' },
                    { patient: 'Marcus Webb', carrier: 'Spectera', amount: '$338', status: 'Pending', color: 'text-amber-400' },
                  ].map((c) => (
                    <div key={c.patient} className="flex items-center justify-between rounded-xl bg-slate-800 px-3 py-2.5">
                      <div>
                        <p className="text-sm font-medium text-white">{c.patient}</p>
                        <p className="text-xs text-slate-500">{c.carrier}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{c.amount}</p>
                        <p className={`text-xs font-medium ${c.color}`}>{c.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-emerald-300">4 claims today</span>
                  <span className="text-sm font-bold text-emerald-400">$1,232 billed</span>
                </div>
              </div>

              <VerificationCard />
            </div>
          </div>
        </div>
      </section>

      {/* Aha moment */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-gradient-to-br from-teal-900/60 via-slate-900 to-cyan-900/40 border border-teal-500/20 p-6 sm:p-10 shadow-2xl text-center">
          <p className="text-sm font-semibold text-teal-300 mb-2">What you see 60 seconds after uploading your patient list</p>
          <p className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight mt-2">$127,050</p>
          <p className="mt-3 text-teal-200 text-xl">in recoverable optical revenue sitting in your patient list right now</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto">
            {[
              { label: 'Frame allowances', value: '$82,350', sub: '548 patients with unused frames' },
              { label: 'Contact lens benefits', value: '$44,700', sub: '299 patients overdue for CL reorder' },
              { label: 'At 20% response rate', value: '~$25,410', sub: 'conservative estimated recovery' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 border border-white/10 px-4 py-4 text-center backdrop-blur-sm">
                <p className="text-xs text-teal-200 mb-1">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-teal-300/70 mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
          <button
            onClick={openDemo}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-7 py-3.5 text-sm font-bold text-white hover:bg-teal-400 transition-colors shadow-xl shadow-teal-900/60"
          >
            <Zap className="h-4 w-4" /> See your practice's numbers
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 bg-white/[0.02] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">Everything included</p>
            <h2 className="text-4xl font-black">Not a blast. A revenue engine.</h2>
            <p className="mt-3 text-slate-400 max-w-lg mx-auto">Generic benefit reminders get ignored. Personalized messages with exact dollar amounts get appointments.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <DollarSign className="h-5 w-5 text-emerald-400" />,
                bg: 'bg-emerald-500/10 border-emerald-500/20',
                title: 'Exact dollar amounts',
                body: '"You have $150 in frame benefits expiring Dec 31" — not a generic reminder. Prizm pulls the real number for every patient.',
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-teal-400" />,
                bg: 'bg-teal-500/10 border-teal-500/20',
                title: 'Real-time insurance verification',
                body: 'Direct connections to VSP, EyeMed, Davis Vision, Spectera, and all major vision carriers. Checks happen automatically.',
              },
              {
                icon: <FileCheck className="h-5 w-5 text-violet-400" />,
                bg: 'bg-violet-500/10 border-violet-500/20',
                title: 'Claims tracking',
                body: "See every claim submitted, approved, or pending. Know exactly what's billed and what's been paid — at a glance.",
              },
              {
                icon: <Zap className="h-5 w-5 text-cyan-400" />,
                bg: 'bg-cyan-500/10 border-cyan-500/20',
                title: 'Year-round, always-on',
                body: "Prizm sends campaigns automatically all year — not just a Q4 blast. Staggered delivery keeps your front desk from being overwhelmed.",
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-amber-400" />,
                bg: 'bg-amber-500/10 border-amber-500/20',
                title: 'Revenue attribution',
                body: 'Track exactly how much optical revenue each campaign recovered — reply rate, appointments booked, dollars attributed.',
              },
              {
                icon: <Lock className="h-5 w-5 text-rose-400" />,
                bg: 'bg-rose-500/10 border-rose-500/20',
                title: 'HIPAA compliant by design',
                body: 'BAA included. Row-level security on all patient data. MFA required. Audit logs on every read and write. Not an afterthought.',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition-colors">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border ${f.bg}`}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400 mb-3">Pricing</p>
          <h2 className="text-4xl font-black">Simple. Everything included.</h2>
          <p className="mt-3 text-slate-400">No hidden fees. No contracts. Cancel anytime.</p>
        </div>
        <div className="mx-auto max-w-lg">
          <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-b from-teal-950/40 to-slate-900 p-8 shadow-2xl shadow-teal-900/20">
            <div className="flex items-end gap-2 mb-1">
              <span className="text-6xl font-black text-white">$449</span>
              <span className="text-slate-400 mb-2">/month</span>
            </div>
            <p className="text-sm text-slate-400 mb-1">Includes 1,500 verifications · $0.25/check after that.</p>
            <p className="text-xs text-slate-500 mb-6">Most practices never exceed the included amount.</p>
            <div className="space-y-3 mb-8">
              {[
                'Real-time insurance eligibility verification',
                'All campaign templates',
                'AI-personalized messages per patient',
                'SMS + email delivery',
                'Revenue tracking and attribution',
                'Claims tracking dashboard',
                'HIPAA BAA included',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-teal-400 flex-shrink-0" />
                  <span className="text-sm text-slate-300">{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={openDemo}
              className="w-full rounded-xl bg-teal-500 py-3.5 text-sm font-bold text-white hover:bg-teal-400 transition-colors shadow-lg shadow-teal-900/40"
            >
              Try the Live Demo
            </button>
            <a
              href="/founding"
              className="mt-4 block rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-center hover:bg-amber-500/20 transition-colors"
            >
              <p className="text-xs text-amber-300 font-medium">Founding customer offer</p>
              <p className="text-sm text-amber-200 mt-0.5">$199/month locked for life — first 10 customers only →</p>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-white/5 bg-white/[0.02] py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
            Your patients have money waiting.<br />
            <span className="text-teal-400">Are you going to tell them?</span>
          </h2>
          <p className="mt-5 text-lg text-slate-400 max-w-xl mx-auto">
            Upload your patient list today. In 60 seconds, Prizm shows you exactly how much recoverable revenue is sitting in your practice — before you pay anything.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={openDemo}
              className="flex items-center gap-2 rounded-xl bg-teal-500 px-8 py-4 text-base font-bold text-white hover:bg-teal-400 transition-colors shadow-xl shadow-teal-900/40"
            >
              <Zap className="h-5 w-5" /> See your numbers free
            </button>
            <button
              onClick={openContact}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              Talk to a human <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Looking for the founding customer rate?{' '}
            <a href="/founding" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              Apply for $199/month →
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-teal-400 to-cyan-600">
              <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">Prizm</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <a href="mailto:hello@prizmvision.com" className="hover:text-slate-400 transition-colors">hello@prizmvision.com</a>
            <span>·</span>
            <span>Built for independent optometry</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">HIPAA Compliant</span>
          </div>
        </div>
        <p className="text-center text-xs text-slate-700 mt-4">© 2026 Prizm Vision. All rights reserved.</p>
      </footer>

    </div>
  )
}
