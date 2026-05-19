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
  Users,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const stats = [
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
    sub: 'in frame + contact allowances (30 days)',
    icon: <CalendarClock className="h-5 w-5 text-rose-600" />,
    bg: 'bg-rose-50',
    trend: '312 patients at risk',
    trendUp: false,
  },
  {
    title: 'Active Campaigns',
    value: '4',
    sub: 'running across 594 patients',
    icon: <Megaphone className="h-5 w-5 text-violet-600" />,
    bg: 'bg-violet-50',
    trend: '1 ending this week',
    trendUp: false,
  },
  {
    title: 'SMS Delivered',
    value: '1,204',
    sub: 'messages this month',
    icon: <MessageSquare className="h-5 w-5 text-teal-600" />,
    bg: 'bg-teal-50',
    trend: '96.2% delivery rate',
    trendUp: true,
  },
]

const aiSuggestions = [
  {
    id: 1,
    label: 'End of Year — $48K Opportunity',
    insight: '312 patients have an average of $155 in unused frame and contact benefits expiring Dec 31. At a 20% response rate, that\'s $9,672 in recoverable optical revenue.',
    action: 'Launch end-of-year campaign',
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
    action: 'Launch trunk show campaign',
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
    insight: '94 patients hit the 6-month mark since their last visit and still have their full exam + materials benefits available. Low-cost touchpoint with high conversion.',
    action: 'Send mid-year reminder',
    reach: '94 patients · full benefits remaining',
    icon: <Bell className="h-5 w-5 text-teal-500" />,
    bg: 'bg-teal-50',
    badge: 'bg-teal-100 text-teal-700',
    badgeLabel: 'Medium Priority',
    nav: '/campaigns',
    navState: { openModal: true, campaignType: 'Mid-Year Reminder' },
  },
]

const campaignTypes = [
  {
    title: 'Trunk Show',
    type: 'Trunk Show',
    description: 'Drive foot traffic for a vendor frame event',
    borderColor: 'border-amber-200 hover:border-amber-400',
    iconBg: 'bg-amber-50',
    icon: <ShoppingBag className="h-5 w-5 text-amber-600" />,
  },
  {
    title: 'End of Year Benefits',
    type: 'End of Year Benefits',
    description: 'Remind patients their benefits expire Dec 31',
    borderColor: 'border-rose-200 hover:border-rose-400',
    iconBg: 'bg-rose-50',
    icon: <CalendarRange className="h-5 w-5 text-rose-600" />,
  },
  {
    title: 'Mid-Year Reminder',
    type: 'Mid-Year Reminder',
    description: 'Re-engage patients with benefits still available',
    borderColor: 'border-teal-200 hover:border-teal-400',
    iconBg: 'bg-teal-50',
    icon: <Bell className="h-5 w-5 text-teal-600" />,
  },
  {
    title: 'Custom Campaign',
    type: 'Custom Campaign',
    description: 'Build your own message and patient list',
    borderColor: 'border-slate-200 hover:border-slate-400',
    iconBg: 'bg-slate-100',
    icon: <PenLine className="h-5 w-5 text-slate-600" />,
  },
]

const recentActivity = [
  { id: 1, event: 'Campaign delivered', detail: 'End of Year Benefits · 298 SMS sent', time: '2 min ago', dot: 'bg-violet-500' },
  { id: 2, event: 'Eligibility verified', detail: 'Sarah Mitchell · VSP · $150 frame benefit', time: '14 min ago', dot: 'bg-teal-500' },
  { id: 3, event: 'Patient responded', detail: '"Thanks! Booking my appt now" — Linda K.', time: '1 hr ago', dot: 'bg-emerald-500' },
  { id: 4, event: 'Eligibility verified', detail: 'Robert Chen · UHC Vision · $200 frame benefit', time: '2 hr ago', dot: 'bg-teal-500' },
  { id: 5, event: 'Campaign delivered', detail: 'Trunk Show — Spring Frames · 185 SMS sent', time: '3 hr ago', dot: 'bg-violet-500' },
]

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{greeting()}</h2>
          <p className="mt-1 text-sm text-slate-500">Here's your optical revenue picture for today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200 shadow-sm">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
              <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-slate-400'}`}>
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
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
              <p className="text-sm font-semibold text-rose-900">
                $48,360 in patient benefits expiring within 30 days
              </p>
              <p className="text-xs text-rose-700">
                312 patients have unused frame and contact allowances. Send now to recover optical revenue before it lapses.
              </p>
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

      {/* AI Suggestions */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base">AI Revenue Suggestions</CardTitle>
              <CardDescription className="text-xs">
                Based on verified benefit data — each patient receives their exact dollar amount
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiSuggestions.map((s) => (
            <div
              key={s.id}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-white hover:border-slate-200 hover:shadow-sm cursor-pointer"
              onClick={() => navigate(s.nav, { state: s.navState })}
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                {s.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
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

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-2">

        {/* Campaign quick launch */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Launch a Campaign</CardTitle>
            <CardDescription className="text-xs">Each message includes the patient's verified benefit amount</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {campaignTypes.map((c) => (
              <button
                key={c.title}
                onClick={() => navigate('/campaigns', { state: { openModal: true, campaignType: c.type } })}
                className={`flex flex-col items-start gap-2 rounded-xl border-2 bg-white p-3 text-left transition-all duration-150 shadow-sm hover:shadow-md ${c.borderColor}`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.iconBg}`}>
                  {c.icon}
                </div>
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

        {/* Recent activity */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription className="text-xs">Latest events across your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-0">
              {recentActivity.map((item, i) => (
                <li
                  key={item.id}
                  className={`flex items-center gap-3 py-3 ${i < recentActivity.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <span className={`h-2 w-2 flex-shrink-0 rounded-full ${item.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-700">{item.event}</p>
                    <p className="truncate text-xs text-slate-400">{item.detail}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
