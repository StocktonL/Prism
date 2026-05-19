import { useNavigate } from 'react-router-dom'
import {
  DollarSign,
  Megaphone,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CalendarClock,
  TrendingUp,
  ChevronRight,
  ShoppingBag,
  CalendarRange,
  Bell,
  PenLine,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

// ─── Stats ───────────────────────────────────────────────────────────────────

const stats = [
  {
    title: 'Verifications Today',
    value: '38',
    sub: '31 active · 4 issues · 3 pending',
    icon: <ShieldCheck className="h-5 w-5 text-teal-600" />,
    bg: 'bg-teal-50',
    trend: '+6 vs yesterday',
    trendUp: true,
  },
  {
    title: 'Revenue Recovered',
    value: '$24,180',
    sub: 'optical revenue this month',
    icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
    bg: 'bg-emerald-50',
    trend: '+18% vs last month',
    trendUp: true,
  },
  {
    title: 'Benefits Expiring',
    value: '$48,360',
    sub: 'frame + contact allowances (30 days)',
    icon: <CalendarClock className="h-5 w-5 text-rose-600" />,
    bg: 'bg-rose-50',
    trend: '312 patients at risk',
    trendUp: false,
  },
  {
    title: 'SMS Delivered',
    value: '1,204',
    sub: 'campaign messages this month',
    icon: <MessageSquare className="h-5 w-5 text-violet-600" />,
    bg: 'bg-violet-50',
    trend: '96.2% delivery rate',
    trendUp: true,
  },
]

// ─── Today's verification queue ──────────────────────────────────────────────

type VerifStatus = 'active' | 'inactive' | 'pending' | 'needs-auth'

interface VerifRow {
  name: string
  carrier: string
  memberId: string
  copay: string
  covered: string
  status: VerifStatus
  flag?: string
}

const todayVerifs: VerifRow[] = [
  {
    name: 'Sarah Mitchell',
    carrier: 'VSP',
    memberId: 'VSP00192837',
    copay: '$10 exam · $25 materials',
    covered: 'Routine vision — exam + materials',
    status: 'active',
  },
  {
    name: 'James Thornton',
    carrier: 'EyeMed',
    memberId: 'EM88234001',
    copay: '$0 exam · $0 materials',
    covered: 'Routine vision — benefits used Jan 2026',
    status: 'inactive',
    flag: 'Benefits used — next eligible Jan 2027',
  },
  {
    name: 'Thomas Garrett',
    carrier: 'Anthem',
    memberId: 'ANT66781204',
    copay: '$20 exam · $20 materials',
    covered: 'Routine vision + medical exam',
    status: 'needs-auth',
    flag: 'Prior authorization required before dispensing',
  },
  {
    name: 'Diana Patel',
    carrier: 'VSP',
    memberId: 'VSP00834291',
    copay: '$10 exam · $25 materials',
    covered: 'Routine vision — $60 frame balance remaining',
    status: 'active',
    flag: 'Subscriber: Raj Patel (parent)',
  },
  {
    name: 'Marcus Rivera',
    carrier: 'Spectera',
    memberId: 'SP77123456',
    copay: '$20 exam · $20 materials',
    covered: 'Routine vision — full benefits available',
    status: 'pending',
    flag: 'Last verified Nov 2025 — re-verify recommended',
  },
]

const verifStatusConfig: Record<VerifStatus, { label: string; icon: React.ReactNode; className: string }> = {
  active:     { label: 'Active',      icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactive:   { label: 'Inactive',    icon: <XCircle      className="h-3.5 w-3.5" />, className: 'bg-red-50 text-red-700 border-red-200'             },
  pending:    { label: 'Pending',     icon: <Clock        className="h-3.5 w-3.5" />, className: 'bg-amber-50 text-amber-700 border-amber-200'        },
  'needs-auth': { label: 'Auth Reqd', icon: <AlertTriangle className="h-3.5 w-3.5" />, className: 'bg-rose-50 text-rose-700 border-rose-200'          },
}

// ─── AI suggestions ───────────────────────────────────────────────────────────

const aiSuggestions = [
  {
    id: 1,
    label: 'End of Year — $48K Opportunity',
    insight: '312 patients have an average of $155 in unused frame and contact benefits expiring Dec 31. At a 20% response rate, that\'s ~$9,672 in recoverable optical revenue.',
    action: 'Launch campaign',
    reach: '312 patients · est. $9,672 recovered',
    icon: <CalendarClock className="h-5 w-5 text-rose-500" />,
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    badgeLabel: 'High Priority',
    nav: '/campaigns',
    navState: { openModal: true, campaignType: 'End of Year Benefits' },
  },
  {
    id: 2,
    label: 'Trunk Show — 189 Eligible Patients',
    insight: '189 patients are benefit-eligible, haven\'t visited in 12+ months, and have an average of $142 in unused frame benefits. Perfect trunk show audience.',
    action: 'Launch campaign',
    reach: '189 patients · avg $142 frame benefit',
    icon: <ShoppingBag className="h-5 w-5 text-amber-500" />,
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    badgeLabel: 'High Priority',
    nav: '/campaigns',
    navState: { openModal: true, campaignType: 'Trunk Show' },
  },
  {
    id: 3,
    label: 'Mid-Year — 94 Patients Untouched',
    insight: '94 patients are 6+ months since their last visit with full exam and materials benefits still available.',
    action: 'Launch campaign',
    reach: '94 patients · full benefits remaining',
    icon: <Bell className="h-5 w-5 text-teal-500" />,
    bg: 'bg-teal-50',
    badge: 'bg-teal-100 text-teal-700',
    badgeLabel: 'Medium Priority',
    nav: '/campaigns',
    navState: { openModal: true, campaignType: 'Mid-Year Reminder' },
  },
]

// ─── Campaign types ───────────────────────────────────────────────────────────

const campaignTypes = [
  { title: 'Trunk Show',          type: 'Trunk Show',          description: 'Drive foot traffic for a vendor frame event',    borderColor: 'border-amber-200 hover:border-amber-400', iconBg: 'bg-amber-50',  icon: <ShoppingBag className="h-4 w-4 text-amber-600" /> },
  { title: 'End of Year Benefits', type: 'End of Year Benefits', description: 'Remind patients their benefits expire Dec 31', borderColor: 'border-rose-200 hover:border-rose-400',   iconBg: 'bg-rose-50',   icon: <CalendarRange className="h-4 w-4 text-rose-600" /> },
  { title: 'Mid-Year Reminder',   type: 'Mid-Year Reminder',   description: 'Re-engage patients with benefits still available', borderColor: 'border-teal-200 hover:border-teal-400', iconBg: 'bg-teal-50',   icon: <Bell className="h-4 w-4 text-teal-600" /> },
  { title: 'Custom Campaign',     type: 'Custom Campaign',     description: 'Build your own message and patient list',        borderColor: 'border-slate-200 hover:border-slate-400', iconBg: 'bg-slate-100', icon: <PenLine className="h-4 w-4 text-slate-600" /> },
]

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{greeting()}</h2>
        <p className="mt-1 text-sm text-slate-500">Today's verification activity and revenue opportunities.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title} className="border-slate-200 shadow-sm">
            <CardContent className="pt-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} mb-3`}>
                {s.icon}
              </div>
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
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100">
              <AlertCircle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-900">$48,360 in patient benefits expiring within 30 days</p>
              <p className="text-xs text-rose-700">312 patients have unused frame and contact allowances. Send now to recover optical revenue before it lapses.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/campaigns', { state: { openModal: true, campaignType: 'End of Year Benefits' } })}
            className="ml-4 flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm whitespace-nowrap"
          >
            Launch campaign <ChevronRight className="h-3 w-3" />
          </button>
        </CardContent>
      </Card>

      {/* Today's Verification Activity */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-base">Today's Verification Activity</CardTitle>
                <CardDescription className="text-xs">Eligibility, copays, coverage, and flags for each patient</CardDescription>
              </div>
            </div>
            <button
              onClick={() => navigate('/eligibility')}
              className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {todayVerifs.map((v) => {
              const cfg = verifStatusConfig[v.status]
              return (
                <div
                  key={v.name}
                  onClick={() => navigate('/eligibility')}
                  className="flex items-start gap-4 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 mt-0.5">
                    {v.name.split(' ').map((n) => n[0]).join('')}
                  </div>

                  {/* Main info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800">{v.name}</p>
                      <span className="text-xs text-slate-400">{v.carrier} · {v.memberId}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{v.covered}</p>
                    <p className="text-xs font-medium text-slate-600 mt-0.5">{v.copay}</p>
                    {v.flag && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {v.status === 'needs-auth'
                          ? <AlertTriangle className="h-3 w-3 text-rose-500 flex-shrink-0" />
                          : v.status === 'pending'
                            ? <AlertCircle className="h-3 w-3 text-amber-500 flex-shrink-0" />
                            : <Info className="h-3 w-3 text-blue-400 flex-shrink-0" />
                        }
                        <p className={`text-xs font-medium ${
                          v.status === 'needs-auth' ? 'text-rose-600' :
                          v.status === 'pending' ? 'text-amber-600' : 'text-blue-600'
                        }`}>{v.flag}</p>
                      </div>
                    )}
                  </div>

                  {/* Status badge */}
                  <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium flex-shrink-0 ${cfg.className}`}>
                    {cfg.icon}{cfg.label}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-5 py-3">
            <button
              onClick={() => navigate('/eligibility')}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Run a New Verification
            </button>
          </div>
        </CardContent>
      </Card>

      {/* AI Revenue Suggestions */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">AI Revenue Suggestions</CardTitle>
              <CardDescription className="text-xs">Based on verified benefit data — each patient receives their exact dollar amount</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiSuggestions.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(s.nav, { state: s.navState })}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-white hover:border-slate-200 hover:shadow-sm cursor-pointer"
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                {s.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-slate-800">{s.label}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.badge}`}>{s.badgeLabel}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{s.insight}</p>
                <p className="mt-1.5 text-xs font-medium text-teal-600">{s.reach}</p>
              </div>
              <button className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap">
                {s.action} <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bottom row — campaigns + quick verify */}
      <div className="grid gap-4 lg:grid-cols-2">

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Launch a Campaign</CardTitle>
            <CardDescription className="text-xs">Allowances from verification are included in every message automatically</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {campaignTypes.map((c) => (
              <button
                key={c.title}
                onClick={() => navigate('/campaigns', { state: { openModal: true, campaignType: c.type } })}
                className={`flex flex-col items-start gap-2 rounded-xl border-2 bg-white p-3 text-left transition-all shadow-sm hover:shadow-md ${c.borderColor}`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.iconBg}`}>{c.icon}</div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{c.title}</p>
                  <p className="text-xs text-slate-400 leading-snug mt-0.5">{c.description}</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-teal-600 mt-auto">
                  Start <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Verification breakdown */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Verification Breakdown</CardTitle>
            <CardDescription className="text-xs">Today's eligibility check results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Active — benefits available',         value: 31, total: 38, color: 'bg-emerald-500', text: 'text-emerald-700' },
              { label: 'Inactive — benefits used or expired', value: 4,  total: 38, color: 'bg-red-400',     text: 'text-red-700'     },
              { label: 'Pending — awaiting response',         value: 2,  total: 38, color: 'bg-amber-400',   text: 'text-amber-700'   },
              { label: 'Prior auth required',                 value: 1,  total: 38, color: 'bg-rose-500',    text: 'text-rose-700'    },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">{row.label}</span>
                  <span className={`font-semibold ${row.text}`}>{row.value}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.color}`}
                    style={{ width: `${Math.round((row.value / row.total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => navigate('/eligibility')}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Open Full Eligibility View
            </button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
