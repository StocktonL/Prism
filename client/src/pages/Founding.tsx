import { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, ValidationError } from '@formspree/react'
import {
  CheckCircle2,
  X,
  Zap,
  Lock,
  ArrowRight,
  Star,
  Users,
  DollarSign,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Clock,
} from 'lucide-react'

const TOTAL_SPOTS = 10
const SPOTS_TAKEN = 3 // update manually as customers sign

// Founding accent button — amber-700 resting passes AA white-on-amber (~5:1).
const FOUNDING_BTN =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-8 py-4 text-base font-bold text-white hover:bg-amber-800 transition-colors shadow-lg shadow-amber-900/20'
const CARD = 'rounded-2xl border border-slate-200 bg-white shadow-[0_2px_16px_rgba(15,118,110,0.05)]'
const INPUT =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/20'

function FoundingForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [state, handleSubmit] = useForm('mykveaoq')

  useEffect(() => {
    if (state.succeeded) setTimeout(() => onSuccess(), 400)
  }, [state.succeeded])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-900 transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-200">
              <Star className="h-5 w-5 text-amber-700" />
            </div>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
              {TOTAL_SPOTS - SPOTS_TAKEN} of {TOTAL_SPOTS} spots remaining
            </span>
          </div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">Apply for Founding Access</h2>
          <p className="mt-1.5 text-sm text-slate-600">
            Lock in our founding rate for life — we'll reach out within 24 hours to confirm your spot and schedule onboarding.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="hidden" name="type" value="Founding Customer Application" />
          <input type="hidden" name="offer" value="Founding rate (locked for life)" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Your name</label>
              <input name="name" required placeholder="Jane Smith" className={INPUT} />
              <ValidationError field="name" prefix="Name" errors={state.errors} className="mt-1 text-xs text-red-500" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Practice name</label>
              <input name="practice" required placeholder="Valley Eye Care" className={INPUT} />
              <ValidationError field="practice" prefix="Practice" errors={state.errors} className="mt-1 text-xs text-red-500" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Work email</label>
            <input name="email" type="email" required placeholder="jane@valleyeyecare.com" className={INPUT} />
            <ValidationError field="email" prefix="Email" errors={state.errors} className="mt-1 text-xs text-red-500" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Phone</label>
            <input name="phone" type="tel" placeholder="(801) 555-1234" className={INPUT} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Active patients</label>
              <select name="patientCount" className={INPUT}>
                <option value="">Select range</option>
                <option>Under 1,000</option>
                <option>1,000 – 2,000</option>
                <option>2,000 – 3,500</option>
                <option>3,500+</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Primary carrier</label>
              <select name="carrier" className={INPUT}>
                <option value="">Select carrier</option>
                <option>VSP</option>
                <option>EyeMed</option>
                <option>Both VSP + EyeMed</option>
                <option>Davis Vision</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Anything else? (optional)</label>
            <textarea
              name="message"
              rows={2}
              placeholder="Current process for benefit outreach, questions, timing..."
              className={`${INPUT} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className={`${FOUNDING_BTN} w-full disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            {state.submitting ? 'Submitting...' : 'Claim My Founding Spot'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-xs text-slate-500">
            No credit card now. We'll confirm your spot and send an agreement within 24 hours.
          </p>
        </form>
      </div>
    </div>
  )
}

function SuccessScreen({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200">
          <Star className="h-7 w-7 text-amber-700" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-slate-900 mb-2">You're in.</h2>
        <p className="text-sm text-slate-600 mb-2">
          Your founding spot is reserved. We'll reach out within 24 hours with your agreement and onboarding date.
        </p>
        <p className="text-sm text-amber-800 font-semibold mb-6">
          Founding rate · locked in for life · {TOTAL_SPOTS - SPOTS_TAKEN - 1} spots left after you.
        </p>
        <button onClick={onDismiss} className="w-full rounded-xl bg-teal-700 py-3 text-sm font-semibold text-white hover:bg-teal-800 transition-colors">
          Got it
        </button>
      </div>
    </div>
  )
}

// ─── What founding customers get ─────────────────────────────────────────────

const foundingPerks = [
  {
    icon: <DollarSign className="h-5 w-5 text-amber-700" />,
    title: 'Our lowest rate. For life.',
    description: 'Founding members lock in a permanent discount off the standard rate — for as long as you stay a customer. The rate never goes up on you.',
  },
  {
    icon: <Users className="h-5 w-5 text-amber-700" />,
    title: 'Direct line to the founder.',
    description: 'Personal cell. Not a support ticket. When something isn\'t working, you call. We fix it that day.',
  },
  {
    icon: <Zap className="h-5 w-5 text-amber-700" />,
    title: 'First access to every new feature.',
    description: 'EHR integrations, Insurance Discovery, multi-location — founding customers get early access before general release.',
  },
  {
    icon: <Star className="h-5 w-5 text-amber-700" />,
    title: 'Shape the product.',
    description: 'Your feedback directly drives the roadmap. If your practice needs it, we build it.',
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-amber-700" />,
    title: 'White-glove onboarding.',
    description: 'We personally handle your first CSV upload, run your first verification batch, and build your first campaign with you.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-amber-700" />,
    title: 'HIPAA-compliant. BAA included.',
    description: 'Business Associate Agreement included at no extra cost. Built on HIPAA-tier infrastructure from day one.',
  },
]

// ─── What founding customers are committing to ────────────────────────────────

const commitments = [
  '12-month annual commitment at the founding rate',
  'Provide feedback after your first campaign',
  'Participate in a 15-minute check-in call at month 3',
  'Share a case study if results are strong (your approval required)',
]

// ─── Social proof / numbers ───────────────────────────────────────────────────

const stats = [
  { value: '$2.4B', label: 'in unused vision benefits annually across US practices' },
  { value: '$22K', label: 'average optical revenue left unclaimed per practice per year' },
  { value: '65%', label: 'of patients have VSP or EyeMed benefits that expire Dec 31' },
  { value: '15–20%', label: 'average patient response rate on benefit reminder campaigns' },
]

// ─── ROI example ─────────────────────────────────────────────────────────────

const roiExample = {
  patients: 1800,
  withBenefits: 847,
  frameAvg: 150,
  clAvg: 130,
  responseRate: 0.15,
  avgSale: 380,
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Founding() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const spotsLeft = TOTAL_SPOTS - SPOTS_TAKEN

  useLayoutEffect(() => {
    document.title = 'Founding Customer Offer | Prizm'
    return () => { document.title = 'Prizm — Vision Benefit Campaign Automation for Optometry Practices' }
  }, [])

  const recoverable = Math.round(roiExample.withBenefits * ((roiExample.frameAvg + roiExample.clAvg) / 2))
  const estimatedRevenue = Math.round(roiExample.withBenefits * roiExample.responseRate * roiExample.avgSale)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L12 19L2 19Z" /><path d="M12 2L22 19L12 19Z" fill-opacity="0.55" />
            </svg>
          </div>
          <span className="font-display text-base font-semibold tracking-tight text-slate-900">Prizm</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-2 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
        >
          Back to home <ChevronRight className="h-3 w-3" />
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pb-24">

        {/* Hero */}
        <div className="pt-12 pb-16 text-center -mx-6 px-6 rounded-b-3xl bg-gradient-to-b from-amber-50 via-white to-slate-50">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 mb-8">
            <Clock className="h-3.5 w-3.5 text-amber-700" />
            <span className="text-xs font-bold text-amber-800">
              {spotsLeft} of {TOTAL_SPOTS} founding spots remaining
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight leading-tight mb-6 text-slate-900">
            Founding Customer
            <br />
            <span className="text-amber-700">Lowest rate. Locked for life.</span>
          </h1>
          <p className="text-sm text-teal-700 font-medium mt-2">Only 10 founding spots available</p>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-4 mt-4">
            The first 10 practices to come on board lock in our founding discount permanently — for as long as you stay with us. It's the best rate Prizm will ever offer, and it never goes up.
          </p>
          <p className="text-base text-slate-500 max-w-xl mx-auto mb-10">
            In exchange: 12-month annual commitment, feedback after your first campaign, and a case study if results are strong.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setShowForm(true)} className={FOUNDING_BTN}>
              Claim my founding spot <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-2 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              See how Prizm works first →
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-400">HIPAA BAA included · No credit card to start · Cancel after year one · No long-term lock-in</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => (
            <div key={s.value} className={`${CARD} p-4 text-center`}>
              <p className="font-display text-2xl font-semibold text-teal-700 tabular">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ROI calculator — static example */}
        <div className="rounded-3xl border border-teal-100 bg-teal-50 p-8 mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-700 mb-4">Example: 1,800-patient VSP practice</p>
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="font-display text-4xl font-semibold text-slate-900 tabular">{roiExample.withBenefits.toLocaleString()}</p>
              <p className="text-sm text-slate-600 mt-1">patients with unused benefits</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-semibold text-teal-700 tabular">${recoverable.toLocaleString()}</p>
              <p className="text-sm text-slate-600 mt-1">in allowances sitting unclaimed</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl font-semibold text-emerald-600 tabular">${estimatedRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-600 mt-1">estimated recovery at 15% response</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
            <p className="text-sm text-slate-700">
              A small handful of additional optical sales a month{' '}
              <span className="font-bold text-slate-900">more than covers your subscription.</span>{' '}
              <span className="text-emerald-600 font-bold">Most practices get there in their first week.</span>
            </p>
          </div>
        </div>

        {/* What you get */}
        <div className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-2 text-slate-900">What founding customers get</h2>
          <p className="text-sm text-slate-500 mb-10">Beyond the rate — this is what makes the first 10 different from every customer after.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {foundingPerks.map((perk) => (
              <div key={perk.title} className={`${CARD} flex gap-4 p-5`}>
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200">
                  {perk.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{perk.title}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What you're committing to */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 mb-16">
          <h2 className="font-display text-xl sm:text-2xl font-semibold mb-2 text-slate-900">What we're asking in return</h2>
          <p className="text-sm text-slate-500 mb-6">This is a partnership. Here's what founding customers commit to:</p>
          <div className="space-y-3">
            {commitments.map((c) => (
              <div key={c} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-teal-700 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">{c}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About the founder — no name, credibility without identity */}
        <div className={`${CARD} p-8 mb-16`}>
          <h2 className="font-display text-xl sm:text-2xl font-semibold mb-4 text-slate-900">Who's building this</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            Prizm is built by a former enterprise SaaS rep who spent 5 years selling B2B software exclusively to independent optometry practices. Not general healthcare. Not dental. Optometry specifically.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            After watching hundreds of practices manually pull VSP reports, call patients one by one, and still miss most of their Q4 opportunity — the solution was obvious. The industry needed campaign automation built around insurance data, not generic communication blasts.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Prizm is purpose-built for this. Not a feature added to a recall platform. Not a side capability of a phone system. One product. One market. Done right.
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold mb-10 text-slate-900">Common questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'When does billing start?',
                a: 'When you go live — after your first CSV upload and first campaign is sent. Not when you sign. If onboarding takes 2 weeks, billing starts in 2 weeks.',
              },
              {
                q: 'What if my EHR isn\'t supported?',
                a: 'Every EHR that exports a CSV works. RevolutionEHR, Eyefinity, Crystal PM, Compulink, My Vision Express — all of them. You export the file, we walk you through uploading it.',
              },
              {
                q: 'What does "annual commit" mean exactly?',
                a: 'A 12-month agreement, billed monthly — not a lump sum upfront. The commitment is what lets us offer the founding rate. After year one, you keep that same founding rate for as long as you stay.',
              },
              {
                q: 'What carriers does Prizm support?',
                a: 'VSP, EyeMed, Davis Vision, and Spectera at launch. That covers 85%+ of vision insurance patients. More carriers added based on customer demand.',
              },
              {
                q: 'Do I need to sign a HIPAA agreement?',
                a: 'Yes — a Business Associate Agreement is part of your onboarding documents. It\'s standard and required before any patient data enters the system. We provide it, you sign it.',
              },
              {
                q: 'What if it doesn\'t work?',
                a: 'If you complete onboarding, upload your patients, send your first campaign, and see zero results — we\'ll refund your first month. The ROI math is straightforward enough that this has never happened in testing.',
              },
            ].map(({ q, a }) => (
              <div key={q} className={`${CARD} p-5`}>
                <p className="text-sm font-bold text-slate-900 mb-2">{q}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-600 to-amber-700 p-10 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 mb-6">
            <Clock className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-bold text-white">{spotsLeft} spots left</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-3 text-white">
            The founding rate. Locked in forever.
          </h2>
          <p className="text-amber-50 mb-8 max-w-lg mx-auto text-sm">
            When these {TOTAL_SPOTS} spots are gone, they're gone — and so is the founding rate. Every practice after pays the standard price.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-4 text-base font-bold text-amber-800 hover:bg-amber-50 transition-colors shadow-lg shadow-amber-900/20"
          >
            Claim my founding spot <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-4 text-xs text-amber-100">HIPAA BAA included · No credit card to start · Cancel after year one · No long-term lock-in</p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-amber-50">
            <span className="flex items-center gap-1.5"><Lock className="h-3 w-3" /> HIPAA compliant</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> BAA included</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3" /> Cancel after year one</span>
          </div>
        </div>

      </div>

      {showForm && !showSuccess && (
        <FoundingForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); setShowSuccess(true) }}
        />
      )}
      {showSuccess && (
        <SuccessScreen onDismiss={() => setShowSuccess(false)} />
      )}
    </div>
  )
}
