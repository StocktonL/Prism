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
  },
  {
    id: 2,
    priority: 'high',
    label: 'Trunk Show Ready',
    insight: '189 patients are benefit-eligible and haven\'t visited in 12+ months — perfect trunk show audience.',
    action: 'Launch trunk show campaign',
    reach: '189 patients',
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-700',
    badgeLabel: 'High Priority',
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
  },
]

const campaignTypes = [
  {
    title: 'Trunk Show',
    description: 'Drive foot traffic for a vendor frame event',
    color: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50',
    icon: '🛍️',
  },
  {
    title: 'End of Year',
    description: 'Remind patients their benefits expire Dec 31',
    color: 'border-rose-200 hover:border-rose-400 hover:bg-rose-50',
    icon: '📅',
  },
  {
    title: 'Mid-Year Reminder',
    description: 'Re-engage patients with benefits still available',
    color: 'border-teal-200 hover:border-teal-400 hover:bg-teal-50',
    icon: '📣',
  },
  {
    title: 'Custom Campaign',
    description: 'Build your own message and patient list',
    color: 'border-slate-200 hover:border-slate-400 hover:bg-slate-50',
    icon: '✏️',
  },
]

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
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
              <button className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors shadow-sm whitespace-nowrap">
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
              className={`flex flex-col items-start gap-2 rounded-xl border-2 bg-white p-4 text-left transition-all duration-150 shadow-sm ${c.color}`}
            >
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{c.title}</p>
                <p className="text-xs text-slate-500 leading-snug mt-0.5">{c.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-teal-600 mt-auto pt-1">
                Start <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
