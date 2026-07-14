import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
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
  X,
  MessageSquare,
} from 'lucide-react'

// ─── Lead capture modal ───────────────────────────────────────────────────────
import { useForm, ValidationError } from '@formspree/react'

// Shared styling tokens — one disciplined system, no per-element invention.
const PRIMARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-7 py-3.5 text-sm font-semibold text-white hover:bg-teal-800 transition-colors shadow-lg shadow-teal-900/15'
const SECONDARY_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors'
const CARD = 'rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_rgba(15,118,110,0.05)]'

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
// Uses IntersectionObserver to trigger a visibility flag once the element
// scrolls into view. Fully respects prefers-reduced-motion.
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  // Check reduced motion preference once on mount
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  useEffect(() => {
    // If user prefers reduced motion, skip the animation entirely — start visible.
    if (prefersReduced) {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect() // animate once, never hide again
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [prefersReduced])

  return { ref, visible }
}

// ─── RevealBlock wrapper ──────────────────────────────────────────────────────
// Wraps any block that should fade+slide up into view on scroll.
// Pass a tailwind delay class like "delay-[100ms]" via the `delay` prop.
interface RevealBlockProps {
  children: React.ReactNode
  delay?: string
  className?: string
}

function RevealBlock({ children, delay = '', className = '' }: RevealBlockProps) {
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref}
      className={[
        'transition-all duration-500 ease-out',
        delay,
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}


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
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 border border-teal-100">
            <CheckCircle2 className="h-6 w-6 text-teal-700" />
          </div>
          <h2 className="font-display text-2xl font-semibold text-slate-900 mb-2">You're on the list</h2>
          <p className="text-sm text-slate-600 mb-6">Our team will reach out personally within 24 hours to schedule your demo and walk through your practice's numbers.</p>
          <button onClick={onClose} className={`${PRIMARY_BTN} w-full`}>
            Got it
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 border border-teal-100 mb-4">
            {isContact
              ? <MessageSquare className="h-5 w-5 text-teal-700" />
              : <ArrowRight className="h-5 w-5 text-teal-700" />}
          </div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
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

          <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Your name</label>
              <input
                required
                name="name"
                placeholder="Sarah Johnson"
                className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-colors"
              />
            </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Work email</label>
            <input
              required
              type="email"
              name="email"
              placeholder="sarah@valleyeyecare.com"
              className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-colors"
            />
            <ValidationError field="email" errors={state.errors} className="text-xs text-red-500 mt-1" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Phone <span className="text-slate-400">(optional)</span></label>
            <input
              type="tel"
              name="phone"
              placeholder="(801) 555-1234"
              className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-colors"
            />
          </div>
          {isContact && (
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">What's on your mind?</label>
              <textarea
                required
                name="message"
                placeholder="How many patients do you have? Which EHR do you use? Any questions about Prizm?"
                rows={3}
                className="w-full rounded-xl bg-white border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-colors resize-none"
              />
              <ValidationError field="message" errors={state.errors} className="text-xs text-red-500 mt-1" />
            </div>
          )}
          <button
            type="submit"
            disabled={state.submitting}
            className={`${PRIMARY_BTN} w-full mt-2 disabled:opacity-60`}
          >
            {state.submitting
              ? (isContact ? 'Sending...' : 'Booking...')
              : (isContact ? 'Send — I\'ll hear from you soon →' : 'Book my free walkthrough →')}
          </button>
        </form>
        <p className="mt-3 text-center text-xs text-slate-500">Free · No commitment · Stockton will call you within 24 hours</p>
      </div>
    </div>
  )
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 sm:px-8 py-5 sm:py-6 bg-white">
      <span className="font-display text-2xl sm:text-4xl font-semibold text-slate-900 tabular">{value}</span>
      <span className="text-xs sm:text-sm text-slate-500 text-center leading-tight">{label}</span>
    </div>
  )
}

// ─── Verification card mock ───────────────────────────────────────────────────
function VerificationCard() {
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Eligibility Check</span>
        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
            <p className="text-sm font-bold text-slate-900 tabular">{b.value}</p>
            <span className={`text-xs font-medium ${
              b.status === 'unused' ? 'text-emerald-600' :
              b.status === 'warning' ? 'text-amber-600' : 'text-teal-700'
            }`}>
              {b.status === 'unused' ? '● Unused' : b.status === 'warning' ? '● Expiring' : '● Covered'}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-teal-50 border border-teal-100 px-3 py-2 flex items-center justify-between">
        <span className="text-xs text-teal-800">AI recommendation</span>
        <span className="text-xs font-semibold text-teal-800">Send frame + CL campaign →</span>
      </div>
    </div>
  )
}

// ─── Example SMS bubble (shows the actual personalized message a patient gets) ─
interface BubbleProps {
  initials: string
  name: string
  tag: string
  message: string
  time?: string
}

// Bold any $-amount inside the message so the dollar figure — the whole point — pops.
function highlightAmounts(text: string) {
  return text.split(/(\$\d[\d,]*)/g).map((part, i) =>
    /^\$\d/.test(part)
      ? <span key={i} className="font-semibold text-teal-800">{part}</span>
      : <span key={i}>{part}</span>
  )
}

function MessageBubble({ initials, name, tag, message, time = 'Just now' }: BubbleProps) {
  return (
    <div className={`${CARD} p-4`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-teal-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{name}</p>
          <p className="text-xs text-slate-400">SMS · {time}</p>
        </div>
        <span className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 bg-teal-50 text-teal-800 border border-teal-100">{tag}</span>
      </div>
      {/* Phone-style message bubble */}
      <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5">
        <p className="text-sm text-slate-700 leading-relaxed">{highlightAmounts(message)}</p>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">Auto-personalized by Prizm · Reply STOP to opt out</p>
    </div>
  )
}

// ─── Section header (left-aligned — respects left-side bias / F-pattern) ───────
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl mb-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-3">{eyebrow}</p>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {sub && <p className="mt-3 text-slate-600 leading-relaxed">{sub}</p>}
    </div>
  )
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)

  // Scroll progress bar (0–100) and nav condensing state
  const [scrollPct, setScrollPct] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  // One shared scroll listener drives both the progress bar and the nav state.
  const handleScroll = useCallback(() => {
    const el = document.documentElement
    const scrollTop = window.scrollY
    const maxScroll = el.scrollHeight - window.innerHeight
    const pct = maxScroll > 0 ? Math.min(100, (scrollTop / maxScroll) * 100) : 0
    setScrollPct(pct)
    setScrolled(scrollTop > 80)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  function openDemo() { setShowModal(true) }
  function openContact() { setShowContactModal(true) }

  function enterDemo() {
    setShowModal(false)
    localStorage.setItem('prizm_demo', 'true')
    navigate('/app/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ── Scroll progress bar ───────────────────────────────────────────────
          Fixed to the very top of the viewport, above the nav (z-60).
          Width is dynamic so we use inline style, not a Tailwind class.     */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 z-60 h-[2px] bg-gradient-to-r from-teal-700 to-teal-500"
        style={{ width: `${scrollPct}%`, transition: 'width 0.1s linear' }}
      />

      {showModal && <DemoModal onClose={() => setShowModal(false)} onSubmit={enterDemo} variant="demo" />}
      {showContactModal && <DemoModal onClose={() => setShowContactModal(false)} onSubmit={() => setShowContactModal(false)} variant="contact" />}

      {/* ── Nav — condenses on scroll ─────────────────────────────────────────
          `scrolled` adds shadow-md and shrinks height from h-16 to h-14.
          transition-all duration-300 makes the height change smooth.        */}
      <nav className={[
        'sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md transition-all duration-300',
        scrolled ? 'shadow-md' : '',
      ].join(' ')}>
        <div className={[
          'mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-300',
          scrolled ? 'h-14' : 'h-16',
        ].join(' ')}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L12 19L2 19Z" /><path d="M12 2L22 19L12 19Z" fill-opacity="0.55" />
              </svg>
            </div>
            <span className="font-display text-xl font-semibold tracking-tight text-slate-900">Prizm</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors">How it works</a>
            <a href="#verification" className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors">Eligibility</a>
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
            <button
              onClick={openDemo}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 transition-colors shadow-sm"
            >
              Try Demo
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero — light / clinical ───────────────────────────────────────────
          Dot-grid texture sits behind everything at 5% opacity.
          A soft radial glow sits behind the right column bubbles.           */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-slate-50">


        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — copy */}
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-slate-900">
                Your patients are sitting on{' '}
                <span className="text-teal-700">unspent vision benefits.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-slate-600 leading-relaxed">
                Independent practices recover $15–50K in optical revenue every year by reaching patients before their benefits expire. Prizm finds the money and runs the campaigns automatically — personalized with each patient's exact dollar amounts.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button onClick={openDemo} className={PRIMARY_BTN}>
                  Book a free walkthrough
                </button>
                <button onClick={openContact} className={SECONDARY_BTN}>
                  Talk to us <ArrowRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Founding rate: $199/month locked for life —{' '}
                <a href="/founding" className="font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                  7 of 10 spots remaining →
                </a>
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> HIPAA compliant</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Up and running today</span>
              </div>
            </div>

            {/* Right — the actual texts a patient receives (the aha moment) */}
            <div className="relative">
              <div className="relative">
                <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-teal-700">What lands on your patient's phone</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <MessageBubble
                    initials="SM"
                    name="Sarah Mitchell"
                    tag="Benefit reminder"
                    message="Hi Sarah — your $150 frame benefit expires Dec 31. Want us to hold a time before it's gone? Reply YES."
                  />
                  <MessageBubble
                    initials="LP"
                    name="Lisa Park"
                    tag="Trunk show"
                    time="2 min ago"
                    message="Hi Lisa — we're hosting a trunk show Friday, and you've got $200 in frame benefits to spend. Save you a spot? Reply YES."
                  />
                  <MessageBubble
                    initials="MC"
                    name="Maria Chen"
                    tag="Back to school"
                    time="1 hr ago"
                    message="Hi Maria — back-to-school season is here and the family has $150 in frame benefits before year-end. Want a time? Reply YES."
                  />
                  <MessageBubble
                    initials="DT"
                    name="David Tran"
                    tag="Mid-year"
                    time="Yesterday"
                    message="Hi David — quick heads up: you still have $200 in unused vision benefits this year. Reply and we'll find you a time."
                  />
                </div>
                <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                  Every message is personalized with the patient's exact benefit — and you approve them all before they send.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recoverable revenue dashboard — what the practice sees ───────────── */}
      <section className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-[1fr_1.25fr] gap-12 items-center">
            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-3">Your dashboard</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
                And here's the revenue waiting in your patient list
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Upload your patients and within 60 seconds Prizm shows you the total optical revenue
                you can recover — broken down by frames, contacts, and which patients are about to
                lose their benefits.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { label: 'Frame allowances', value: '$82,350' },
                  { label: 'Contact lens', value: '$44,700' },
                  { label: 'Est. recovery', value: '~$25,410' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-lg font-bold text-teal-800 tabular">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={openDemo} className={`${PRIMARY_BTN} mt-7`}>
                See your practice's numbers
              </button>
            </div>

            {/* Dashboard mock — fades in on scroll */}
            <RevealBlock>
              <div className="relative">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 overflow-hidden">
                  {/* Clean top bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                    <span className="text-xs font-medium text-slate-400">app.prizmvision.com/dashboard</span>
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live
                    </span>
                  </div>
                  {/* App shell: sidebar + main */}
                  <div className="flex">
                    {/* Sidebar */}
                    <div className="hidden sm:flex w-36 flex-shrink-0 flex-col gap-1 border-r border-slate-100 bg-slate-50 p-3">
                      <div className="flex items-center gap-1.5 px-2 pb-3">
                        <div className="flex h-5 w-5 items-center justify-center rounded bg-teal-700">
                          <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-white"><path d="M12 2L12 19L2 19Z" /><path d="M12 2L22 19L12 19Z" fill-opacity="0.55" /></svg>
                        </div>
                        <span className="font-display text-xs font-semibold text-slate-900">Prizm</span>
                      </div>
                      {[
                        { label: 'Dashboard', active: true },
                        { label: 'Eligibility', active: false },
                        { label: 'Patients', active: false },
                        { label: 'Campaigns', active: false },
                      ].map((item) => (
                        <div key={item.label} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${item.active ? 'bg-teal-50 text-teal-800' : 'text-slate-500'}`}>
                          {item.label}
                        </div>
                      ))}
                    </div>
                    {/* Main panel */}
                    <div className="flex-1 p-4">
                      <p className="text-xs font-semibold text-slate-500">Good afternoon</p>
                      {/* Aha banner — the one place the brand gradient earns its keep */}
                      <div className="mt-2 rounded-xl bg-gradient-to-br from-teal-700 to-teal-600 p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-teal-100">Recoverable optical revenue</p>
                        <p className="mt-1 text-4xl font-bold tracking-tight text-white tabular">$127,050</p>
                        <p className="mt-1.5 text-[11px] text-teal-50">467 patients have unused benefits — frames, contacts &amp; exams waiting</p>
                      </div>
                      {/* Stat row */}
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="rounded-lg border border-slate-100 bg-white p-2.5">
                          <p className="text-[10px] text-slate-500">Frame benefits</p>
                          <p className="text-sm font-bold text-teal-800 tabular">$82,700</p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-white p-2.5">
                          <p className="text-[10px] text-slate-500">Contact lens</p>
                          <p className="text-sm font-bold text-teal-800 tabular">$44,350</p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-white p-2.5">
                          <p className="text-[10px] text-slate-500">Expiring soon</p>
                          <p className="text-sm font-bold text-amber-600 tabular">312 pts</p>
                        </div>
                      </div>
                      {/* Patient rows */}
                      <div className="mt-3 space-y-1.5">
                        {[
                          { nm: 'Sarah Mitchell', amt: '$150 frames' },
                          { nm: 'James Okafor', amt: '$200 contacts' },
                        ].map((r) => (
                          <div key={r.nm} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                            <p className="text-xs font-semibold text-slate-800">{r.nm}</p>
                            <span className="text-xs font-bold text-teal-800 tabular">{r.amt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* Industry stats */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-3 gap-px bg-slate-200">
            <Stat value="15+" label="campaign types — benefit reminders, trunk shows, back to school, and more" />
            <Stat value="$2.4B" label="in vision benefits expire unused every year — your patients' money" />
            <Stat value="$15–50K" label="in optical revenue independent practices recover per year" />
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="How Prizm works"
            title="Up and running this afternoon"
            sub="No EHR integration. No IT department. Works with every practice management system via CSV export."
          />

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                n: '01',
                icon: <Users className="h-6 w-6 text-teal-700" />,
                title: 'Upload your patient list',
                body: 'Export a CSV from RevolutionEHR, Eyefinity, Crystal PM, or any EHR. Prizm maps your columns and cleans the data automatically.',
                delay: 'delay-[0ms]',
              },
              {
                n: '02',
                icon: <ShieldCheck className="h-6 w-6 text-teal-700" />,
                title: 'Prizm verifies every benefit in real time',
                body: 'We check frame allowance, contact lens benefits, exam coverage, and expiration date for every patient — direct from the insurance carrier.',
                delay: 'delay-[100ms]',
              },
              {
                n: '03',
                icon: <MessageSquare className="h-6 w-6 text-teal-700" />,
                title: 'Personalized campaigns go out automatically',
                body: "Every patient gets a message with their exact dollar amounts. You approve once. Prizm sends year-round — staggered so your front desk isn't flooded.",
                delay: 'delay-[200ms]',
              },
            ].map((step) => (
              <RevealBlock key={step.n} delay={step.delay}>
                <div className={`${CARD} relative p-7 hover:border-slate-300 transition-colors`}>
                  <span className="font-display absolute top-5 right-6 text-5xl font-semibold text-slate-100">{step.n}</span>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 border border-teal-100">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.body}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ── Eligibility ─────────────────────────────────────────────────────── */}
      <section id="verification" className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-3">Real-time eligibility</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-[-0.02em] text-slate-900">
                Know exactly what every patient has left — before they walk in
              </h2>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Prizm checks directly with VSP, EyeMed, Davis Vision, Spectera, and all major carriers. No phone calls. No portal logins. Every patient's benefits are verified and attached to their record automatically.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: <DollarSign className="h-4 w-4 text-teal-700" />, text: 'Frame allowance, contact lens benefit, and exam copay — exact amounts' },
                  { icon: <Bell className="h-4 w-4 text-teal-700" />, text: 'Expiration dates tracked so campaigns fire before benefits lapse' },
                  { icon: <FileCheck className="h-4 w-4 text-teal-700" />, text: 'Deductible status and prior auth requirements flagged automatically' },
                  { icon: <TrendingUp className="h-4 w-4 text-teal-700" />, text: 'Full eligibility history per patient for every visit' },
                ].map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-teal-50 border border-teal-100">
                      {f.icon}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Eligibility cards — each fades in with stagger */}
            <div className="space-y-4">
              <RevealBlock delay="delay-[0ms]">
                <div className={`${CARD} p-5`}>
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
                          <p className="text-sm font-bold text-slate-900 tabular">{p.frame !== '$0' ? `${p.frame} frames` : p.cl !== '$0' ? `${p.cl} CL` : '—'}</p>
                          <p className={`text-xs font-medium ${p.color}`}>{p.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-xl bg-teal-50 border border-teal-100 px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-teal-800">38 verified today</span>
                    <span className="text-sm font-bold text-teal-800 tabular">$4,820 in benefits found</span>
                  </div>
                </div>
              </RevealBlock>

              <RevealBlock delay="delay-[150ms]">
                <VerificationCard />
              </RevealBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader
            eyebrow="Everything included"
            title="Not a blast. A revenue engine."
            sub="Generic benefit reminders get ignored. Personalized messages with exact dollar amounts get appointments."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <DollarSign className="h-5 w-5 text-teal-700" />,
                title: 'Exact dollar amounts',
                body: '"You have $150 in frame benefits expiring Dec 31" — not a generic reminder. Prizm pulls the real number for every patient.',
                delay: 'delay-[0ms]',
              },
              {
                icon: <ShieldCheck className="h-5 w-5 text-teal-700" />,
                title: 'Real-time insurance verification',
                body: 'Direct connections to VSP, EyeMed, Davis Vision, Spectera, and all major vision carriers. Checks happen automatically.',
                delay: 'delay-[50ms]',
              },
              {
                icon: <FileCheck className="h-5 w-5 text-teal-700" />,
                title: 'Automatic campaign scheduling',
                body: 'Set it once and Prizm sends the right message at the right time — 30-day expiry alerts, mid-year reminders, CL reorder windows. No manual work.',
                delay: 'delay-[100ms]',
              },
              {
                icon: <Bell className="h-5 w-5 text-teal-700" />,
                title: 'Year-round, always-on',
                body: "Prizm sends campaigns automatically all year — not just a Q4 blast. Staggered delivery keeps your front desk from being overwhelmed.",
                delay: 'delay-[150ms]',
              },
              {
                icon: <BarChart3 className="h-5 w-5 text-teal-700" />,
                title: 'Revenue attribution',
                body: 'Track exactly how much optical revenue each campaign recovered — reply rate, appointments booked, dollars attributed.',
                delay: 'delay-[200ms]',
              },
              {
                icon: <Lock className="h-5 w-5 text-teal-700" />,
                title: 'HIPAA compliant by design',
                body: 'BAA included. Row-level security on all patient data. MFA required. Audit logs on every read and write. Not an afterthought.',
                delay: 'delay-[250ms]',
              },
            ].map((f) => (
              <RevealBlock key={f.title} delay={f.delay}>
                <div className={`${CARD} p-6 hover:border-slate-300 transition-colors`}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 border border-teal-100">
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
                </div>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founding offer ────────────────────────────────────────────────────── */}
      <section id="founding-offer" className="border-t border-slate-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 mb-3">Everything included</p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">One plan. Everything in it.</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">No add-ons, no per-message fees, no per-verification charges. Every practice gets the full platform — verification, campaigns, AI messaging, and delivery — from day one.</p>
              <div className="mt-6 space-y-3">
                {[
                  'Real-time insurance eligibility verification',
                  'All campaign templates',
                  'AI-personalized messages per patient',
                  'SMS + email delivery',
                  'Revenue tracking and attribution',
                  'HIPAA BAA included',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-700 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Founding offer card — fades in on scroll */}
            <RevealBlock>
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-[0_2px_16px_rgba(180,83,9,0.08)]">
                <div className="inline-flex items-center rounded-full border border-amber-300 bg-white px-3 py-1 mb-5">
                  <span className="text-xs font-bold text-amber-800">Founding offer · first 10 practices</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
                  Lock in our lowest rate — for life.
                </h3>
                <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                  The first 10 practices to come on board lock in a permanent founding discount, for as long
                  as they stay with us. In return: a 12-month commitment, your feedback, and a case study if
                  the results are strong. A few spots are already taken.
                </p>
                <a href="/founding" className={`${PRIMARY_BTN} mt-6 w-full bg-amber-700 hover:bg-amber-800 shadow-amber-900/15`}>
                  See the founding offer <ArrowRight className="h-4 w-4" />
                </a>
                <p className="mt-3 text-center text-xs text-slate-500">No credit card to start · HIPAA BAA included</p>
              </div>
            </RevealBlock>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-[-0.02em] text-slate-900">
            Your patients have money waiting.<br />
            <span className="text-teal-700">Are you going to tell them?</span>
          </h2>
          <p className="mt-5 text-lg text-slate-600 max-w-xl mx-auto">
            Upload your patient list today. In 60 seconds, Prizm shows you exactly how much recoverable revenue is sitting in your practice — before you pay anything.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button onClick={openDemo} className={`${PRIMARY_BTN} px-8 py-4 text-base`}>
              See your numbers free
            </button>
            <button onClick={openContact} className={`${SECONDARY_BTN} px-8 py-4 text-base`}>
              Talk to a human <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Want in on the founding offer?{' '}
            <a href="/founding" className="text-amber-700 hover:text-amber-800 font-semibold transition-colors">
              Apply to be a founding practice →
            </a>
          </p>
        </div>
      </section>

      {/* EHR Compatibility */}
      <section className="border-t border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-10">Works with every major practice management system</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              'RevolutionEHR',
              'Eyefinity',
              'Crystal PM',
              'Compulink',
              'My Vision Express',
            ].map((name) => (
              <div key={name} className={`${CARD} flex flex-col items-center gap-2 px-4 py-5 text-center hover:border-slate-300 transition-colors`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 border border-teal-100">
                  <FileCheck className="h-4 w-4 text-teal-700" />
                </div>
                <span className="text-sm font-semibold text-slate-900">{name}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-500 mt-6">No EHR integration required — export a CSV, upload, done. Setup takes under an hour.</p>
        </div>
      </section>

      {/* Trust / Built-on strip */}
      <section className="border-t border-slate-200 bg-slate-50 py-12">
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
      <footer className="border-t border-slate-200 bg-teal-950 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L12 19L2 19Z" /><path d="M12 2L22 19L12 19Z" fill-opacity="0.55" />
                  </svg>
                </div>
                <span className="font-display text-base font-semibold text-white">Prizm</span>
              </div>
              <p className="text-xs text-teal-100/70 leading-relaxed mb-4">AI-powered campaign automation for independent optometry practices.</p>
              <p className="text-xs text-teal-200/60">Highland, UT</p>
              <a href="mailto:stockton@prizmvision.com" className="text-xs text-teal-200/60 hover:text-teal-300 transition-colors">stockton@prizmvision.com</a>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-300/70 mb-4">Product</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'How it works', href: '#how-it-works' },
                  { label: 'Eligibility', href: '#verification' },
                  { label: 'Founding offer', href: '/founding' },
                  { label: 'Blog', href: '/blog' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-teal-100/70 hover:text-white transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-300/70 mb-4">Company</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Founding Offer', href: '/founding' },
                  { label: 'Contact', href: 'mailto:stockton@prizmvision.com' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-teal-100/70 hover:text-white transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-300/70 mb-4">Legal &amp; Security</p>
              <ul className="space-y-2.5">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'HIPAA Compliance', href: '/privacy' },
                  { label: 'BAA Available', href: 'mailto:stockton@prizmvision.com' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-sm text-teal-100/70 hover:text-white transition-colors">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-teal-200/60">© 2026 Prizm Vision, LLC · Highland, UT · All rights reserved.</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1">
                <Lock className="h-3 w-3 text-emerald-300" />
                <span className="text-xs font-medium text-emerald-300">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1">
                <ShieldCheck className="h-3 w-3 text-teal-300" />
                <span className="text-xs font-medium text-teal-300">BAA Available</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
