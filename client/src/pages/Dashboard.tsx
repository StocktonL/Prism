import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  DollarSign,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  CalendarClock,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Send,
  Users,
  PenLine,
  ShoppingBag,
  Bell,
  CheckSquare,
  Eye,
  RotateCcw,
  FileCheck,
  Lock,
  Glasses,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const HAS_PATIENTS = true

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  {
    title: 'Verifications Today',
    value: '38',
    sub: '31 active · 4 issues · 3 pending',
    icon: <ShieldCheck className="h-5 w-5 text-teal-600" />,
    bg: 'bg-teal-50',
    trend: '+6 vs yesterday',
    trendUp: true,
    nav: '/app/eligibility',
  },
  {
    title: 'Revenue Recovered',
    value: '$24,180',
    sub: '$449 subscription · 54x ROI this month',
    icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
    bg: 'bg-emerald-50',
    trend: '+18% vs last month',
    trendUp: true,
    nav: '/app/campaigns',
  },
  {
    title: 'Benefits Expiring',
    value: '$48,360',
    sub: 'frame + contact allowances · 312 patients',
    icon: <CalendarClock className="h-5 w-5 text-rose-600" />,
    bg: 'bg-rose-50',
    trend: '87 days until year-end',
    trendUp: false,
    nav: '/app/patients',
  },
  {
    title: 'SMS Delivered',
    value: '1,204',
    sub: '~$20 avg optical sale per reply',
    icon: <MessageSquare className="h-5 w-5 text-violet-600" />,
    bg: 'bg-violet-50',
    trend: '96.2% delivery rate',
    trendUp: true,
    nav: '/app/campaigns',
  },
]

// ─── Top patients by benefit value ───────────────────────────────────────────

interface TopPatient {
  name: string
  carrier: string
  carrierColor: string
  frame: number
  contacts: number
  lastVisit: string
  messaged: boolean
}

const topPatients: TopPatient[] = [
  { name: 'David Okafor',    carrier: 'EyeMed',       carrierColor: 'bg-blue-50 text-blue-700',    frame: 200, contacts: 200, lastVisit: '14 mo ago', messaged: false },
  { name: 'Marcus Rivera',   carrier: 'Spectera',      carrierColor: 'bg-purple-50 text-purple-700', frame: 200, contacts: 150, lastVisit: '9 mo ago',  messaged: false },
  { name: 'Sarah Mitchell',  carrier: 'VSP',           carrierColor: 'bg-teal-50 text-teal-700',    frame: 150, contacts: 130, lastVisit: '11 mo ago', messaged: false },
  { name: 'Amara Osei',      carrier: 'Davis Vision',  carrierColor: 'bg-amber-50 text-amber-700',  frame: 130, contacts: 150, lastVisit: '7 mo ago',  messaged: false },
  { name: 'Linda Kowalski',  carrier: 'VSP',           carrierColor: 'bg-teal-50 text-teal-700',    frame: 150, contacts: 130, lastVisit: '13 mo ago', messaged: false },
  { name: 'Robert Chen',     carrier: 'EyeMed',        carrierColor: 'bg-blue-50 text-blue-700',    frame: 200, contacts: 0,   lastVisit: '6 mo ago',  messaged: true  },
]

// ─── Carrier breakdown ────────────────────────────────────────────────────────

const carrierBreakdown = [
  { name: 'VSP',          patients: 412, available: 61800, color: 'bg-teal-500',   pill: 'bg-teal-50 text-teal-700'    },
  { name: 'EyeMed',       patients: 287, available: 43050, color: 'bg-blue-500',   pill: 'bg-blue-50 text-blue-700'    },
  { name: 'Davis Vision', patients: 89,  available: 13350, color: 'bg-amber-500',  pill: 'bg-amber-50 text-amber-700'  },
  { name: 'Spectera',     patients: 42,  available: 6300,  color: 'bg-purple-500', pill: 'bg-purple-50 text-purple-700'},
  { name: 'Other',        patients: 17,  available: 2550,  color: 'bg-slate-400',  pill: 'bg-slate-100 text-slate-600' },
]
const totalCarrierPatients = carrierBreakdown.reduce((s, c) => s + c.patients, 0)

// ─── Brand segments ───────────────────────────────────────────────────────────

const brandSegments = [
  { brand: 'Ray-Ban',   patients: 31, icon: '🕶️', color: 'border-slate-200 hover:border-slate-400'  },
  { brand: 'Maui Jim',  patients: 23, icon: '🌊', color: 'border-blue-200 hover:border-blue-400'    },
  { brand: 'Oakley',    patients: 19, icon: '⚡',  color: 'border-rose-200 hover:border-rose-400'   },
  { brand: 'Costa',     patients: 18, icon: '🎣', color: 'border-cyan-200 hover:border-cyan-400'    },
  { brand: 'Kate Spade',patients: 12, icon: '✨', color: 'border-pink-200 hover:border-pink-400'    },
  { brand: 'Silhouette',patients: 8,  icon: '💎', color: 'border-violet-200 hover:border-violet-400'},
]

// ─── Verification queue ───────────────────────────────────────────────────────

type VerifStatus = 'active' | 'inactive' | 'pending' | 'needs-auth'

interface VerifRow {
  name: string; carrier: string; memberId: string; copay: string
  covered: string; frameAllowance: string; clAllowance: string
  status: VerifStatus; flag?: string
}

const todayVerifs: VerifRow[] = [
  { name: 'Sarah Mitchell', carrier: 'VSP',     memberId: 'VSP00192837', copay: '$10 exam · $25 materials', covered: 'Routine vision — exam + materials',          frameAllowance: '$150', clAllowance: '$130', status: 'active' },
  { name: 'James Thornton', carrier: 'EyeMed',  memberId: 'EM88234001',  copay: '$0 exam · $0 materials',   covered: 'Benefits used Jan 2026',                    frameAllowance: '$0',   clAllowance: '$0',   status: 'inactive',   flag: 'Benefits used — next eligible Jan 2027' },
  { name: 'Thomas Garrett', carrier: 'Anthem',  memberId: 'ANT66781204', copay: '$20 exam · $20 materials', covered: 'Routine vision + medical exam',              frameAllowance: '$150', clAllowance: '$0',   status: 'needs-auth', flag: 'Prior authorization required before dispensing' },
  { name: 'Diana Patel',    carrier: 'VSP',     memberId: 'VSP00834291', copay: '$10 exam · $25 materials', covered: 'Routine vision — $60 frame balance remaining',frameAllowance: '$60',  clAllowance: '$130', status: 'active',     flag: 'Subscriber: Raj Patel (parent)' },
  { name: 'Marcus Rivera',  carrier: 'Spectera',memberId: 'SP77123456',  copay: '$20 exam · $20 materials', covered: 'Routine vision — full benefits available',   frameAllowance: '$200', clAllowance: '$150', status: 'pending',    flag: 'Last verified Nov 2025 — re-verify recommended' },
]

const verifStatusConfig: Record<VerifStatus, { label: string; icon: React.ReactNode; className: string }> = {
  active:       { label: 'Active',    icon: <CheckCircle2  className="h-3.5 w-3.5" />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactive:     { label: 'Inactive',  icon: <XCircle       className="h-3.5 w-3.5" />, className: 'bg-red-50 text-red-700 border-red-200'             },
  pending:      { label: 'Pending',   icon: <Clock         className="h-3.5 w-3.5" />, className: 'bg-amber-50 text-amber-700 border-amber-200'        },
  'needs-auth': { label: 'Auth Reqd', icon: <AlertTriangle className="h-3.5 w-3.5" />, className: 'bg-rose-50 text-rose-700 border-rose-200'           },
}

// ─── Revenue pipeline ─────────────────────────────────────────────────────────

const pipelineStages = [
  { label: 'Sending This Week',      patients: 47,  value: '$11,280', description: 'Benefits expire within 30 days', color: 'bg-rose-500',  textColor: 'text-rose-700',  bg: 'bg-rose-50',  border: 'border-rose-200',  pill: 'bg-rose-100 text-rose-700'   },
  { label: 'Queued — Next 2 Weeks',  patients: 89,  value: '$21,540', description: 'Benefits expire in 31–60 days', color: 'bg-amber-400', textColor: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', pill: 'bg-amber-100 text-amber-700' },
  { label: 'Scheduled — Next Month', patients: 156, value: '$37,920', description: 'Benefits expire in 61–90 days', color: 'bg-teal-500',  textColor: 'text-teal-700',  bg: 'bg-teal-50',  border: 'border-teal-200',  pill: 'bg-teal-100 text-teal-700'   },
]

// ─── Claims ───────────────────────────────────────────────────────────────────

interface ClaimRow { patient: string; carrier: string; amount: string; service: string; status: 'approved' | 'submitted' | 'pending' | 'denied' }

const todaysClaims: ClaimRow[] = [
  { patient: 'Sarah Mitchell', carrier: 'VSP',          amount: '$287', service: 'Exam + frames',  status: 'approved'  },
  { patient: 'James Okafor',   carrier: 'EyeMed',       amount: '$412', service: 'Exam + CL fit',  status: 'approved'  },
  { patient: 'Linda Chen',     carrier: 'Davis Vision', amount: '$195', service: 'Frames only',    status: 'submitted' },
  { patient: 'Marcus Webb',    carrier: 'Spectera',     amount: '$338', service: 'Exam + frames',  status: 'pending'   },
  { patient: 'Priya Nair',     carrier: 'VSP',          amount: '$156', service: 'Contacts only',  status: 'approved'  },
]

const claimStatusConfig = {
  approved:  { label: 'Approved',  className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  submitted: { label: 'Submitted', className: 'bg-blue-50 text-blue-700 border-blue-200'          },
  pending:   { label: 'Pending',   className: 'bg-amber-50 text-amber-700 border-amber-200'        },
  denied:    { label: 'Denied',    className: 'bg-red-50 text-red-700 border-red-200'              },
}

// ─── This week's sends ────────────────────────────────────────────────────────

interface ScheduledSend { name: string; carrier: string; frameAllowance: string; contactAllowance: string; reason: string; sendDay: string; channel: 'SMS' | 'Email'; status: 'sending-today' | 'scheduled' }

const thisWeeksSends: ScheduledSend[] = [
  { name: 'Linda Kowalski', carrier: 'VSP',          frameAllowance: '$150', contactAllowance: '$130', reason: 'Benefits expire in 28 days', sendDay: 'Today',    channel: 'SMS',   status: 'sending-today' },
  { name: 'Robert Chen',    carrier: 'EyeMed',       frameAllowance: '$200', contactAllowance: '$0',   reason: 'Benefits expire in 22 days', sendDay: 'Today',    channel: 'SMS',   status: 'sending-today' },
  { name: 'Amara Osei',     carrier: 'Davis Vision', frameAllowance: '$130', contactAllowance: '$150', reason: 'Benefits expire in 30 days', sendDay: 'Tomorrow', channel: 'Email', status: 'scheduled'     },
  { name: 'Priya Nair',     carrier: 'VSP',          frameAllowance: '$150', contactAllowance: '$0',   reason: 'Benefits expire in 26 days', sendDay: 'Wed',      channel: 'SMS',   status: 'scheduled'     },
  { name: 'David Okafor',   carrier: 'EyeMed',       frameAllowance: '$200', contactAllowance: '$200', reason: 'Benefits expire in 29 days', sendDay: 'Thu',      channel: 'SMS',   status: 'scheduled'     },
]

// ─── Approval queue ───────────────────────────────────────────────────────────

interface PendingCampaign { id: number; name: string; type: string; patients: number; recoverable: string; scheduledFor: string; sampleMessage: string; carrier: string }

const pendingApprovals: PendingCampaign[] = [
  { id: 1, name: 'End of Year — VSP Patients',          type: 'End of Year Benefits', patients: 187, recoverable: '$28,050', scheduledFor: 'Today at 10:00 AM',    sampleMessage: "Hi Sarah, just a heads up — our records show you have $150 in unused frame benefits at Mountain View Eye Care expiring Dec 31. Most patients don't realize these don't carry over. Schedule before they're gone:", carrier: 'VSP'         },
  { id: 2, name: 'End of Year — EyeMed Patients',       type: 'End of Year Benefits', patients: 94,  recoverable: '$14,100', scheduledFor: 'Tomorrow at 9:00 AM',  sampleMessage: "Hi James, wanted to give you a heads up — our records show your EyeMed plan still has $200 in frame benefits you haven't used. These expire Dec 31 and don't roll over. Book your appointment now:", carrier: 'EyeMed'       },
  { id: 3, name: 'Contact Lens Reorder — 30-Day Window', type: 'CL Reorder',          patients: 43,  recoverable: '$6,450',  scheduledFor: 'Wed at 11:00 AM',      sampleMessage: "Hi Linda, did you know your annual contact lens supply is running low? You have $130 in contacts benefits remaining — reorder now and we'll handle the rest:", carrier: 'All carriers' },
]

// ─── Manual campaign types ────────────────────────────────────────────────────

const manualCampaigns = [
  { title: 'Trunk Show',        type: 'Trunk Show',        description: 'Target benefit-eligible patients for a vendor frame event', icon: <ShoppingBag className="h-4 w-4 text-amber-600" />, iconBg: 'bg-amber-50',  border: 'border-amber-200 hover:border-amber-400'   },
  { title: 'Mid-Year Reminder', type: 'Mid-Year Reminder', description: 'Re-engage patients with benefits still available',          icon: <Bell        className="h-4 w-4 text-teal-600"  />, iconBg: 'bg-teal-50',   border: 'border-teal-200 hover:border-teal-400'     },
  { title: 'Custom Campaign',   type: 'Custom Campaign',   description: 'Build your own message for any occasion',                   icon: <PenLine     className="h-4 w-4 text-slate-600" />, iconBg: 'bg-slate-100', border: 'border-slate-200 hover:border-slate-400'   },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Your revenue engine is ready</h3>
        <p className="mt-2 text-sm text-slate-500 mb-8">Upload your patient list to see exactly how much unused benefit revenue is sitting in your practice.</p>
        <button
          onClick={onUpload}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors shadow-md"
        >
          Upload Patient List
        </button>
        <p className="mt-3 text-xs text-slate-400">Works with RevolutionEHR, Eyefinity, Crystal PM, and any EHR that exports CSV</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const [previewIndex, setPreviewIndex] = useState(0)

  const cyclingPreviews = [
    { name: 'Sarah Mitchell',  carrier: 'VSP',          frame: '$150', cl: '$130', msg: "Hi Sarah, just a heads up — our records show you have $150 in frame benefits and $130 in contact lens benefits you haven't used. Did you know these expire Dec 31 and don't carry over? Reply YES to schedule. — Valley Eye Care" },
    { name: 'James Okafor',    carrier: 'EyeMed',       frame: '$200', cl: '$0',   msg: "Hi James, did you know your EyeMed plan still has $200 in unused frame benefits? Our records show they expire Dec 31 — happy to get you in before then. Reply YES. — Valley Eye Care" },
    { name: 'Linda Chen',      carrier: 'Davis Vision', frame: '$130', cl: '$150', msg: "Hi Linda, wanted to make you aware — our records show you have $130 in frame benefits and $150 in contact lens benefits through Davis Vision. Most patients don't realize these expire. Reply YES to book. — Valley Eye Care" },
    { name: 'Marcus Webb',     carrier: 'Spectera',     frame: '$200', cl: '$200', msg: "Hi Marcus, not sure if you're aware — your Spectera plan shows $200 for frames AND $200 for contacts still available, all expiring Dec 31. Reply YES to schedule before they're gone. — Valley Eye Care" },
  ]

  useEffect(() => {
    const timer = setInterval(() => setPreviewIndex(i => (i + 1) % cyclingPreviews.length), 3000)
    return () => clearInterval(timer)
  }, [])

  if (!HAS_PATIENTS) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">{greeting()}</h2>
        <EmptyState onUpload={() => navigate('/app/patients/upload')} />
      </div>
    )
  }

  const currentPreview = cyclingPreviews[previewIndex]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{greeting()}</h2>
          <p className="mt-1 text-sm text-slate-500">You've recovered <span className="font-semibold text-emerald-600">$24,180</span> this month. 312 patients have benefits expiring.</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 self-start flex-shrink-0">
          <Lock className="h-3.5 w-3.5 text-emerald-600" />
          <span className="hidden sm:inline text-xs font-medium text-emerald-700">HIPAA · Audit logging active · Data encrypted</span>
          <span className="sm:hidden text-xs font-medium text-emerald-700">HIPAA secure</span>
        </div>
      </div>

      {/* Aha moment */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-700 p-6 shadow-md">
        <div className="relative z-10">
          <p className="text-sm font-medium text-teal-200 mb-1">Recoverable optical revenue in your patient list</p>
          <p className="text-3xl sm:text-5xl font-black text-white tracking-tight">$127,050</p>
          <p className="mt-2 text-teal-100 text-sm">847 patients have unused insurance benefits — frames, contacts, and exam coverage waiting to be used.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-teal-200">Frame allowances</p>
              <p className="text-lg font-bold text-white">$82,350</p>
              <p className="text-xs text-teal-300">548 patients</p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-teal-200">Contact lens benefits</p>
              <p className="text-lg font-bold text-white">$44,700</p>
              <p className="text-xs text-teal-300">299 patients</p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-teal-200">At 20% response rate</p>
              <p className="text-lg font-bold text-white">~$25,410</p>
              <p className="text-xs text-teal-300">estimated recovery</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title} onClick={() => navigate(s.nav)} className="border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:border-teal-200 transition-all">
            <CardContent className="pt-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} mb-3`}>{s.icon}</div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
              <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${s.trendUp ? 'text-emerald-600' : 'text-slate-400'}`}>
                <TrendingUp className="h-3 w-3" />{s.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Urgent alert */}
      <Card className="border-rose-200 bg-rose-50/60 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100">
              <AlertCircle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-900">$48,360 in patient benefits expiring within 30 days</p>
              <p className="text-xs text-rose-700">312 patients have unused frame and contact allowances. Prizm is automatically sending reminders — 47 going out this week.</p>
            </div>
          </div>
          <button onClick={() => navigate('/app/campaigns')} className="flex flex-shrink-0 items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm whitespace-nowrap">
            View campaigns <ChevronRight className="h-3 w-3" />
          </button>
        </CardContent>
      </Card>

      {/* Top patients + carrier breakdown */}
      <div className="grid gap-4 lg:grid-cols-5">

        {/* Top patients by benefit value */}
        <Card className="border-slate-200 shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Top Patients by Benefit Value</CardTitle>
                  <CardDescription className="text-xs">Highest unused allowances — sorted by total available</CardDescription>
                </div>
              </div>
              <button onClick={() => navigate('/app/patients')} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
                All patients <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {topPatients.map((p) => {
                const total = p.frame + p.contacts
                return (
                  <div key={p.name} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.carrierColor}`}>{p.carrier}</span>
                        <span className="text-xs text-slate-400 hidden sm:inline">{p.lastVisit}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {p.frame > 0 && <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.5">${p.frame} frames</span>}
                        {p.contacts > 0 && <span className="text-xs font-medium text-cyan-700 bg-cyan-50 border border-cyan-200 rounded px-1.5 py-0.5">${p.contacts} contacts</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">${total}</p>
                        <p className="text-xs text-slate-400">total</p>
                      </div>
                      {!p.messaged ? (
                        <button onClick={() => navigate('/app/campaigns')} className="flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors whitespace-nowrap">
                          <Send className="h-3 w-3" /> Send
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-400">
                          <CheckCircle2 className="h-3 w-3" /> Sent
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-100 px-4 py-3">
              <button onClick={() => navigate('/app/patients')} className="text-xs font-medium text-teal-600 hover:underline">
                View all 847 patients with unused benefits →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Carrier breakdown */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                <ShieldCheck className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-base">By Insurance Carrier</CardTitle>
                <CardDescription className="text-xs">{totalCarrierPatients} patients · $127,050 available</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {carrierBreakdown.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.pill}`}>{c.name}</span>
                    <span className="text-xs text-slate-400">{c.patients} patients</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">${c.available.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${Math.round((c.patients / totalCarrierPatients) * 100)}%` }} />
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/app/patients')} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Filter patients by carrier <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </CardContent>
        </Card>

      </div>

      {/* Campaign approval queue */}
      <Card className="border-amber-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                <CheckSquare className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  Awaiting Your Approval
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">{pendingApprovals.length}</span>
                </CardTitle>
                <CardDescription className="text-xs">Review each campaign before it sends — personalized messages with exact benefit amounts are ready</CardDescription>
              </div>
            </div>
            <button onClick={() => navigate('/app/campaigns')} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
              All campaigns <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {pendingApprovals.map((c) => (
              <div key={c.id} className="px-3 sm:px-5 py-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div className="min-w-0 flex-1 w-full">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{c.carrier}</span>
                      <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-medium">{c.patients} patients · {c.recoverable} recoverable</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">Scheduled: {c.scheduledFor}</p>
                    <div className="rounded-lg border border-teal-100 bg-slate-50 px-3 py-2">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-slate-400">Live preview — each patient gets their own message</p>
                        <div className="flex gap-1">
                          {cyclingPreviews.map((_, i) => (
                            <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === previewIndex ? 'bg-teal-500' : 'bg-slate-300'}`} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {currentPreview.name[0]}
                        </div>
                        <span className="text-xs font-semibold text-slate-700">{currentPreview.name}</span>
                        <span className="text-xs text-slate-400">{currentPreview.carrier}</span>
                        <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.5">{currentPreview.frame} frames</span>
                        {currentPreview.cl !== '$0' && <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded px-1.5 py-0.5">{currentPreview.cl} contacts</span>}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">"{currentPreview.msg}"</p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col flex-row gap-1.5 flex-shrink-0 w-full sm:w-auto">
                    <button onClick={() => navigate('/app/campaigns')} className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors whitespace-nowrap">
                      <CheckCircle2 className="h-3 w-3" /> Approve
                    </button>
                    <button onClick={() => navigate('/app/campaigns')} className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap">
                      <Eye className="h-3 w-3" /> Review
                    </button>
                    <button onClick={() => navigate('/app/campaigns')} className="hidden sm:flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap">
                      <RotateCcw className="h-3 w-3" /> Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand segments */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                <Glasses className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base">Brand Segments</CardTitle>
                <CardDescription className="text-xs">Patients grouped by their last frame purchase — perfect for trunk show targeting</CardDescription>
              </div>
            </div>
            <button onClick={() => navigate('/app/campaigns', { state: { openModal: true, campaignType: 'Trunk Show' } })} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors whitespace-nowrap">
              New trunk show <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {brandSegments.map((b) => (
              <button
                key={b.brand}
                onClick={() => navigate('/app/campaigns', { state: { openModal: true, campaignType: 'Trunk Show', brand: b.brand } })}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 bg-white p-4 text-center transition-all hover:shadow-sm ${b.color}`}
              >
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">{b.brand}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{b.patients} patients</p>
                </div>
                <span className="rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-xs font-semibold text-teal-700">Target</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Brand data pulled from EHR optical/dispensing history · <button className="text-teal-600 hover:underline font-medium" onClick={() => navigate('/app/patients')}>update via CSV upload</button></p>
        </CardContent>
      </Card>

      {/* Revenue engine */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  Revenue Engine
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Running
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">Prizm automatically sends personalized benefit reminders as patient allowances near expiration</CardDescription>
              </div>
            </div>
            <button onClick={() => navigate('/app/campaigns')} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
              All campaigns <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {pipelineStages.map((stage) => (
              <div key={stage.label} className={`rounded-xl border ${stage.border} ${stage.bg} p-4`}>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${stage.pill}`}>{stage.label}</span>
                <p className="text-2xl font-bold text-slate-900 mt-3">{stage.patients}</p>
                <p className="text-xs text-slate-500 mt-0.5">patients</p>
                <div className="mt-2 h-1 w-full rounded-full bg-white/60">
                  <div className={`h-full rounded-full ${stage.color}`} style={{ width: `${Math.min(100, (stage.patients / 200) * 100)}%` }} />
                </div>
                <p className={`mt-2 text-sm font-semibold ${stage.textColor}`}>{stage.value}</p>
                <p className="text-xs text-slate-400">{stage.description}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Send className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">This Week's Automatic Sends</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 divide-y divide-slate-100">
              {thisWeeksSends.map((send) => (
                <div key={send.name} className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                    {send.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-slate-800">{send.name}</p>
                      <span className="text-xs text-slate-400">{send.carrier}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {[send.frameAllowance !== '$0' && `${send.frameAllowance} frames`, send.contactAllowance !== '$0' && `${send.contactAllowance} contacts`].filter(Boolean).join(' · ')}
                      <span className="ml-1.5 text-slate-400">— {send.reason}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${send.channel === 'SMS' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'}`}>{send.channel}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${send.status === 'sending-today' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{send.sendDay}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400 text-right">89 patients queued for next week · <button onClick={() => navigate('/app/campaigns')} className="text-teal-600 hover:underline font-medium">view full queue</button></p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom row — campaigns + claims + verification */}
      <div className="grid gap-4 lg:grid-cols-3">

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">One-Time Campaigns</CardTitle>
            <CardDescription className="text-xs">For trunk shows, events, and custom outreach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {manualCampaigns.map((c) => (
              <button key={c.title} onClick={() => navigate('/app/campaigns', { state: { openModal: true, campaignType: c.type } })} className={`flex w-full items-center gap-3 rounded-xl border-2 bg-white p-3 text-left transition-all hover:shadow-sm ${c.border}`}>
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}>{c.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800">{c.title}</p>
                  <p className="text-xs text-slate-400 leading-snug">{c.description}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                  <FileCheck className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Claims Today</CardTitle>
                  <CardDescription className="text-xs">Submitted via Stedi clearinghouse</CardDescription>
                </div>
              </div>
              <button onClick={() => navigate('/app/claims')} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
                All claims <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {todaysClaims.map((c) => {
                const cfg = claimStatusConfig[c.status]
                return (
                  <div key={c.patient} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => navigate('/app/claims')}>
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {c.patient.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">{c.patient}</p>
                      <p className="text-xs text-slate-400">{c.carrier} · {c.service}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs font-bold text-slate-800">{c.amount}</span>
                      <span className={`rounded-full border px-1.5 py-0.5 text-xs font-medium ${cfg.className}`}>{cfg.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Verifications Today</CardTitle>
                  <CardDescription className="text-xs">38 checked · 31 active · 4 issues</CardDescription>
                </div>
              </div>
              <button onClick={() => navigate('/app/eligibility')} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {todayVerifs.map((v) => {
                const cfg = verifStatusConfig[v.status]
                return (
                  <div key={v.name} onClick={() => navigate('/app/eligibility')} className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 mt-0.5">
                      {v.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">{v.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {v.frameAllowance !== '$0' && <span className="text-xs font-medium text-teal-700">{v.frameAllowance} frames</span>}
                        {v.clAllowance !== '$0' && <span className="text-xs font-medium text-cyan-700">{v.clAllowance} contacts</span>}
                        {v.frameAllowance === '$0' && v.clAllowance === '$0' && <span className="text-xs text-slate-400">No benefits available</span>}
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium flex-shrink-0 ${cfg.className}`}>
                      {cfg.icon}{cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-100 px-4 py-3">
              <button onClick={() => navigate('/app/eligibility')} className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors">
                <ShieldCheck className="h-3 w-3" /> Run New Verification
              </button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
