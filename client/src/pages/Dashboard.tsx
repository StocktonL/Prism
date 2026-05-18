import { useNavigate } from 'react-router-dom'
import {
  Users,
  Megaphone,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CalendarClock,
  TrendingUp,
  ChevronRight,
  Zap,
  ShoppingBag,
  CalendarRange,
  Bell,
  PenLine,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const stats = [
  { title: 'Total Patients', value: '2,847', icon: <Users className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
  { title: 'Active Campaigns', value: '4', icon: <Megaphone className="h-5 w-5 text-violet-600" />, bg: 'bg-violet-50' },
  { title: 'Verifications Today', value: '38', icon: <ShieldCheck className="h-5 w-5 text-teal-600" />, bg: 'bg-teal-50' },
  { title: 'SMS Sent This Month', value: '1,204', icon: <MessageSquare className="h-5 w-5 text-amber-600" />, bg: 'bg-amber-50' },
]

const aiSuggestions = [
  {
    id: 1,
    priority: 'high',
    label: 'End of Year Opportunity',
    insight: '312 patients have unused frame benefits expiring Dec 31.',
    action: 'Send end-of-year reminder',
    reach: '312 patients',
    icon: <CalendarClock className="h-5 w-5 text-rose-500" />,
    bg: 'bg-rose-50',
    badge: 'bg-rose-100 text-rose-700',
    badgeLabel: 'High Priority',
    nav: '/campaigns',
    navState: { openModal: true, campaignType: 'End of Year Benefits' },
  },
  {
    id: 2,
    priority: 'high',
    label: 'Trunk Show Ready',
    insight: "189 patients are benefit-eligible and haven't visited in 12+ months — perfect trunk show audience.",
    action: 'Launch trunk show campaign',
    reach: '189 patients',
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    badgeLabel: 'High Priority',
    nav: '/campaigns',
    navState: { openModal: true, campaignType: 'Trunk Show' },
  },
  {
    id: 3,
    priority: 'medium',
    label: 'Mid-Year Check-In',
    insight: '94 patients hit the 6-month mark since their last visit and still have full benefits remaining.',
    action: 'Send mid-year reminder',
    reach: '94 patients',
    icon: <TrendingUp className="h-5 w-5 text-teal-500" />,
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
    type: 'Trunk Show' as const,
    description: 'Drive foot traffic for a vendor frame event',
    borderColor: 'border-amber-200 hover:border-amber-400',
    iconBg: 'bg-amber-50',
    icon: <ShoppingBag className="h-5 w-5 text-amber-600" />,
  },
  {
    title: 'End of Year Benefits',
    type: 'End of Year Benefits' as const,
    description: 'Remind patients their benefits expire Dec 31',
    borderColor: 'border-rose-200 hover:border-rose-400',
    iconBg: 'bg-rose-50',
    icon: <CalendarRange className="h-5 w-5 text-rose-600" />,
  },
  {
    title: 'Mid-Year Reminder',
    type: 'Mid-Year Reminder' as const,
    description: 'Re-engage patients with benefits still available',
    borderColor: 'border-teal-200 hover:border-teal-400',
    iconBg: 'bg-teal-50',
    icon: <Bell className="h-5 w-5 text-teal-600" />,
  },
  {
    title: 'Custom Campaign',
    type: 'Custom Campaign' as const,
    description: 'Build your own message and patient list',
    borderColor: 'border-slate-200 hover:border-slate-400',
    iconBg: 'bg-slate-100',
    icon: <PenLine className="h-5 w-5 text-slate-600" />,
  },
]

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const navigate = useNavigate()

  function launchCampaign(type: string) {
    navigate('/campaigns', { state: { openModal: true, campaignType: type } })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{greeting()}</h2>
          <p className="mt-1 text-sm text-slate-500">Here's what Prism recommends for your practice today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 pt-5">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits expiring card */}
      <Card className="border-amber-200 bg-amber-50/50 shadow-sm">
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-100">
              <CalendarClock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">312 patients have benefits expiring by Dec 31</p>
              <p className="text-xs text-amber-700">Run eligibility verification to confirm current coverage and unused allowances.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/eligibility')}
            className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors shadow-sm whitespace-nowrap"
          >
            Set up eligibility <ChevronRight className="h-3 w-3" />
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
              <CardTitle className="text-base">AI Suggestions</CardTitle>
              <CardDescription className="text-xs">Based on your verification history and patient benefit data</CardDescription>
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
                <p className="mt-2 text-xs font-medium text-slate-400">Reach: {s.reach}</p>
              </div>
              <button
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap"
                onClick={(e) => { e.stopPropagation(); navigate(s.nav, { state: s.navState }) }}
              >
                {s.action} <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Campaign Quick Launch */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Launch a Campaign</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {campaignTypes.map((c) => (
            <button
              key={c.title}
              onClick={() => launchCampaign(c.type)}
              className={`flex flex-col items-start gap-3 rounded-xl border-2 bg-white p-4 text-left transition-all duration-150 shadow-sm hover:shadow-md ${c.borderColor}`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.iconBg}`}>
                {c.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{c.title}</p>
                <p className="text-xs text-slate-500 leading-snug mt-0.5">{c.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-teal-600 mt-auto">
                Start campaign <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
