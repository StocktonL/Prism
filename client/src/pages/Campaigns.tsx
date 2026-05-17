import { Megaphone, Plus, Send } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Campaign {
  id: number
  name: string
  type: 'recall' | 'promotion' | 'appointment'
  status: 'active' | 'scheduled' | 'completed' | 'draft'
  audience: number
  sent: number
  openRate: string
  scheduledDate: string
}

const CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: 'Q2 Annual Recall',
    type: 'recall',
    status: 'active',
    audience: 432,
    sent: 388,
    openRate: '61%',
    scheduledDate: '2026-04-15',
  },
  {
    id: 2,
    name: 'Spring Frame Promotion',
    type: 'promotion',
    status: 'completed',
    audience: 1204,
    sent: 1201,
    openRate: '44%',
    scheduledDate: '2026-03-01',
  },
  {
    id: 3,
    name: 'Appointment Reminder — May',
    type: 'appointment',
    status: 'scheduled',
    audience: 85,
    sent: 0,
    openRate: '—',
    scheduledDate: '2026-05-20',
  },
  {
    id: 4,
    name: 'Contact Lens Renewal',
    type: 'recall',
    status: 'draft',
    audience: 210,
    sent: 0,
    openRate: '—',
    scheduledDate: '—',
  },
]

const statusVariant: Record<
  Campaign['status'],
  'success' | 'secondary' | 'destructive' | 'outline'
> = {
  active: 'success',
  scheduled: 'secondary',
  completed: 'outline',
  draft: 'secondary',
}

const typeLabel: Record<Campaign['type'], string> = {
  recall: 'Recall',
  promotion: 'Promotion',
  appointment: 'Appointment',
}

export default function Campaigns() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaigns</h2>
          <p className="text-muted-foreground">
            Create and manage SMS outreach campaigns for your patients.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {CAMPAIGNS.filter((c) => c.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sent (All Time)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {CAMPAIGNS.reduce((sum, c) => sum + c.sent, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {CAMPAIGNS.filter((c) => c.status === 'scheduled').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign list */}
      <div className="space-y-3">
        {CAMPAIGNS.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Megaphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {typeLabel[campaign.type]} &middot; {campaign.scheduledDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="hidden text-center sm:block">
                  <p className="font-medium text-foreground">{campaign.audience.toLocaleString()}</p>
                  <p>Audience</p>
                </div>
                <div className="hidden text-center sm:block">
                  <p className="font-medium text-foreground">{campaign.sent.toLocaleString()}</p>
                  <p>Sent</p>
                </div>
                <div className="hidden text-center sm:block">
                  <p className="font-medium text-foreground">{campaign.openRate}</p>
                  <p>Open rate</p>
                </div>
                <Badge variant={statusVariant[campaign.status]} className="capitalize">
                  {campaign.status}
                </Badge>
                {campaign.status === 'draft' && (
                  <Button size="sm" variant="outline">
                    <Send className="mr-1 h-3 w-3" />
                    Send
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state placeholder shown when no campaigns */}
      {CAMPAIGNS.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No campaigns yet</CardTitle>
            <CardDescription>
              Create your first SMS campaign to start reaching patients.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
