import { Users, Megaphone, ShieldCheck, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCard {
  title: string
  value: string
  trend: string
  trendUp: boolean
  icon: React.ReactNode
  iconBg: string
}

const stats: StatCard[] = [
  {
    title: 'Total Patients',
    value: '2,847',
    trend: '+12 this month',
    trendUp: true,
    icon: <Users className="h-5 w-5 text-blue-600" />,
    iconBg: 'bg-blue-50',
  },
  {
    title: 'Active Campaigns',
    value: '4',
    trend: '1 ending soon',
    trendUp: false,
    icon: <Megaphone className="h-5 w-5 text-violet-600" />,
    iconBg: 'bg-violet-50',
  },
  {
    title: 'Verifications Today',
    value: '38',
    trend: '+6 vs yesterday',
    trendUp: true,
    icon: <ShieldCheck className="h-5 w-5 text-teal-600" />,
    iconBg: 'bg-teal-50',
  },
  {
    title: 'SMS Sent',
    value: '1,204',
    trend: '96.2% delivery rate',
    trendUp: true,
    icon: <MessageSquare className="h-5 w-5 text-amber-600" />,
    iconBg: 'bg-amber-50',
  },
]

const recentActivity = [
  { id: 1, event: 'Eligibility verified', detail: 'Sarah M.', time: '2 min ago', dot: 'bg-teal-500' },
  { id: 2, event: 'Campaign sent', detail: 'Recall — Q2 2026', time: '14 min ago', dot: 'bg-violet-500' },
  { id: 3, event: 'New patient added', detail: 'James T.', time: '1 hr ago', dot: 'bg-blue-500' },
  { id: 4, event: 'Eligibility verified', detail: 'Linda K.', time: '2 hr ago', dot: 'bg-teal-500' },
  { id: 5, event: 'SMS delivered', detail: 'End-of-year benefits reminder', time: '3 hr ago', dot: 'bg-amber-500' },
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
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">{greeting()}</h2>
        <p className="mt-1 text-sm text-slate-500">Here's what's happening at your practice today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-teal-600' : 'text-amber-600'}`}>
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Latest events across your practice</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-0">
              {recentActivity.map((item, i) => (
                <li key={item.id} className={`flex items-center gap-3 py-3 ${i < recentActivity.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <span className={`h-2 w-2 flex-shrink-0 rounded-full ${item.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{item.event}</p>
                    <p className="truncate text-xs text-slate-500">{item.detail}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-slate-400">{item.time}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Benefits expiring soon */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Benefits Expiring Soon</CardTitle>
            <CardDescription>Patients with benefits ending in 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50">
                <ShieldCheck className="h-6 w-6 text-teal-500" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-700">Connect your insurance verification</p>
              <p className="mt-1 text-xs text-slate-400">Once set up, we'll automatically track expiring benefits and help you reach patients before they lapse.</p>
              <button className="mt-4 flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors">
                Set up eligibility <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
