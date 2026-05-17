import { Users, Megaphone, ShieldCheck, MessageSquare, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCard {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: string
}

const stats: StatCard[] = [
  {
    title: 'Total Patients',
    value: '2,847',
    description: 'Registered in your practice',
    icon: <Users className="h-5 w-5 text-blue-500" />,
    trend: '+12 this month',
  },
  {
    title: 'Active Campaigns',
    value: '4',
    description: 'Currently running outreach',
    icon: <Megaphone className="h-5 w-5 text-violet-500" />,
    trend: '1 ending soon',
  },
  {
    title: 'Verifications Today',
    value: '38',
    description: 'Eligibility checks processed',
    icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
    trend: '+6 vs yesterday',
  },
  {
    title: 'SMS Sent',
    value: '1,204',
    description: 'Messages delivered this month',
    icon: <MessageSquare className="h-5 w-5 text-amber-500" />,
    trend: '96.2% delivery rate',
  },
]

const recentActivity = [
  { id: 1, event: 'Eligibility verified', patient: 'Sarah M.', time: '2 min ago' },
  { id: 2, event: 'Campaign sent', patient: 'Recall — Q2 2026', time: '14 min ago' },
  { id: 3, event: 'New patient registered', patient: 'James T.', time: '1 hr ago' },
  { id: 4, event: 'Eligibility verified', patient: 'Linda K.', time: '2 hr ago' },
  { id: 5, event: 'SMS delivered', patient: 'Appointment Reminder', time: '3 hr ago' },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Good morning</h2>
        <p className="text-muted-foreground">Here's what's happening at your practice today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              {stat.trend && (
                <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  {stat.trend}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events across your practice</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {recentActivity.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{item.event}</p>
                  <p className="text-xs text-muted-foreground">{item.patient}</p>
                </div>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
