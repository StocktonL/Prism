import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Megaphone,
  Plus,
  X,
  ChevronRight,
  DollarSign,
  ShoppingBag,
  CalendarRange,
  Bell,
  PenLine,
  MessageSquare,
  CheckCircle2,
  Clock,
  Users,
  Send,
  CalendarDays,
  Zap,
  Timer,
  Contact2,
  Glasses,
  Sun,
  GraduationCap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  PATIENTS,
  getPatientFullName,
  isLuxuryBuyer,
  isSunglassesBuyer,
  isCLReorderDue,
  isSecondPairCandidate,
  isFamilyDependent,
} from '@/data/mockPatients'

type CampaignType =
  | 'Trunk Show'
  | 'End of Year Benefits'
  | 'Mid-Year Reminder'
  | 'Contact Lens Reorder'
  | 'Second Pair'
  | 'Summer Sunglasses'
  | 'Back to School'
  | 'Custom Campaign'
type CampaignStatus = 'Active' | 'Scheduled' | 'Completed' | 'Draft'
type ScheduleMode = 'now' | 'scheduled' | 'staggered'
type CriteriaKey =
  | 'all'
  | 'unused_benefits'
  | 'expiring_30'
  | 'expiring_60'
  | 'expiring_90'
  | 'last_visit_6'
  | 'last_visit_12'
  | 'last_visit_18'
  | 'last_visit_24'
  | 'carrier_vsp'
  | 'carrier_eyemed'
  | 'carrier_davis'
  | 'carrier_spectera'
  | 'luxury_buyer'
  | 'cl_reorder_due_30'
  | 'cl_reorder_due_60'
  | 'second_pair'
  | 'sunglasses_buyer'
  | 'family_dependent'
  | 'back_to_school'

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
  appointmentsBooked: number
  revenueAttributed: number
  date: string
  patients: string[]
}

// Industry benchmark rates used for estimated ROI funnel
// Actual results vary — no EHR integration to confirm real sales
const BOOKING_RATE = 0.80
const AVG_TRANSACTION = 400

function calcRevenue(replied: number) {
  return Math.round(replied * BOOKING_RATE * AVG_TRANSACTION)
}

// Estimated ROI funnel — based on industry benchmarks
const EST_DELIVERY_RATE = 0.97   // 97% of sent messages delivered
const EST_ENGAGEMENT_RATE = 0.11 // 11% of delivered click/respond
const EST_BOOKING_RATE = 0.10    // 10% of delivered book an appointment
const EST_AVG_TRANSACTION = 375  // average optical transaction

function FunnelRow({ label, value, color, sublabel }: { label: string; value: number; color: string; sublabel?: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <span className="text-sm text-slate-300">{label}</span>
        {sublabel && <span className="text-xs text-slate-600 ml-2">{sublabel}</span>}
      </div>
      <span className={`text-sm font-bold ${color}`}>{value.toLocaleString()}</span>
    </div>
  )
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    name: 'End of Year Benefits Reminder',
    type: 'End of Year Benefits',
    status: 'Active',
    message: 'Hi {{first_name}}, your {{carrier}} benefits expire Dec 31. You have {{frame_allowance}} for frames and {{contacts_allowance}} for contacts still available. Call (555) 800-2020 before they expire!',
    patientsReached: 312,
    smsDelivered: 298,
    smsFailed: 14,
    smsReplied: 42,
    appointmentsBooked: 34,
    revenueAttributed: calcRevenue(42),
    date: '2026-05-01',
    patients: ['Sarah Mitchell', 'Linda Kowalski', 'Marcus Rivera', 'Thomas Garrett'],
  },
  {
    id: 2,
    name: 'Trunk Show — Spring Frames',
    type: 'Trunk Show',
    status: 'Completed',
    message: 'Hi {{first_name}}, join us this Saturday for our exclusive spring trunk show! You have {{frame_allowance}} in unused {{carrier}} frame benefits. Try on hundreds of new frames — RSVP: (555) 800-2020.',
    patientsReached: 189,
    smsDelivered: 185,
    smsFailed: 4,
    smsReplied: 31,
    appointmentsBooked: 25,
    revenueAttributed: calcRevenue(31),
    date: '2026-03-15',
    patients: ['James Thornton', 'Diana Patel', 'Robert Chen', 'Priya Nair'],
  },
  {
    id: 3,
    name: 'Mid-Year Check-In',
    type: 'Mid-Year Reminder',
    status: 'Scheduled',
    message: "Hi {{first_name}}, you still have {{frame_allowance}} remaining on your {{carrier}} frame benefit and your exam is covered. Don't let it go to waste — call (555) 800-2020 today.",
    patientsReached: 94,
    smsDelivered: 0,
    smsFailed: 0,
    smsReplied: 0,
    appointmentsBooked: 0,
    revenueAttributed: 0,
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
    appointmentsBooked: 0,
    revenueAttributed: 0,
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
    defaultMessage: 'Hi {{first_name}}, join us this Saturday for our exclusive trunk show! You have {{frame_allowance}} in unused frame benefits. Try on hundreds of new frames — RSVP: (555) 800-2020.',
  },
  {
    type: 'End of Year Benefits',
    description: 'Remind patients their benefits expire Dec 31',
    icon: <CalendarRange className="h-5 w-5 text-rose-600" />,
    iconBg: 'bg-rose-50',
    borderColor: 'border-rose-300',
    defaultMessage: 'Hi {{first_name}}, your {{carrier}} benefits expire Dec 31. You have {{frame_allowance}} for frames and {{contacts_allowance}} for contacts still available. Call (555) 800-2020 before they expire!',
  },
  {
    type: 'Mid-Year Reminder',
    description: 'Re-engage patients with benefits still available',
    icon: <Bell className="h-5 w-5 text-teal-600" />,
    iconBg: 'bg-teal-50',
    borderColor: 'border-teal-300',
    defaultMessage: "Hi {{first_name}}, you still have {{frame_allowance}} remaining on your {{carrier}} frame benefit and your exam is covered. Don't let it go to waste — call (555) 800-2020 today.",
  },
  {
    type: 'Contact Lens Reorder',
    description: 'Reach patients whose CL supply is due for a refill',
    icon: <Contact2 className="h-5 w-5 text-blue-600" />,
    iconBg: 'bg-blue-50',
    borderColor: 'border-blue-300',
    defaultMessage: "Hi {{first_name}}, your {{cl_brand}} supply should be running low! You still have {{contacts_allowance}} in {{carrier}} contact lens benefits. Call (555) 800-2020 to reorder — we'll have them ready in 3 days.",
  },
  {
    type: 'Second Pair',
    description: 'Patients with unused frame $ and no second pair yet',
    icon: <Glasses className="h-5 w-5 text-violet-600" />,
    iconBg: 'bg-violet-50',
    borderColor: 'border-violet-300',
    defaultMessage: 'Hi {{first_name}}, you still have {{frame_allowance}} in unused {{carrier}} frame benefits. A second pair — prescription sunglasses, readers, or a backup — is a great way to use them before they expire. Call (555) 800-2020.',
  },
  {
    type: 'Summer Sunglasses',
    description: 'Target past sunglasses buyers with frame benefits available',
    icon: <Sun className="h-5 w-5 text-yellow-600" />,
    iconBg: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
    defaultMessage: 'Hi {{first_name}}, summer is here! Your {{carrier}} plan has {{frame_allowance}} ready to use on prescription sunglasses. Protect your eyes and use your benefits — call (555) 800-2020.',
  },
  {
    type: 'Back to School',
    description: 'Families with children — get eyes ready before the school year',
    icon: <GraduationCap className="h-5 w-5 text-indigo-600" />,
    iconBg: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    defaultMessage: 'Hi {{first_name}}, back to school is right around the corner! Make sure your child has a current eye exam and new glasses before the year starts. You have {{frame_allowance}} in {{carrier}} benefits ready — call (555) 800-2020.',
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

const MERGE_TAGS = [
  { tag: '{{first_name}}', label: 'First Name', preview: 'Sarah' },
  { tag: '{{carrier}}', label: 'Carrier', preview: 'VSP' },
  { tag: '{{frame_allowance}}', label: 'Frame $', preview: '$150' },
  { tag: '{{contacts_allowance}}', label: 'Contacts $', preview: '$130' },
  { tag: '{{lens_benefit}}', label: 'Lens Benefit', preview: 'covered lenses' },
  { tag: '{{benefit_expiry}}', label: 'Expiry Date', preview: 'Dec 31' },
  { tag: '{{cl_brand}}', label: 'CL Brand', preview: 'Acuvue Oasys' },
  { tag: '{{frame_brand}}', label: 'Frame Brand', preview: 'Maui Jim' },
  { tag: '{{sunglasses_brand}}', label: 'Sunglass Brand', preview: 'Maui Jim' },
]

function previewMessage(msg: string) {
  return msg
    .replace(/{{first_name}}/g, 'Sarah')
    .replace(/{{carrier}}/g, 'VSP')
    .replace(/{{frame_allowance}}/g, '$150')
    .replace(/{{contacts_allowance}}/g, '$130')
    .replace(/{{lens_benefit}}/g, 'covered lenses')
    .replace(/{{benefit_expiry}}/g, 'Dec 31')
    .replace(/{{cl_brand}}/g, 'Acuvue Oasys')
    .replace(/{{frame_brand}}/g, 'Maui Jim')
    .replace(/{{sunglasses_brand}}/g, 'Maui Jim')
}

const CRITERIA_OPTIONS: { key: CriteriaKey; label: string; reach: number; group?: string }[] = [
  // ── Benefit status ──────────────────────────────────────────────────────────
  { key: 'all',           label: 'All patients',                          reach: PATIENTS.length,                                                          group: 'General' },
  { key: 'unused_benefits', label: 'Has unused benefits',                 reach: 7,                                                                        group: 'General' },
  { key: 'expiring_30',   label: 'Benefits expiring within 30 days',     reach: 312,                                                                       group: 'General' },
  { key: 'expiring_60',   label: 'Benefits expiring within 60 days',     reach: 489,                                                                       group: 'General' },
  { key: 'expiring_90',   label: 'Benefits expiring within 90 days',     reach: 671,                                                                       group: 'General' },
  // ── Recency ─────────────────────────────────────────────────────────────────
  { key: 'last_visit_6',  label: 'Last visit more than 6 months ago',    reach: 94,                                                                        group: 'Recency' },
  { key: 'last_visit_12', label: 'Last visit more than 12 months ago',   reach: 189,                                                                       group: 'Recency' },
  { key: 'last_visit_18', label: 'Last visit more than 18 months ago',   reach: 243,                                                                       group: 'Recency' },
  { key: 'last_visit_24', label: 'Last visit more than 24 months ago',   reach: 301,                                                                       group: 'Recency' },
  // ── Carrier ──────────────────────────────────────────────────────────────────
  { key: 'carrier_vsp',     label: 'VSP patients only',         reach: PATIENTS.filter(p => p.primaryInsurance.carrier === 'VSP').length,        group: 'Carrier' },
  { key: 'carrier_eyemed',  label: 'EyeMed patients only',      reach: PATIENTS.filter(p => p.primaryInsurance.carrier === 'EyeMed').length,     group: 'Carrier' },
  { key: 'carrier_davis',   label: 'Davis Vision patients only', reach: PATIENTS.filter(p => p.primaryInsurance.carrier === 'Davis Vision').length, group: 'Carrier' },
  { key: 'carrier_spectera', label: 'Spectera patients only',   reach: PATIENTS.filter(p => p.primaryInsurance.carrier === 'Spectera').length,   group: 'Carrier' },
  // ── Purchase behavior ────────────────────────────────────────────────────────
  { key: 'luxury_buyer',       label: 'Luxury frame buyers (Maui Jim, Silhouette, Costa…)', reach: PATIENTS.filter(isLuxuryBuyer).length,       group: 'Behavior' },
  { key: 'sunglasses_buyer',   label: 'Past sunglasses buyers',                             reach: PATIENTS.filter(isSunglassesBuyer).length,   group: 'Behavior' },
  { key: 'second_pair',        label: 'Second pair opportunity (>$75 frame $ remaining)',   reach: PATIENTS.filter(isSecondPairCandidate).length, group: 'Behavior' },
  // ── Contact lenses ───────────────────────────────────────────────────────────
  { key: 'cl_reorder_due_30',  label: 'CL reorder due within 30 days',   reach: PATIENTS.filter(p => isCLReorderDue(p, 30)).length,             group: 'Contacts' },
  { key: 'cl_reorder_due_60',  label: 'CL reorder due within 60 days',   reach: PATIENTS.filter(p => isCLReorderDue(p, 60)).length,             group: 'Contacts' },
  // ── Family ───────────────────────────────────────────────────────────────────
  { key: 'family_dependent',   label: 'Spouse and child patients',        reach: PATIENTS.filter(isFamilyDependent).length,                      group: 'Family' },
  { key: 'back_to_school',     label: 'Children with benefits available', reach: PATIENTS.filter(p => p.primaryInsurance.relationship === 'Child' && isSecondPairCandidate(p)).length, group: 'Family' },
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
    'Trunk Show':          'text-amber-700 bg-amber-50',
    'End of Year Benefits': 'text-rose-700 bg-rose-50',
    'Mid-Year Reminder':   'text-teal-700 bg-teal-50',
    'Contact Lens Reorder': 'text-blue-700 bg-blue-50',
    'Second Pair':         'text-violet-700 bg-violet-50',
    'Summer Sunglasses':   'text-yellow-700 bg-yellow-50',
    'Back to School':      'text-indigo-700 bg-indigo-50',
    'Custom Campaign':     'text-slate-600 bg-slate-100',
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
  preselectedBrand?: string
}

function NewCampaignModal({ onClose, onLaunch, preselectedType, preselectedBrand }: NewCampaignModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(preselectedType ? 2 : 1)
  const [selectedType, setSelectedType] = useState<CampaignType | null>(preselectedType ?? null)
  const [name, setName] = useState(
    preselectedBrand
      ? `${preselectedBrand} Trunk Show — ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
      : preselectedType
      ? `${preselectedType} — ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
      : ''
  )
  const [message, setMessage] = useState(
    preselectedBrand
      ? `Hi {{first_name}}, did you know your {{carrier}} plan still has {{frame_allowance}} in frame benefits you haven't used? We're hosting a ${preselectedBrand} trunk show and thought of you — those benefits apply to any pair. Want us to hold a spot? Call (555) 800-2020.`
      : CAMPAIGN_TYPES.find((t) => t.type === preselectedType)?.defaultMessage ?? ''
  )
  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>('now')
  const [scheduleDate, setScheduleDate] = useState('')
  const [staggerStartDate, setStaggerStartDate] = useState('')
  const [staggerDays, setStaggerDays] = useState(7)
  const [criteria, setCriteria] = useState<CriteriaKey>(preselectedBrand ? 'all' : 'unused_benefits')
  const MAX_CHARS = 320

  // Patients who purchased this brand — shown in brand targeting banner
  const brandPatients = preselectedBrand
    ? PATIENTS.filter((p) => p.lastFrameBrand === preselectedBrand)
    : []

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
    const replied = scheduleMode === 'now' ? Math.floor(estimatedReach * 0.12) : 0
    const newCampaign: Campaign = {
      id: Date.now(),
      name,
      type: selectedType!,
      status: scheduleMode === 'now' ? 'Active' : 'Scheduled',
      message,
      patientsReached: estimatedReach,
      smsDelivered: scheduleMode === 'now' ? Math.floor(estimatedReach * 0.95) : 0,
      smsFailed: scheduleMode === 'now' ? Math.ceil(estimatedReach * 0.05) : 0,
      smsReplied: replied,
      appointmentsBooked: Math.round(replied * BOOKING_RATE),
      revenueAttributed: calcRevenue(replied),
      date: scheduleMode === 'now' ? new Date().toISOString().split('T')[0] : (scheduleDate || staggerStartDate || new Date().toISOString().split('T')[0]),
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
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — fixed */}
        <div className="flex-shrink-0 border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900">New Campaign</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">

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
            <div className="space-y-4 px-6 py-5">

              {/* Brand targeting banner */}
              {preselectedBrand && brandPatients.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag className="h-4 w-4 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-800">Targeting {preselectedBrand} patients</p>
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">{brandPatients.length} matched</span>
                  </div>
                  <div className="space-y-1.5">
                    {brandPatients.map((p) => (
                      <div key={p.id} className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-white px-3 py-2">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-slate-800">{p.firstName} {p.lastName}</span>
                          <span className="ml-2 text-xs text-slate-500">{p.primaryInsurance.carrier}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500">{p.lastFrameBrand}</span>
                          {p.lastFrameModel && <span className="text-xs text-slate-400">— {p.lastFrameModel}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-amber-600">This message will also go to all other patients with unused frame benefits.</p>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Campaign Name</label>
                <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">Message</label>
                  <span className={`text-xs font-medium ${message.length > MAX_CHARS ? 'text-red-500' : message.length > 160 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {message.length} chars · {message.length <= 160 ? '1 segment' : message.length <= 320 ? '2 segments' : 'too long'}
                  </span>
                </div>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {MERGE_TAGS.map((t) => (
                    <button
                      key={t.tag}
                      type="button"
                      onClick={() => setMessage((m) => m + t.tag)}
                      className="rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700 hover:bg-teal-100 transition-colors"
                      title={`Inserts patient's ${t.label} from verified benefits`}
                    >
                      + {t.label}
                    </button>
                  ))}
                </div>
                <textarea
                  className="input-field min-h-[90px] resize-none font-mono text-xs"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your SMS message..."
                />
                {message && (
                  <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Live preview — how Sarah's message will read:</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{previewMessage(message)}</p>
                    <p className="mt-1.5 text-xs text-teal-600 font-medium">Hard dollar amounts pulled from each patient's verified benefits at send time.</p>
                  </div>
                )}
                <p className="mt-1.5 text-xs text-slate-400">Up to 320 characters (2 SMS segments). Twilio auto-splits — patients see one message. Avoid emoji to stay in 1-segment pricing.</p>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">Schedule</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mode: 'now' as ScheduleMode,       icon: <Zap className="h-4 w-4" />,         label: 'Send Now',       sub: 'All at once, immediately'    },
                    { mode: 'scheduled' as ScheduleMode, icon: <CalendarDays className="h-4 w-4" />, label: 'Specific Date',  sub: 'All at once on a chosen day' },
                    { mode: 'staggered' as ScheduleMode, icon: <Timer className="h-4 w-4" />,        label: 'Staggered Send', sub: 'Spread over days or weeks'   },
                  ].map((opt) => (
                    <button
                      key={opt.mode}
                      type="button"
                      onClick={() => setScheduleMode(opt.mode)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border py-3 px-2 text-center transition-colors ${scheduleMode === opt.mode ? 'border-teal-400 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                      {opt.icon}
                      <span className="text-xs font-semibold leading-tight">{opt.label}</span>
                      <span className="text-xs text-slate-400 leading-tight">{opt.sub}</span>
                    </button>
                  ))}
                </div>
                {scheduleMode === 'scheduled' && (
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-slate-600">Send date</label>
                    <input type="date" className="input-field" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                  </div>
                )}
                {scheduleMode === 'staggered' && (
                  <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50/50 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Start date</label>
                        <input type="date" className="input-field" value={staggerStartDate} onChange={(e) => setStaggerStartDate(e.target.value)} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-600">Spread over</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[{ days: 3, label: '3 days' }, { days: 5, label: '5 days' }, { days: 7, label: '1 week' }, { days: 14, label: '2 weeks' }].map((opt) => (
                            <button key={opt.days} type="button" onClick={() => setStaggerDays(opt.days)}
                              className={`rounded-lg border py-1.5 text-xs font-semibold transition-colors ${staggerDays === opt.days ? 'border-teal-500 bg-teal-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-teal-200 bg-white px-3 py-2">
                      <p className="text-xs font-semibold text-teal-700 mb-0.5">How staggered send works</p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Prizm divides your patient list evenly and sends a batch each day over {staggerDays} day{staggerDays > 1 ? 's' : ''}.
                        Your front desk gets a steady flow of callbacks instead of a flood on day one.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-500">Choose which patients to include in this campaign</p>

              {/* Brand-specific option shown first when brand is preselected */}
              {preselectedBrand && brandPatients.length > 0 && (
                <label className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-3 transition-colors ${criteria === 'all' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${criteria === 'all' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`} />
                    <div>
                      <span className="text-sm font-semibold text-slate-700">{preselectedBrand} patients + unused benefits</span>
                      <p className="text-xs text-slate-400 mt-0.5">Prioritizes {preselectedBrand} purchasers, includes all patients with frame benefits</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">{brandPatients.length} brand matches</span>
                  <input type="radio" className="sr-only" checked={criteria === 'all'} onChange={() => setCriteria('all')} />
                </label>
              )}

              <div className="space-y-2">
                {CRITERIA_OPTIONS.filter(o => o.key !== 'all').map((opt) => (
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

              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-teal-800">{estimatedReach.toLocaleString()} patients will receive this campaign</p>
                    <p className="text-xs text-teal-600 mt-0.5">Based on your selected criteria and current patient roster</p>
                  </div>
                </div>
                {scheduleMode === 'staggered' && estimatedReach > 0 && (
                  <div className="mt-3 border-t border-teal-200 pt-3">
                    <p className="text-xs font-semibold text-teal-700 mb-2">Staggered send schedule</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-lg bg-white border border-teal-200 px-3 py-2 text-center">
                        <p className="text-lg font-bold text-slate-800">{Math.ceil(estimatedReach / staggerDays)}</p>
                        <p className="text-xs text-slate-500">messages/day</p>
                      </div>
                      <div className="rounded-lg bg-white border border-teal-200 px-3 py-2 text-center">
                        <p className="text-lg font-bold text-slate-800">{staggerDays}</p>
                        <p className="text-xs text-slate-500">days total</p>
                      </div>
                      <div className="rounded-lg bg-white border border-teal-200 px-3 py-2 text-center">
                        <p className="text-lg font-bold text-slate-800">{estimatedReach.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">total sent</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-teal-600">Each batch sends at 10:00 AM automatically — no action needed after approval.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>{/* end scrollable content */}

        {/* Footer — fixed, only on steps 2 and 3 */}
        {step === 2 && (
          <div className="flex-shrink-0 flex items-center justify-between border-t border-slate-200 px-6 py-4">
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
        )}
        {step === 3 && (
          <div className="flex-shrink-0 flex items-center justify-between border-t border-slate-200 px-6 py-4">
            <button onClick={() => setStep(2)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Back
            </button>
            <button
              onClick={handleLaunch}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <Send className="h-4 w-4" />
              {scheduleMode === 'now' ? 'Launch Campaign' : scheduleMode === 'staggered' ? 'Start Staggered Send' : 'Schedule Campaign'}
            </button>
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
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Message Template</p>
            <div className="rounded-lg border border-slate-100 bg-white p-3 mb-2">
              <p className="text-xs font-mono text-slate-500 leading-relaxed">{campaign.message}</p>
            </div>
            <p className="mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Personalized example — Sarah Mitchell (VSP)</p>
            <div className="rounded-lg border border-teal-200 bg-white p-3">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-teal-600" />
                <span className="text-xs font-medium text-teal-600">SMS from Prizm</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{previewMessage(campaign.message)}</p>
            </div>
            <p className="mt-2 text-xs text-teal-600">Each patient receives their actual verified benefit amounts at send time.</p>
          </div>

          {/* Estimated ROI Funnel */}
          {campaign.patientsReached > 0 && (
            <div className="rounded-xl bg-slate-800/50 border border-white/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Performance</span>
                <span className="text-xs text-slate-600">Based on industry benchmarks</span>
              </div>
              <div className="space-y-2">
                <FunnelRow label="Patients Reached" value={campaign.patientsReached} color="text-white" />
                <FunnelRow label="Est. Delivered" value={Math.round(campaign.patientsReached * EST_DELIVERY_RATE)} color="text-teal-400" sublabel="97% delivery rate" />
                <FunnelRow label="Est. Engaged" value={Math.round(campaign.patientsReached * EST_ENGAGEMENT_RATE)} color="text-emerald-400" sublabel="11% engagement" />
                <FunnelRow label="Est. Appointments" value={Math.round(campaign.patientsReached * EST_BOOKING_RATE)} color="text-amber-400" sublabel="10% booking rate" />
                <div className="border-t border-white/5 pt-2 mt-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Est. Optical Revenue</span>
                  <span className="text-lg font-black text-teal-400">${(Math.round(campaign.patientsReached * EST_BOOKING_RATE) * EST_AVG_TRANSACTION).toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3">Actual results vary. Average optical transaction $375 per appointment.</p>
            </div>
          )}

          {/* Delivery stats */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Delivery Statistics</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Delivered', value: campaign.smsDelivered, sub: `${deliveryRate}% rate`, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                { label: 'Failed',    value: campaign.smsFailed,    sub: `${campaign.smsFailed > 0 ? 100 - deliveryRate : 0}% rate`, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
                { label: 'Replied',   value: campaign.smsReplied,   sub: `${replyRate}% rate`,    color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
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
  const [preselectedBrand, setPreselectedBrand] = useState<string | undefined>(undefined)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  useEffect(() => {
    const state = location.state as { openModal?: boolean; campaignType?: CampaignType; brand?: string } | null
    if (state?.openModal) {
      setPreselectedType(state.campaignType)
      setPreselectedBrand(state.brand)
      setShowModal(true)
      window.history.replaceState({}, '')
    }
  }, [location.state])

  const totalSms = campaigns.reduce((sum, c) => sum + c.smsDelivered, 0)
  const totalReplied = campaigns.reduce((sum, c) => sum + c.smsReplied, 0)
  const avgResponseRate = totalSms > 0 ? Math.round((totalReplied / totalSms) * 100) : 0

  // Est. Revenue Opportunity: sum of (reach × 10% booking rate × $375) for sent/completed campaigns
  const sentCampaigns = campaigns.filter(c => c.status === 'Active' || c.status === 'Completed')
  const totalEstRevenue = sentCampaigns.reduce((sum, c) => sum + Math.round(c.patientsReached * EST_BOOKING_RATE * EST_AVG_TRANSACTION), 0)

  const stats = [
    { label: 'Total Campaigns',        value: campaigns.length,                        icon: <Megaphone    className="h-5 w-5 text-violet-600" />,  bg: 'bg-violet-50',  subtitle: undefined },
    { label: 'Avg Response Rate',      value: `${avgResponseRate}%`,                   icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,    bg: 'bg-blue-50',    subtitle: undefined },
    { label: 'SMS Delivered',          value: totalSms.toLocaleString(),               icon: <Send         className="h-5 w-5 text-teal-600" />,    bg: 'bg-teal-50',    subtitle: undefined },
    { label: 'Est. Revenue Opportunity', value: `$${totalEstRevenue.toLocaleString()}`, icon: <DollarSign  className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50', subtitle: 'based on 10% booking rate' },
  ]

  function openNewCampaign(type?: CampaignType, brand?: string) {
    setPreselectedType(type)
    setPreselectedBrand(brand)
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
                {s.subtitle && <p className="text-xs text-slate-500 mt-0.5">{s.subtitle}</p>}
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
                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-semibold text-slate-800">{campaign.patientsReached.toLocaleString()}</p>
                        <p className="text-xs text-slate-400">Reached</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-slate-800">
                          {campaign.smsDelivered > 0
                            ? `${Math.round((campaign.smsReplied / campaign.smsDelivered) * 100)}%`
                            : '—'}
                        </p>
                        <p className="text-xs text-slate-400">Response</p>
                      </div>
                      <div className="text-center">
                        <p className={`font-semibold ${campaign.patientsReached > 0 && (campaign.status === 'Active' || campaign.status === 'Completed') ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {campaign.patientsReached > 0 && (campaign.status === 'Active' || campaign.status === 'Completed')
                            ? `$${(Math.round(campaign.patientsReached * EST_BOOKING_RATE) * EST_AVG_TRANSACTION).toLocaleString()}`
                            : '—'}
                        </p>
                        <p className="text-xs text-slate-400">Est. Revenue</p>
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
          onClose={() => { setShowModal(false); setPreselectedType(undefined); setPreselectedBrand(undefined) }}
          onLaunch={(c) => setCampaigns((prev) => [c, ...prev])}
          preselectedType={preselectedType}
          preselectedBrand={preselectedBrand}
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
