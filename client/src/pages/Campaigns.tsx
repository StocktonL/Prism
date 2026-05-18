import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Megaphone,
  Plus,
  X,
  ChevronRight,
  ShoppingBag,
  CalendarRange,
  Bell,
  PenLine,
  MessageSquare,
  CheckCircle2,
  Clock,
  Users,
  Send,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PATIENTS, getPatientFullName } from '@/data/mockPatients'

type CampaignType = 'Trunk Show' | 'End of Year Benefits' | 'Mid-Year Reminder' | 'Custom Campaign'
type CampaignStatus = 'Active' | 'Scheduled' | 'Completed' | 'Draft'
type ScheduleMode = 'now' | 'scheduled'
type CriteriaKey = 'unused_benefits' | 'expiring_30' | 'expiring_60' | 'expiring_90' | 'last_visit_6' | 'last_visit_12' | 'last_visit_18' | 'last_visit_24' | 'carrier_vsp' | 'carrier_eyemed' | 'carrier_davis' | 'carrier_spectera' | 'all'

interface Campaign {
  id: number
  name: string
  type: CampaignType
  status: CampaignStatus
  message: string
  patientsReached: number
  smsDelivered: number
  smsFailed: number
  smsReplied: number
  date: string
  patients: string[]
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: 'End of Year Benefits Reminder',
    type: 'End of Year Benefits',
    status: 'Active',
    message: 'Hi [Name], your vision benefits expire Dec 31. You have $150 in unused frame allowance. Call us at (555) 800-2020 to schedule before your benefits run out!',
    patientsReached: 312,
    smsDelivered: 298,
    smsFailed: 14,
    smsReplied: 42,
    date: '2026-05-01',
    patients: ['Sarah Mitchell', 'Linda Kowalski', 'Marcus Rivera', 'Thomas Garrett'],
  },
  {
    id: 2,
    name: 'Trunk Show — Spring Frames',
    type: 'Trunk Show',
    status: 'Completed',
    message: 'Hi [Name], join us this Saturday for our exclusive spring trunk show! Try on hundreds of new frames and use your vision benefits. RSVP: (555) 800-2020.',
    patientsReached: 189,
    smsDelivered: 185,
    smsFailed: 4,
    smsReplied: 31,
    date: '2026-03-15',
    patients: ['James Thornton', 'Diana Patel', 'Robert Chen', 'Priya Nair'],
  },
  {
    id: 3,
    name: 'Mid-Year Check-In',
    type: 'Mid-Year Reminder',
    status: 'Scheduled',
    message: "Hi [Name], it's been 6 months since your last visit and you still have full benefits remaining. Schedule your eye exam today — call (555) 800-2020.",
    patientsReached: 94,
    smsDelivered: 0,
    smsFailed: 0,
    smsReplied: 0,
    date: '2026-06-01',
    patients: ['Amara Osei', 'David Okafor', 'Marcus Rivera'],
  },
  {
    id: 4,
    name: 'Back to School Vision',
    type: 'Custom Campaign',
    status: 'Draft',
    message: 'Hi [Name], back to school is around the corner! Make sure your child has a current eye exam. Book now and use your insurance benefits. Call (555) 800-2020.',
    patientsReached: 0,
    smsDelivered: 0,
    smsFailed: 0,
    smsReplied: 0,
    date: '—',
    patients: [],
  },
]

const CAMPAIGN_TYPES: { type: CampaignType; description: string; icon: React.ReactNode; iconBg: string; borderColor: string; defaultMessage: string }[] = [
  {
    type: 'Trunk Show',
    description: 'Drive foot traffic for a vendor frame event',
    icon: <ShoppingBag className="h-5 w-5 text-amber-600" />,
    iconBg: 'bg-amber-50',
    borderColor: 'border-amber-300',
    defaultMessage: 'Hi [Name], join us this Saturday for our exclusive trunk show! Try on hundreds of new frames and use your vision benefits. RSVP: (555) 800-2020.',
  },
  {
    type: 'End of Year Benefits',
    description: 'Remind patients their benefits expire Dec 31',
    icon: <CalendarRange className="h-5 w-5 text-rose-600" />,
    iconBg: 'bg-rose-50',
    borderColor: 'border-rose-300',
    defaultMessage: 'Hi [Name], your vision benefits expire Dec 31. You have unused allowance remaining. Call us at (555) 800-2020 to schedule before your benefits run out!',
  },
  {
    type: 'Mid-Year Reminder',
    description: 'Re-engage patients with benefits still available',
    icon: <Bell className="h-5 w-5 text-teal-600" />,
    iconBg: 'bg-teal-50',
    borderColor: 'border-teal-300',
    defaultMessage: "Hi [Name], it's been a while since your last visit and you still have vision benefits available. Schedule your eye exam today — call (555) 800-2020.",
  },
  {
    type: 'Custom Campaign',
    description: 'Build your own message and patient list',
    icon: <PenLine className="h-5 w-5 text-slate-600" />,
    iconBg: 'bg-slate-100',
    borderColor: 'border-slate-300',
    defaultMessage: '',
  },
]

const CRITERIA_OPTIONS: { key: CriteriaKey; label: string; reach: number }[] = [
  { key: 'all', label: 'All patients', reach: PATIENTS.length },
  { key: 'unused_benefits', label: 'Has unused benefits', reach: 7 },
  { key: 'expiring_30', label: 'Benefits expiring within 30 days', reach: 312 },
  { key: 'expiring_60', label: 'Benefits expiring within 60 days', reach: 489 },
  { key: 'expiring_90', label: 'Benefits expiring within 90 days', reach: 671 },
  { key: 'last_visit_6', label: 'Last visit more than 6 months ago', reach: 94 },
  { key: 'last_visit_12', label: 'Last visit more than 12 months ago', reach: 189 },
  { key: 'last_visit_18', label: 'Last visit more than 18 months ago', reach: 243 },
  { key: 'last_visit_24', label: 'Last visit more than 24 months ago', reach: 301 },
  { key: 'carrier_vsp', label: 'VSP patients only', reach: PATIENTS.filter((p) => p.primaryInsurance.carrier === 'VSP').length },
  { key: 'carrier_eyemed', label: 'EyeMed patients only', reach: PATIENTS.filter((p) => p.primaryInsurance.carrier === 'EyeMed').length },
  { key: 'carrier_davis', label: 'Davis Vision patients only', reach: PATIENTS.filter((p) => p.primaryInsurance.carrier === 'Davis Vision').length },
  { key: 'carrier_spectera', label: 'Spectera patients only', reach: PATIENTS.filter((p) => p.primaryInsurance.carrier === 'Spectera').length },
]

function statusBadge(status: CampaignStatus) {
  const map: Record<CampaignStatus, string> = {
    Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Scheduled: 'border-blue-200 bg-blue-50 text-blue-700',
    Completed: 'border-slate-200 bg-slate-50 text-slate-600',
    Draft: 'border-amber-200 bg-amber-50 text-amber-700',
  }
  const icons: Record<CampaignStatus, React.ReactNode> = {
    Active: <CheckCircle2 className="h-3 w-3" />,
    Scheduled: <Clock className="h-3 w-3" />,
    Completed: <CheckCircle2 className="h-3 w-3" />,
    Draft: <PenLine className="h-3 w-3" />,
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[status]}`}>
      {icons[status]} {status}
    </span>
  )
}

function typeBadge(type: CampaignType) {
  const map: Record<CampaignType, string> = {
    'Trunk Show': 'text-amber-700 bg-amber-50',
    'End of Year Benefits': 'text-rose-700 bg-rose-50',
    'Mid-Year Reminder': 'text-teal-700 bg-teal-50',
    'Custom Campaign': 'text-slate-600 bg-slate-100',
  }
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${map[type]}`}>{type}</span>
  )
}

// ---- New Campaign Modal ----
interface NewCampaignModalProps {
  onClose: () => void
  onLaunch: (c: Campaign) => void
  preselectedType?: CampaignType
}

function NewCampaignModal({ onClose, onLaunch, preselectedType }: NewCampaignModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(preselectedType ? 2 : 1)
  const [selectedType, setSelectedType] = useState<CampaignType | null>(preselectedType ?? null)
  const [name, setName] = useState(preselectedType ? `${preselectedType} — ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : '')
  const [message, setMessage] = useState(CAMPAIGN_TYPES.find((t) => t.type === preselectedType)?.defaultMessage ?? '')
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [criteria, setCriteria] = useState<CriteriaKey>('unused_benefits')
  const MAX_CHARS = 160

  const estimatedReach = CRITERIA_OPTIONS.find((c) => c.key === criteria)?.reach ?? 0

  function handleTypeSelect(t: CampaignType) {
    setSelectedType(t)
    const typeConfig = CAMPAIGN_TYPES.find((tc) => tc.type === t)
    setName(`${t} — ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`)
    setMessage(typeConfig?.defaultMessage ?? '')
    setStep(2)
  }

  function handleLaunch() {
    const patientNames = PATIENTS.slice(0, Math.min(estimatedReach, PATIENTS.length)).map(getPatientFullName)
    const newCampaign: Campaign = {
      id: Date.now(),
      name,
      type: selectedType!,
      status: scheduleMode === 'now' ? 'Active' : 'Scheduled',
      message,
      patientsReached: estimatedReach,
      smsDelivered: scheduleMode === 'now' ? Math.floor(estimatedReach * 0.95) : 0,
      smsFailed: scheduleMode === 'now' ? Math.ceil(estimatedReach * 0.05) : 0,
      smsReplied: scheduleMode === 'now' ? Math.floor(estimatedReach * 0.12) : 0,
      date: scheduleMode === 'now' ? new Date().toISOString().split('T')[0] : (scheduleDate || new Date().toISOString().split('T')[0]),
      patients: patientNames,
    }
    onLaunch(newCampaign)
    onClose()
  }

  const stepLabels = ['Choose Type', 'Campaign Details', 'Patient Criteria']

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900">New Campaign</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {stepLabels.map((label, i) => {
              const n = (i + 1) as 1 | 2 | 3
              const active = step === n
              const done = step > n
              return (
                <div key={label} className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${active ? 'bg-teal-600 text-white' : done ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                    {n}
                  </div>
                  <span className={`text-xs font-medium ${active ? 'text-teal-700' : done ? 'text-teal-600' : 'text-slate-400'}`}>{label}</span>
                  {i < 2 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="p-6">
            <p className="mb-4 text-sm text-slate-500">Choose a campaign type to get started</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {CAMPAIGN_TYPES.map((t) => (
                <button
                  key={t.type}
                  onClick={() => handleTypeSelect(t.type)}
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all hover:shadow-md ${t.borderColor} bg-white`}
                >
                  <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${t.iconBg}`}>
                    {t.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.type}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{t.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <div className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Campaign Name</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">Message</label>
                  <span className={`text-xs font-medium ${message.length > MAX_CHARS ? 'text-red-500' : 'text-slate-400'}`}>{message.length}/{MAX_CHARS}</span>
                </div>
                <textarea
                  className="input-field min-h-[100px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your SMS message..."
                />
                <p className="mt-1 text-xs text-slate-400">Use [Name] to personalize. Messages over 160 characters count as 2 SMS.</p>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">Schedule</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setScheduleMode('now')}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${scheduleMode === 'now' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Send Now
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode('scheduled')}
                    className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${scheduleMode === 'scheduled' ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    Schedule for Date
                  </button>
                </div>
                {scheduleMode === 'scheduled' && (
                  <input type="date" className="input-field mt-2" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button onClick={() => setStep(1)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!name || !message}
                className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Patient Criteria
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <div className="px-6 py-5">
              <p className="mb-4 text-sm text-slate-500">Choose which patients to include in this campaign</p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {CRITERIA_OPTIONS.map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${criteria === opt.key ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${criteria === opt.key ? 'border-teal-600 bg-teal-600' : 'border-slate-300'}`} />
                      <span className="text-sm text-slate-700">{opt.label}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{opt.reach.toLocaleString()} patients</span>
                    <input type="radio" className="sr-only" checked={criteria === opt.key} onChange={() => setCriteria(opt.key)} />
                  </label>
                ))}
              </div>

              {/* Estimated reach */}
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
                <Users className="h-5 w-5 text-teal-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-teal-800">Estimated reach: {estimatedReach.toLocaleString()} patients</p>
                  <p className="text-xs text-teal-600">Based on your selected criteria and current patient roster</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button onClick={() => setStep(2)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Back
              </button>
              <button
                onClick={handleLaunch}
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                <Send className="h-4 w-4" />
                {scheduleMode === 'now' ? 'Launch Campaign' : 'Schedule Campaign'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Campaign Detail Panel ----
interface CampaignDetailProps {
  campaign: Campaign
  onClose: () => void
}

function CampaignDetailPanel({ campaign, onClose }: CampaignDetailProps) {
  const deliveryRate = campaign.smsDelivered > 0 ? Math.round((campaign.smsDelivered / campaign.patientsReached) * 100) : 0
  const replyRate = campaign.smsDelivered > 0 ? Math.round((campaign.smsReplied / campaign.smsDelivered) * 100) : 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{campaign.name}</h2>
            <div className="mt-1 flex items-center gap-2">{typeBadge(campaign.type)} {statusBadge(campaign.status)}</div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 px-6 py-5">
          {/* Message preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Message Preview</p>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-medium text-slate-500">SMS from Prism Practice</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{campaign.message}</p>
            </div>
          </div>

          {/* Delivery stats */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Delivery Statistics</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Delivered', value: campaign.smsDelivered, sub: `${deliveryRate}% rate`, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                { label: 'Failed', value: campaign.smsFailed, sub: `${campaign.smsFailed > 0 ? 100 - deliveryRate : 0}% rate`, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
                { label: 'Replied', value: campaign.smsReplied, sub: `${replyRate}% rate`, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-3 text-center`}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
                  <p className="text-xs font-medium text-slate-600">{s.label}</p>
                  <p className="text-xs text-slate-400">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Patient list */}
          {campaign.patients.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Patient Sample ({campaign.patients.length} shown of {campaign.patientsReached.toLocaleString()})
              </p>
              <div className="space-y-1.5">
                {campaign.patients.map((name, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <span className="text-sm text-slate-700">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Main Page ----
export default function Campaigns() {
  const location = useLocation()
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)
  const [showModal, setShowModal] = useState(false)
  const [preselectedType, setPreselectedType] = useState<CampaignType | undefined>(undefined)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  // Handle navigation from Dashboard with pre-selected campaign type
  useEffect(() => {
    const state = location.state as { openModal?: boolean; campaignType?: CampaignType } | null
    if (state?.openModal) {
      setPreselectedType(state.campaignType)
      setShowModal(true)
      // Clear the state so re-navigation doesn't re-trigger
      window.history.replaceState({}, '')
    }
  }, [location.state])

  const totalActive = campaigns.filter((c) => c.status === 'Active').length
  const totalScheduled = campaigns.filter((c) => c.status === 'Scheduled').length
  const totalSms = campaigns.reduce((sum, c) => sum + c.smsDelivered, 0)

  const stats = [
    { label: 'Total Campaigns', value: campaigns.length, icon: <Megaphone className="h-5 w-5 text-violet-600" />, bg: 'bg-violet-50' },
    { label: 'Active', value: totalActive, icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Scheduled', value: totalScheduled, icon: <Clock className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'SMS Delivered', value: totalSms.toLocaleString(), icon: <Send className="h-5 w-5 text-teal-600" />, bg: 'bg-teal-50' },
  ]

  function openNewCampaign(type?: CampaignType) {
    setPreselectedType(type)
    setShowModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Campaigns</h2>
          <p className="mt-1 text-sm text-slate-500">Create and manage SMS outreach campaigns for your patients.</p>
        </div>
        <button
          onClick={() => openNewCampaign()}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 pt-5">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign type quick launch */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Quick Launch</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CAMPAIGN_TYPES.map((t) => (
            <button
              key={t.type}
              onClick={() => openNewCampaign(t.type)}
              className={`flex flex-col items-start gap-3 rounded-xl border-2 bg-white p-4 text-left transition-all duration-150 shadow-sm hover:shadow-md ${t.borderColor} hover:opacity-90`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.iconBg}`}>
                {t.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{t.type}</p>
                <p className="text-xs text-slate-500 leading-snug mt-0.5">{t.description}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-teal-600 mt-auto">
                Start campaign <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Campaign list */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Campaigns</CardTitle>
          <CardDescription>{campaigns.length} campaigns total</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {campaigns.map((campaign) => {
              return (
                <div key={campaign.id}>
                  <div
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Megaphone className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-slate-800">{campaign.name}</p>
                        {typeBadge(campaign.type)}
                      </div>
                      <p className="text-xs text-slate-400">{campaign.date !== '—' ? campaign.date : 'Draft'}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-slate-800">{campaign.patientsReached.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Reached</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-slate-800">{campaign.smsDelivered.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Delivered</p>
                      </div>
                    </div>
                    {statusBadge(campaign.status)}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <NewCampaignModal
          onClose={() => { setShowModal(false); setPreselectedType(undefined) }}
          onLaunch={(c) => setCampaigns((prev) => [c, ...prev])}
          preselectedType={preselectedType}
        />
      )}

      {selectedCampaign && (
        <CampaignDetailPanel
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  )
}
