import { useState, useEffect } from 'react'
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

function FoundingForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [state, handleSubmit] = useForm('mykveaoq')

  useEffect(() => {
    if (state.succeeded) setTimeout(() => onSuccess(), 400)
  }, [state.succeeded])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30">
              <Star className="h-5 w-5 text-amber-400" />
            </div>
            <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400">
              {TOTAL_SPOTS - SPOTS_TAKEN} of {TOTAL_SPOTS} spots remaining
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Apply for Founding Access</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            $199/month locked in for life — we'll reach out within 24 hours to confirm your spot and schedule onboarding.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="hidden" name="type" value="Founding Customer Application" />
          <input type="hidden" name="offer" value="$199/month founding rate" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Your name</label>
              <input
                name="name"
                required
                placeholder="Jane Smith"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <ValidationError field="name" prefix="Name" errors={state.errors} className="mt-1 text-xs text-red-400" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Practice name</label>
              <input
                name="practice"
                required
                placeholder="Valley Eye Care"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <ValidationError field="practice" prefix="Practice" errors={state.errors} className="mt-1 text-xs text-red-400" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Work email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="jane@valleyeyecare.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <ValidationError field="email" prefix="Email" errors={state.errors} className="mt-1 text-xs text-red-400" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-400">Phone</label>
            <input
              name="phone"
              type="tel"
              placeholder="(801) 555-1234"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Active patients</label>
              <select
                name="patientCount"
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="">Select range</option>
                <option>Under 1,000</option>
                <option>1,000 – 2,000</option>
                <option>2,000 – 3,500</option>
                <option>3,500+</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Primary carrier</label>
              <select
                name="carrier"
                className="w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
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
            <label className="mb-1 block text-xs font-medium text-slate-400">Anything else? (optional)</label>
            <textarea
              name="message"
              rows={2}
              placeholder="Current process for benefit outreach, questions, timing..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={state.submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-slate-900 hover:bg-amber-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 p-8 shadow-2xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30">
          <Star className="h-7 w-7 text-amber-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">You're in.</h2>
        <p className="text-sm text-slate-400 mb-2">
          Your founding spot is reserved. We'll reach out within 24 hours with your agreement and onboarding date.
        </p>
        <p className="text-sm text-amber-400 font-semibold mb-6">
          $199/month · locked in for life · {TOTAL_SPOTS - SPOTS_TAKEN - 1} spots left after you.
        </p>
        <button onClick={onDismiss} className="w-full rounded-xl bg-teal-500 py-3 text-sm font-bold text-white hover:bg-teal-400 transition-colors">
          Got it
        </button>
      </div>
    </div>
  )
}

// ─── What founding customers get ─────────────────────────────────────────────

const foundingPerks = [
  {
    icon: <DollarSign className="h-5 w-5 text-amber-400" />,
    title: '$199/month. Forever.',
    description: 'Launch price is $449/month. You pay $199 for as long as you stay a customer — that\'s $3,000/year saved permanently.',
  },
  {
    icon: <Users className="h-5 w-5 text-amber-400" />,
    title: 'Direct line to the founder.',
    description: 'Personal cell. Not a support ticket. When something isn\'t working, you call. We fix it that day.',
  },
  {
    icon: <Zap className="h-5 w-5 text-amber-400" />,
    title: 'First access to every new feature.',
    description: 'EHR integrations, Insurance Discovery, multi-location — founding customers get early access before general release.',
  },
  {
    icon: <Star className="h-5 w-5 text-amber-400" />,
    title: 'Shape the product.',
    description: 'Your feedback directly drives the roadmap. If your practice needs it, we build it.',
  },
  {
    icon: <MessageSquare className="h-5 w-5 text-amber-400" />,
    title: 'White-glove onboarding.',
    description: 'We personally handle your first CSV upload, run your first verification batch, and build your first campaign with you.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-amber-400" />,
    title: 'HIPAA-compliant. BAA included.',
    description: 'Business Associate Agreement included at no extra cost. Built on HIPAA-tier infrastructure from day one.',
  },
]

// ─── What founding customers are committing to ────────────────────────────────

const commitments = [
  '12-month annual commitment at $199/month',
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

  const recoverable = Math.round(roiExample.withBenefits * ((roiExample.frameAvg + roiExample.clAvg) / 2))
  const estimatedRevenue = Math.round(roiExample.withBenefits * roiExample.responseRate * roiExample.avgSale)

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-black tracking-tight text-white">Prizm</span>
        </button>
        <button
          onClick={() => navigate('/')}
          className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          Back to home <ChevronRight className="h-3 w-3" />
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pb-24">

        {/* Hero */}
        <div className="pt-12 pb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 mb-8">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">
              {spotsLeft} of {TOTAL_SPOTS} founding spots remaining
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
            Founding Customer
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              $199/month. Forever.
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4">
            Prizm launches at $449/month. The first 10 practices to commit get lifetime access at $199 — that's a $3,000/year discount locked in permanently.
          </p>
          <p className="text-base text-slate-500 max-w-xl mx-auto mb-10">
            In exchange: 12-month annual commitment, feedback after your first campaign, and a case study if results are strong.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-base font-bold text-slate-900 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
            >
              Claim my founding spot <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              See how Prizm works first →
            </button>
          </div>

          <p className="mt-4 text-xs text-slate-600">No credit card now. Agreement sent within 24 hours.</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => (
            <div key={s.value} className="rounded-2xl border border-white/5 bg-white/3 p-4 text-center">
              <p className="text-2xl font-black text-teal-400">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-snug">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ROI calculator — static example */}
        <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-900/30 to-cyan-900/20 p-8 mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-4">Example: 1,800-patient VSP practice</p>
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <p className="text-4xl font-black text-white">{roiExample.withBenefits.toLocaleString()}</p>
              <p className="text-sm text-slate-400 mt-1">patients with unused benefits</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-teal-400">${recoverable.toLocaleString()}</p>
              <p className="text-sm text-slate-400 mt-1">in allowances sitting unclaimed</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-emerald-400">${estimatedRevenue.toLocaleString()}</p>
              <p className="text-sm text-slate-400 mt-1">estimated recovery at 15% response</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/20 p-4 text-center">
            <p className="text-sm text-slate-300">
              At $199/month ($2,388/year), you need{' '}
              <span className="font-bold text-white">6.3 additional optical sales</span>{' '}
              to break even.{' '}
              <span className="text-emerald-400 font-bold">Most practices see this in week one.</span>
            </p>
          </div>
        </div>

        {/* What you get */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center mb-2">What founding customers get</h2>
          <p className="text-sm text-slate-500 text-center mb-10">Beyond the price — this is what makes the first 10 different from every customer after.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {foundingPerks.map((perk) => (
              <div key={perk.title} className="flex gap-4 rounded-2xl border border-white/5 bg-white/3 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                  {perk.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{perk.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What you're committing to */}
        <div className="rounded-3xl border border-white/8 bg-white/3 p-8 mb-16">
          <h2 className="text-xl font-black mb-2">What we're asking in return</h2>
          <p className="text-sm text-slate-500 mb-6">This is a partnership. Here's what founding customers commit to:</p>
          <div className="space-y-3">
            {commitments.map((c) => (
              <div key={c} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{c}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About the founder — no name, credibility without identity */}
        <div className="rounded-3xl border border-white/8 bg-white/3 p-8 mb-16">
          <h2 className="text-xl font-black mb-4">Who's building this</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Prizm is built by a former enterprise SaaS rep who spent 5 years selling B2B software exclusively to independent optometry practices. Not general healthcare. Not dental. Optometry specifically.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            After watching hundreds of practices manually pull VSP reports, call patients one by one, and still miss most of their Q4 opportunity — the solution was obvious. The industry needed campaign automation built around insurance data, not generic communication blasts.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Prizm is purpose-built for this. Not a feature added to a recall platform. Not a side capability of a phone system. One product. One market. Done right.
          </p>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-center mb-10">Common questions</h2>
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
                a: '12 months at $199/month, billed monthly. Not a lump sum upfront. Just a 12-month agreement so we can offer the founding price. After year one, you stay at $199/month.',
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
              <div key={q} className="rounded-2xl border border-white/5 bg-white/3 p-5">
                <p className="text-sm font-bold text-white mb-2">{q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-900/20 to-yellow-900/10 p-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 mb-6">
            <Clock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">{spotsLeft} spots left</span>
          </div>
          <h2 className="text-3xl font-black mb-3">
            $199/month. Locked in forever.
          </h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto text-sm">
            When these {TOTAL_SPOTS} spots are gone, they're gone. The next practice that signs up pays $449.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-10 py-4 text-base font-bold text-slate-900 hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
          >
            Claim my founding spot <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-4 text-xs text-slate-600">No credit card. Agreement within 24 hours.</p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-600">
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
