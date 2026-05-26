import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, AlertTriangle } from 'lucide-react'

interface ChecklistItem {
  id: string
  label: string
  note?: string
  critical?: boolean
}

interface Section {
  title: string
  description: string
  items: ChecklistItem[]
}

const SECTIONS: Section[] = [
  {
    title: 'Legal & Business Formation',
    description: 'Must be done before signing any customer contracts.',
    items: [
      { id: 'llc', label: 'Form Utah LLC at utah.gov', note: '$50–70, takes 1–2 days online', critical: true },
      { id: 'ein', label: 'Get EIN from IRS (irs.gov)', note: 'Free, takes 5 minutes online' },
      { id: 'bank', label: 'Open Mercury business bank account (mercury.com)', note: 'Free, no minimum balance' },
      { id: 'lawyer-employment', label: 'Consult Utah employment lawyer re: Weave non-compete', note: '$300–500 — do this BEFORE outreach', critical: true },
      { id: 'lawyer-healthcare', label: 'Consult healthcare attorney', note: '$500–1,000 — reviews BAAs and Privacy Policy' },
      { id: 'cyber-insurance', label: 'Get cyber liability insurance', note: '$1,500–2,500/year — required for HIPAA credibility' },
      { id: 'eo-insurance', label: 'Get E&O (Errors & Omissions) insurance', note: 'Protects against claims from customer data errors' },
    ],
  },
  {
    title: 'HIPAA Compliance — BAAs',
    description: 'Every BAA must be signed BEFORE any real patient data enters the system. No exceptions.',
    items: [
      { id: 'baa-supabase', label: 'Sign BAA with Supabase (must be on HIPAA tier)', note: 'Upgrade from free tier first', critical: true },
      { id: 'baa-stedi', label: 'Sign BAA with Stedi', note: 'Confirm with Elianna — was on agenda for May 22 call', critical: true },
      { id: 'baa-twilio', label: 'Sign BAA with Twilio (HIPAA-eligible tier required)', note: 'Email HIPAA team at Twilio', critical: true },
      { id: 'baa-postmark', label: 'Sign BAA with Postmark', note: 'Request at postmarkapp.com' },
      { id: 'baa-anthropic', label: 'Sign BAA with Anthropic (Claude API)', note: 'Request at console.anthropic.com', critical: true },
      { id: 'baa-vercel', label: 'Sign BAA with Vercel', note: 'Request at vercel.com/legal' },
    ],
  },
  {
    title: 'HIPAA Compliance — Technical',
    description: 'These must be verified in the codebase before going live with real patient data.',
    items: [
      { id: 'rls', label: 'Row-level security on all PHI tables confirmed', note: 'patients, eligibility_checks, campaign_messages', critical: true },
      { id: 'audit-log', label: 'Audit log writing on every PHI read and write', critical: true },
      { id: 'no-phi-logs', label: 'No PHI in any log, URL, or error message — full audit', critical: true },
      { id: 'rls-tested', label: 'RLS tested: Practice A cannot see Practice B data' },
      { id: 'mfa', label: 'MFA enforced for all users on signup' },
      { id: 'session-timeout', label: 'Session timeout at 30 minutes of inactivity' },
      { id: 'https', label: 'HTTPS enforced everywhere (Vercel handles this)' },
    ],
  },
  {
    title: 'Legal Documents on Site',
    description: 'Required by HIPAA and expected by any practice manager before they sign up.',
    items: [
      { id: 'privacy-policy', label: 'Privacy Policy live at prizmvision.com/privacy', note: 'Must be HIPAA-compliant', critical: true },
      { id: 'tos', label: 'Terms of Service live at prizmvision.com/terms', critical: true },
      { id: 'baa-template', label: 'Customer BAA template ready (via DocuSign)', note: 'Every customer must sign before uploading patient data', critical: true },
      { id: 'msa', label: 'Master Service Agreement template ready' },
    ],
  },
  {
    title: 'Core Product — Must Work Before First Customer',
    description: 'These are the features a customer actually pays for.',
    items: [
      { id: 'csv-upload', label: 'CSV upload with column mapping works end-to-end', note: '✅ Built — needs real-data testing' },
      { id: 'stedi-wired', label: 'Stedi eligibility API wired for batch verification', note: 'Waiting for 3 customers or 10 waitlist signups' },
      { id: 'aha-moment', label: 'Aha moment screen shows total recoverable revenue', note: 'Needs Stedi data to populate' },
      { id: 'claude-messages', label: 'Claude API generates personalized campaign messages' },
      { id: 'approval-workflow', label: 'Practice can review and approve messages before send' },
      { id: 'twilio-sms', label: 'Twilio SMS sends approved campaigns', note: 'At least one real SMS sent and received' },
      { id: 'stripe', label: 'Stripe subscription billing at $449/month', note: 'Can manually invoice first 3 customers if needed' },
    ],
  },
  {
    title: 'First Customer Readiness',
    description: 'Everything needed to onboard customer #1 smoothly.',
    items: [
      { id: 'docusign', label: 'DocuSign account set up for BAA + service agreement' },
      { id: 'onboarding-call', label: 'Kickoff call agenda written (30 min script)' },
      { id: 'ehr-instructions', label: 'EHR export instructions written for RevolutionEHR, Eyefinity, Crystal PM' },
      { id: 'support-email', label: 'Support email set up at stockton@prizmvision.com', note: '✅ Google Workspace is live' },
      { id: 'demo-flow', label: 'Can demo full flow end-to-end in under 10 minutes' },
    ],
  },
]

const STORAGE_KEY = 'prizm_checklist'

export default function Checklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setChecked(JSON.parse(saved))
  }, [])

  function toggle(id: string) {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const allItems = SECTIONS.flatMap(s => s.items)
  const criticalItems = allItems.filter(i => i.critical)
  const totalDone = allItems.filter(i => checked[i.id]).length
  const criticalDone = criticalItems.filter(i => checked[i.id]).length
  const pct = Math.round((totalDone / allItems.length) * 100)

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 px-6 py-4">
        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to Prizm
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Go-Live Checklist</h1>
        <p className="text-slate-500 mb-8">Everything that must be done before selling Prizm to real customers.</p>

        {/* Progress bar */}
        <div className="rounded-2xl border border-slate-100 p-6 mb-10">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-2xl font-black text-slate-900">{totalDone} / {allItems.length}</p>
              <p className="text-sm text-slate-500">items complete</p>
            </div>
            <p className="text-3xl font-black text-teal-500">{pct}%</p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {criticalDone < criticalItems.length && (
            <div className="mt-4 flex items-center gap-2 text-sm text-amber-600">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{criticalItems.length - criticalDone} critical items remaining before real patient data can enter the system.</span>
            </div>
          )}
        </div>

        <div className="space-y-10">
          {SECTIONS.map(section => {
            const sectionDone = section.items.filter(i => checked[i.id]).length
            return (
              <div key={section.title}>
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
                  <span className="text-sm text-slate-400">{sectionDone}/{section.items.length}</span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{section.description}</p>
                <div className="space-y-2">
                  {section.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      className={`w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3 transition-all ${
                        checked[item.id]
                          ? 'border-teal-100 bg-teal-50'
                          : item.critical
                            ? 'border-amber-100 bg-amber-50 hover:border-amber-200'
                            : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {checked[item.id]
                        ? <CheckCircle2 className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        : <Circle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${item.critical ? 'text-amber-400' : 'text-slate-300'}`} />
                      }
                      <div>
                        <p className={`text-sm font-medium ${checked[item.id] ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {item.label}
                          {item.critical && !checked[item.id] && (
                            <span className="ml-2 text-xs font-bold text-amber-600 uppercase tracking-wide">Required</span>
                          )}
                        </p>
                        {item.note && (
                          <p className="text-xs text-slate-400 mt-0.5">{item.note}</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-slate-300 text-center mt-16">Progress is saved in your browser.</p>
      </div>
    </div>
  )
}
