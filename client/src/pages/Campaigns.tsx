import { useState, useEffect, useLayoutEffect, useRef, forwardRef, useImperativeHandle, useMemo } from 'react'
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
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

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
  id: string
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
const BOOKING_RATE = 0.80
const AVG_TRANSACTION = 400

function calcRevenue(replied: number) {
  return Math.round(replied * BOOKING_RATE * AVG_TRANSACTION)
}

// Estimated ROI funnel — based on industry benchmarks
const EST_DELIVERY_RATE = 0.97
const EST_ENGAGEMENT_RATE = 0.11
const EST_BOOKING_RATE = 0.10
const EST_AVG_TRANSACTION = 375

// ---- DB types ----

interface DbPatient {
  id: string
  first_name: string
  last_name: string
  insurance_carrier: string | null
  last_visit_date: string | null
  contact_lens_wearer: boolean
  last_frame_purchase: string | null
  last_cl_order: string | null
  last_frame_brand: string | null
  last_frame_model: string | null
}

interface DbEligRecord {
  frame: number
  cl: number
  expires: string | null
}

type DbEligMap = Map<string, DbEligRecord>

const LUXURY_BRANDS = ['Maui Jim', 'Silhouette', 'Costa', 'Lindberg', 'Oliver Peoples']

function isDbLuxuryBuyer(p: DbPatient): boolean {
  if (!p.last_frame_brand) return false
  const brand = p.last_frame_brand.toLowerCase()
  return LUXURY_BRANDS.some(b => brand.includes(b.toLowerCase()))
}

function isDbCLReorderDue(p: DbPatient, windowDays: number): boolean {
  if (!p.contact_lens_wearer || !p.last_cl_order) return false
  const dueDate = new Date(p.last_cl_order)
  dueDate.setDate(dueDate.getDate() + 90) // assume 90-day supply
  const msUntilDue = dueDate.getTime() - Date.now()
  const daysUntilDue = msUntilDue / (1000 * 60 * 60 * 24)
  return daysUntilDue <= windowDays && daysUntilDue >= -30
}

function monthsSince(dateStr: string, today: Date): number {
  const d = new Date(dateStr)
  return (today.getFullYear() - d.getFullYear()) * 12 + (today.getMonth() - d.getMonth())
}

function matchesCriteria(p: DbPatient, key: CriteriaKey, today: Date, eligMap: DbEligMap): boolean {
  const elig = eligMap.get(p.id)
  const frame = elig?.frame ?? 0
  const cl = elig?.cl ?? 0
  switch (key) {
    case 'all': return true
    case 'unused_benefits': return frame > 0 || cl > 0
    case 'expiring_30':
    case 'expiring_60':
    case 'expiring_90': {
      if (!elig?.expires) return false
      if (frame <= 0 && cl <= 0) return false
      const days = Math.ceil((new Date(elig.expires).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      const limit = key === 'expiring_30' ? 30 : key === 'expiring_60' ? 60 : 90
      return days >= 0 && days <= limit
    }
    case 'last_visit_6':
    case 'last_visit_12':
    case 'last_visit_18':
    case 'last_visit_24': {
      if (!p.last_visit_date) return false
      const months = monthsSince(p.last_visit_date, today)
      const limit = key === 'last_visit_6' ? 6 : key === 'last_visit_12' ? 12 : key === 'last_visit_18' ? 18 : 24
      return months > limit
    }
    case 'carrier_vsp': return p.insurance_carrier === 'VSP'
    case 'carrier_eyemed': return p.insurance_carrier === 'EyeMed'
    case 'carrier_davis': return p.insurance_carrier === 'Davis Vision'
    case 'carrier_spectera': return p.insurance_carrier === 'Spectera'
    case 'luxury_buyer': return isDbLuxuryBuyer(p)
    case 'cl_reorder_due_30': return isDbCLReorderDue(p, 30)
    case 'cl_reorder_due_60': return isDbCLReorderDue(p, 60)
    case 'second_pair': return frame > 75
    case 'sunglasses_buyer': return false
    case 'family_dependent': return false
    case 'back_to_school': return false
    default: return false
  }
}

function dbStatusToUi(status: string): CampaignStatus {
  switch (status) {
    case 'sent': return 'Active'
    case 'scheduled': return 'Scheduled'
    case 'completed': return 'Completed'
    case 'draft': return 'Draft'
    default: return 'Draft'
  }
}

// ---- Funnel row ----

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

// ---- Token Editor ----

// Constant so Tailwind includes these classes in the CSS bundle
const PILL_CLASSES =
  'inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 mx-0.5 select-none cursor-default align-middle'

function buildPillHtml(raw: string): string {
  return raw.replace(/\{\{(\w+)\}\}/g, (match) => {
    const tag = MERGE_TAGS.find((t) => t.tag === match)
    const label = tag?.label ?? match
    return `<span contenteditable="false" data-token="${match}" class="${PILL_CLASSES}">${label}</span>`
  })
}

function extractRaw(el: HTMLElement): string {
  return el.innerHTML
    .replace(/<span[^>]*data-token="([^"]*)"[^>]*>[^<]*<\/span>/g, '$1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

interface TokenEditorHandle {
  insertAtCursor: (tag: string) => void
}

const TokenEditor = forwardRef<TokenEditorHandle, {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}>(function TokenEditor({ value, onChange, placeholder }, ref) {
  const divRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({ insertAtCursor: doInsert }))

  useLayoutEffect(() => {
    const el = divRef.current
    if (!el) return
    if (extractRaw(el) === value) return
    el.innerHTML = buildPillHtml(value)
  }, [value])

  function doInsert(tag: string) {
    const el = divRef.current
    if (!el) return
    const label = MERGE_TAGS.find((t) => t.tag === tag)?.label ?? tag
    const span = document.createElement('span')
    span.setAttribute('contenteditable', 'false')
    span.setAttribute('data-token', tag)
    span.className = PILL_CLASSES
    span.textContent = label

    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && el.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      const range = sel.getRangeAt(0)
      range.deleteContents()
      range.insertNode(span)
      range.setStartAfter(span)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    } else {
      el.appendChild(span)
      const range = document.createRange()
      range.setStartAfter(span)
      range.collapse(true)
      if (sel) { sel.removeAllRanges(); sel.addRange(range) }
    }

    onChange(extractRaw(el))
  }

  function handleInput() {
    const el = divRef.current
    if (el) onChange(extractRaw(el))
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const tag = e.dataTransfer.getData('text/plain')
    if (!MERGE_TAGS.find((t) => t.tag === tag)) return

    let range: Range | null = null
    if (document.caretRangeFromPoint) {
      range = document.caretRangeFromPoint(e.clientX, e.clientY)
    } else if ('caretPositionFromPoint' in document) {
      const pos = (document as unknown as {
        caretPositionFromPoint: (x: number, y: number) => { offsetNode: Node; offset: number } | null
      }).caretPositionFromPoint(e.clientX, e.clientY)
      if (pos) {
        range = document.createRange()
        range.setStart(pos.offsetNode, pos.offset)
        range.collapse(true)
      }
    }
    if (range) {
      const sel = window.getSelection()
      if (sel) { sel.removeAllRanges(); sel.addRange(range) }
    }
    doInsert(tag)
  }

  return (
    <div className="relative">
      <div
        ref={divRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="min-h-[96px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 transition focus:border-teal-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 leading-relaxed"
      />
      {!value && placeholder && (
        <div className="pointer-events-none absolute left-0 top-0 px-3.5 py-3 text-sm text-slate-400 select-none">
          {placeholder}
        </div>
      )}
    </div>
  )
})

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
  onLaunch: () => void
  practiceId: string | null
  preselectedType?: CampaignType
  preselectedBrand?: string
}

function NewCampaignModal({ onClose, onLaunch, practiceId, preselectedType, preselectedBrand }: NewCampaignModalProps) {
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
  const [carrierFilters, setCarrierFilters] = useState<string[]>([])
  const [typeFilters, setTypeFilters] = useState<string[]>([])
  const [minBenefit, setMinBenefit] = useState(0)
  const [saving, setSaving] = useState(false)
  const MAX_CHARS = 320
  const tokenEditorRef = useRef<TokenEditorHandle>(null)

  // DB patient data for real reach counts
  const [dbPatients, setDbPatients] = useState<DbPatient[]>([])
  const [dbEligMap, setDbEligMap] = useState<DbEligMap>(new Map())
  const [loadingData, setLoadingData] = useState(false)

  // Stable "now" reference for the life of this modal
  const today = useMemo(() => new Date(), [])

  // Load patients + eligibility from DB when modal opens
  useEffect(() => {
    async function loadPatients() {
      if (!practiceId) return
      setLoadingData(true)
      try {
        const { data: patients } = await supabase
          .from('patients')
          .select('id, first_name, last_name, insurance_carrier, last_visit_date, contact_lens_wearer, last_frame_purchase, last_cl_order, last_frame_brand, last_frame_model')
          .eq('practice_id', practiceId)

        if (!patients?.length) { setLoadingData(false); return }
        setDbPatients(patients)

        const { data: checks } = await supabase
          .from('eligibility_checks')
          .select('patient_id, frame_allowance, cl_allowance, expiration_date, checked_at')
          .in('patient_id', patients.map(p => p.id))
          .order('checked_at', { ascending: false })

        const emap = new Map<string, DbEligRecord>()
        for (const c of (checks ?? [])) {
          if (!emap.has(c.patient_id)) {
            emap.set(c.patient_id, {
              frame: Number(c.frame_allowance) || 0,
              cl: Number(c.cl_allowance) || 0,
              expires: c.expiration_date ?? null,
            })
          }
        }
        setDbEligMap(emap)
      } finally {
        setLoadingData(false)
      }
    }
    loadPatients()
  }, [practiceId])

  // Patients that previously bought the preselected brand
  const brandPatients = useMemo(() => {
    if (!preselectedBrand) return []
    return dbPatients.filter(p => p.last_frame_brand === preselectedBrand)
  }, [dbPatients, preselectedBrand])

  // Criteria options with real reach counts from DB
  const criteriaOptions = useMemo(() => {
    const count = (key: CriteriaKey) =>
      dbPatients.filter(p => matchesCriteria(p, key, today, dbEligMap)).length
    return [
      { key: 'all' as CriteriaKey,           label: 'All patients',                                       reach: dbPatients.length, group: 'General' },
      { key: 'unused_benefits' as CriteriaKey, label: 'Has unused benefits',                              reach: count('unused_benefits'), group: 'General' },
      { key: 'expiring_30' as CriteriaKey,   label: 'Benefits expiring within 30 days',                  reach: count('expiring_30'), group: 'General' },
      { key: 'expiring_60' as CriteriaKey,   label: 'Benefits expiring within 60 days',                  reach: count('expiring_60'), group: 'General' },
      { key: 'expiring_90' as CriteriaKey,   label: 'Benefits expiring within 90 days',                  reach: count('expiring_90'), group: 'General' },
      { key: 'last_visit_6' as CriteriaKey,  label: 'Last visit more than 6 months ago',                 reach: count('last_visit_6'), group: 'Recency' },
      { key: 'last_visit_12' as CriteriaKey, label: 'Last visit more than 12 months ago',                reach: count('last_visit_12'), group: 'Recency' },
      { key: 'last_visit_18' as CriteriaKey, label: 'Last visit more than 18 months ago',                reach: count('last_visit_18'), group: 'Recency' },
      { key: 'last_visit_24' as CriteriaKey, label: 'Last visit more than 24 months ago',                reach: count('last_visit_24'), group: 'Recency' },
      { key: 'carrier_vsp' as CriteriaKey,     label: 'VSP patients only',                              reach: count('carrier_vsp'), group: 'Carrier' },
      { key: 'carrier_eyemed' as CriteriaKey,  label: 'EyeMed patients only',                           reach: count('carrier_eyemed'), group: 'Carrier' },
      { key: 'carrier_davis' as CriteriaKey,   label: 'Davis Vision patients only',                     reach: count('carrier_davis'), group: 'Carrier' },
      { key: 'carrier_spectera' as CriteriaKey, label: 'Spectera patients only',                        reach: count('carrier_spectera'), group: 'Carrier' },
      { key: 'luxury_buyer' as CriteriaKey,     label: 'Luxury frame buyers (Maui Jim, Silhouette, Costa…)', reach: count('luxury_buyer'), group: 'Behavior' },
      { key: 'sunglasses_buyer' as CriteriaKey, label: 'Past sunglasses buyers',                        reach: 0, group: 'Behavior' },
      { key: 'second_pair' as CriteriaKey,      label: 'Second pair opportunity (>$75 frame $ remaining)', reach: count('second_pair'), group: 'Behavior' },
      { key: 'cl_reorder_due_30' as CriteriaKey, label: 'CL reorder due within 30 days',               reach: count('cl_reorder_due_30'), group: 'Contacts' },
      { key: 'cl_reorder_due_60' as CriteriaKey, label: 'CL reorder due within 60 days',               reach: count('cl_reorder_due_60'), group: 'Contacts' },
      { key: 'family_dependent' as CriteriaKey,  label: 'Spouse and child patients',                    reach: 0, group: 'Family' },
      { key: 'back_to_school' as CriteriaKey,    label: 'Children with benefits available',             reach: 0, group: 'Family' },
    ]
  }, [dbPatients, dbEligMap, today])

  // Patients that match ALL active filters — used for DB write and reach count
  const filteredPatients = useMemo(() => {
    let result = dbPatients.filter(p => matchesCriteria(p, criteria, today, dbEligMap))
    if (carrierFilters.length > 0) {
      result = result.filter(p => carrierFilters.includes(p.insurance_carrier ?? ''))
    }
    for (const t of typeFilters) {
      if (t === 'cl_wearer') result = result.filter(p => p.contact_lens_wearer)
      else if (t === 'luxury') result = result.filter(p => isDbLuxuryBuyer(p))
      else if (t === 'second_pair') result = result.filter(p => (dbEligMap.get(p.id)?.frame ?? 0) > 75)
      // 'sunglasses' and 'family' not filterable from DB — skip to avoid zeroing count
    }
    if (minBenefit > 0) {
      result = result.filter(p => {
        const elig = dbEligMap.get(p.id)
        return (elig?.frame ?? 0) >= minBenefit || (elig?.cl ?? 0) >= minBenefit
      })
    }
    return result
  }, [dbPatients, dbEligMap, criteria, carrierFilters, typeFilters, minBenefit, today])

  const estimatedReach = filteredPatients.length
  const baseReach = criteriaOptions.find(c => c.key === criteria)?.reach ?? 0

  function toggleCarrier(c: string) {
    setCarrierFilters(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }
  function toggleType(t: string) {
    setTypeFilters(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  function handleTypeSelect(t: CampaignType) {
    setSelectedType(t)
    const typeConfig = CAMPAIGN_TYPES.find((tc) => tc.type === t)
    setName(`${t} — ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`)
    setMessage(typeConfig?.defaultMessage ?? '')
    setStep(2)
  }

  async function handleLaunch() {
    if (!practiceId || !selectedType) return
    setSaving(true)
    try {
      const scheduledAt =
        scheduleMode === 'scheduled' ? (scheduleDate ? `${scheduleDate}T10:00:00.000Z` : null)
        : scheduleMode === 'staggered' ? (staggerStartDate ? `${staggerStartDate}T10:00:00.000Z` : null)
        : null

      const { data: campaignRow, error: campaignError } = await supabase
        .from('campaigns')
        .insert({
          practice_id: practiceId,
          name,
          type: selectedType,
          status: scheduleMode === 'now' ? 'sent' : 'scheduled',
          scheduled_at: scheduledAt,
          sent_at: scheduleMode === 'now' ? new Date().toISOString() : null,
        })
        .select('id')
        .single()

      if (campaignError || !campaignRow) throw campaignError

      // Write one campaign_message row per patient in batches of 100
      if (filteredPatients.length > 0) {
        const messages = filteredPatients.map(p => ({
          campaign_id: campaignRow.id,
          patient_id: p.id,
          practice_id: practiceId,
          message_text: message,
          channel: 'sms',
          status: 'pending',
        }))
        for (let i = 0; i < messages.length; i += 100) {
          const { error } = await supabase.from('campaign_messages').insert(messages.slice(i, i + 100))
          if (error) throw error
        }
      }

      onLaunch()
      onClose()
    } catch (err) {
      console.error('Failed to save campaign:', err instanceof Error ? err.message : 'unknown')
    } finally {
      setSaving(false)
    }
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
            <div className="space-y-5 px-6 py-5">

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
                          {p.first_name[0]}{p.last_name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold text-slate-800">{p.first_name} {p.last_name}</span>
                          <span className="ml-2 text-xs text-slate-500">{p.insurance_carrier ?? ''}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500">{p.last_frame_brand ?? ''}</span>
                          {p.last_frame_model && <span className="text-xs text-slate-400">— {p.last_frame_model}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-amber-600">This message will also go to all other patients with unused frame benefits.</p>
                </div>
              )}

              {/* Campaign Name */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <PenLine className="h-3.5 w-3.5 text-slate-400" />
                  Campaign Name
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. End of Year Benefits — December 2026"
                />
              </div>

              {/* SMS Composer */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-teal-600" />
                    <span className="text-sm font-semibold text-slate-700">SMS Message</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-24 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          message.length > MAX_CHARS ? 'bg-red-500' :
                          message.length > 160 ? 'bg-amber-400' : 'bg-teal-500'
                        }`}
                        style={{ width: `${Math.min((message.length / MAX_CHARS) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold tabular-nums ${
                      message.length > MAX_CHARS ? 'text-red-500' :
                      message.length > 160 ? 'text-amber-500' : 'text-slate-400'
                    }`}>
                      {message.length}/{MAX_CHARS}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <p className="mb-2 text-xs text-slate-400">Drag or click to insert patient data:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {MERGE_TAGS.map((t) => (
                        <button
                          key={t.tag}
                          type="button"
                          draggable
                          onDragStart={(e) => e.dataTransfer.setData('text/plain', t.tag)}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => tokenEditorRef.current?.insertAtCursor(t.tag)}
                          className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 shadow-sm hover:bg-teal-100 hover:border-teal-300 active:scale-95 transition-all cursor-grab active:cursor-grabbing"
                          title={`Preview: ${t.preview}`}
                        >
                          <span className="text-teal-400 leading-none">⠿</span>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <TokenEditor
                    ref={tokenEditorRef}
                    value={message}
                    onChange={setMessage}
                    placeholder="Write your message here, or drag and drop the tokens above to insert patient data like first name and benefit amounts…"
                  />

                  <div className="flex items-center gap-2.5">
                    <div className="flex gap-1">
                      <div className={`h-1 w-10 rounded-full transition-colors ${message.length > 0 ? 'bg-teal-500' : 'bg-slate-200'}`} />
                      <div className={`h-1 w-10 rounded-full transition-colors ${message.length > 160 ? 'bg-teal-500' : 'bg-slate-200'}`} />
                    </div>
                    <span className="text-xs text-slate-400">
                      {message.length <= 160
                        ? '1 segment · billed as 1 message'
                        : message.length <= 320
                        ? '2 segments · Twilio auto-splits, patients see one message'
                        : 'Too long — stay under 320 characters'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live SMS Preview */}
              {message && (
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-slate-100" />
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Live Preview</span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-100 to-slate-50 p-5">
                    <div className="mx-auto max-w-[260px]">
                      <div className="rounded-2xl bg-white shadow-lg border border-slate-200 overflow-hidden">
                        <div className="border-b border-slate-100 bg-white px-4 py-2.5 flex items-center gap-2.5">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white shadow-sm">P</div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800 leading-tight">Your Practice</p>
                            <p className="text-xs text-slate-400 leading-tight">SMS</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 px-3 py-4 min-h-[100px]">
                          <div className="flex justify-end mb-1">
                            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-teal-500 px-3 py-2 shadow-sm">
                              <p className="text-xs text-white leading-relaxed">{previewMessage(message)}</p>
                            </div>
                          </div>
                          <p className="text-center text-xs text-slate-400 mt-3">Reply STOP to opt out</p>
                        </div>
                      </div>
                      <p className="mt-2.5 text-center text-xs text-slate-500 leading-relaxed">
                        Personalized for <span className="font-semibold text-teal-600">Sarah (VSP · $150 frame)</span>
                        <br />Real amounts pulled at send time
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule */}
              <div>
                <label className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                  When to Send
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { mode: 'now' as ScheduleMode,       icon: <Zap className="h-5 w-5" />,         label: 'Send Now',   sub: 'Immediately'      },
                    { mode: 'scheduled' as ScheduleMode, icon: <CalendarDays className="h-5 w-5" />, label: 'Scheduled',  sub: 'Choose a date'    },
                    { mode: 'staggered' as ScheduleMode, icon: <Timer className="h-5 w-5" />,        label: 'Staggered',  sub: 'Spread over days' },
                  ].map((opt) => (
                    <button
                      key={opt.mode}
                      type="button"
                      onClick={() => setScheduleMode(opt.mode)}
                      className={`relative flex flex-col items-center gap-2 rounded-xl border-2 py-4 px-2 text-center transition-all ${
                        scheduleMode === opt.mode
                          ? 'border-teal-500 bg-teal-50 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`transition-colors ${scheduleMode === opt.mode ? 'text-teal-600' : 'text-slate-400'}`}>
                        {opt.icon}
                      </div>
                      <div>
                        <span className={`block text-xs font-bold ${scheduleMode === opt.mode ? 'text-teal-700' : 'text-slate-600'}`}>{opt.label}</span>
                        <span className={`text-xs ${scheduleMode === opt.mode ? 'text-teal-500' : 'text-slate-400'}`}>{opt.sub}</span>
                      </div>
                      {scheduleMode === opt.mode && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-8 rounded-t-full bg-teal-500" />
                      )}
                    </button>
                  ))}
                </div>
                {scheduleMode === 'scheduled' && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <label className="mb-1.5 block text-xs font-semibold text-slate-600">Send date</label>
                    <input
                      type="date"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                )}
                {scheduleMode === 'staggered' && (
                  <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50/50 p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">Start date</label>
                        <input type="date" className="input-field" value={staggerStartDate} onChange={(e) => setStaggerStartDate(e.target.value)} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-slate-600">Spread over</label>
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
            <div className="px-6 py-5 space-y-5">

              {/* Brand-specific option shown first */}
              {preselectedBrand && brandPatients.length > 0 && (
                <label className={`flex cursor-pointer items-center justify-between rounded-xl border-2 p-3 transition-colors ${criteria === 'all' ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${criteria === 'all' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`} />
                    <div>
                      <span className="text-sm font-semibold text-slate-700">{preselectedBrand} patients + unused benefits</span>
                      <p className="text-xs text-slate-400 mt-0.5">Prioritizes {preselectedBrand} purchasers, includes all with frame benefits</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">{brandPatients.length} brand matches</span>
                  <input type="radio" className="sr-only" checked={criteria === 'all'} onChange={() => setCriteria('all')} />
                </label>
              )}

              {/* Primary audience */}
              <div>
                <p className="mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Primary Audience</p>

                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium text-slate-400">By benefit status</p>
                  <div className="space-y-1.5">
                    {criteriaOptions.filter(o => o.group === 'General').map((opt) => (
                      <label key={opt.key} className={`flex cursor-pointer items-center justify-between rounded-lg border p-2.5 transition-colors ${criteria === opt.key ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                        <div className="flex items-center gap-2.5">
                          <div className={`h-3.5 w-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${criteria === opt.key ? 'border-teal-600 bg-teal-600' : 'border-slate-300'}`} />
                          <span className="text-sm text-slate-700">{opt.label}</span>
                        </div>
                        <span className={`text-xs font-semibold tabular-nums ${criteria === opt.key ? 'text-teal-700' : 'text-slate-400'}`}>
                          {loadingData ? '…' : opt.reach.toLocaleString()}
                        </span>
                        <input type="radio" className="sr-only" checked={criteria === opt.key} onChange={() => setCriteria(opt.key)} />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-slate-400">By last visit</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {criteriaOptions.filter(o => o.group === 'Recency').map((opt) => (
                      <label key={opt.key} className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 transition-colors ${criteria === opt.key ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                        <div className={`h-3.5 w-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${criteria === opt.key ? 'border-teal-600 bg-teal-600' : 'border-slate-300'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-700 truncate">{opt.label.replace('Last visit more than ', '').replace(' ago', '')}</p>
                          <p className={`text-xs font-semibold tabular-nums ${criteria === opt.key ? 'text-teal-700' : 'text-slate-400'}`}>
                            {loadingData ? '…' : opt.reach.toLocaleString()} patients
                          </p>
                        </div>
                        <input type="radio" className="sr-only" checked={criteria === opt.key} onChange={() => setCriteria(opt.key)} />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Refine audience</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400">optional</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {/* Carrier filter */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-600">Filter by insurance carrier</p>
                <div className="flex flex-wrap gap-2">
                  {['VSP', 'EyeMed', 'Davis Vision', 'Spectera'].map((carrier) => (
                    <button
                      key={carrier}
                      type="button"
                      onClick={() => toggleCarrier(carrier)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        carrierFilters.includes(carrier)
                          ? 'border-blue-400 bg-blue-500 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      {carrier}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  {carrierFilters.length === 0 ? 'All carriers included — click to limit to specific plans.' : `Showing ${carrierFilters.join(', ')} patients only.`}
                </p>
              </div>

              {/* Patient type filter */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-600">Filter by patient type</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'cl_wearer',   label: 'Contact Lens Wearers' },
                    { key: 'luxury',      label: 'Luxury Frame Buyers'  },
                    { key: 'sunglasses',  label: 'Sunglass Buyers'      },
                    { key: 'second_pair', label: 'Second Pair Ready'    },
                    { key: 'family',      label: 'Family / Dependents'  },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => toggleType(t.key)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                        typeFilters.includes(t.key)
                          ? 'border-violet-400 bg-violet-500 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum benefit */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-600">Minimum benefit remaining</p>
                <div className="grid grid-cols-4 gap-2">
                  {[{ v: 0, label: 'Any' }, { v: 50, label: '$50+' }, { v: 100, label: '$100+' }, { v: 150, label: '$150+' }].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setMinBenefit(opt.v)}
                      className={`rounded-lg border py-2 text-xs font-bold transition-all ${
                        minBenefit === opt.v
                          ? 'border-emerald-400 bg-emerald-500 text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-slate-400">Only send to patients with at least this much in unused frame or contact lens benefits.</p>
              </div>

              {/* Reach summary */}
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Users className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-teal-800">
                      {loadingData ? 'Loading patient data…' : `${estimatedReach.toLocaleString()} patients will receive this campaign`}
                    </p>
                    {!loadingData && (carrierFilters.length > 0 || typeFilters.length > 0 || minBenefit > 0) && (
                      <p className="text-xs text-teal-600 mt-0.5">
                        Filtered from {baseReach.toLocaleString()} based on your refinements
                      </p>
                    )}
                  </div>
                </div>

                {/* Active filter tags */}
                {(carrierFilters.length > 0 || typeFilters.length > 0 || minBenefit > 0) && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {carrierFilters.map(c => (
                      <span key={c} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        {c}
                        <button onClick={() => toggleCarrier(c)} className="text-blue-400 hover:text-blue-600">×</button>
                      </span>
                    ))}
                    {typeFilters.map(t => {
                      const labels: Record<string, string> = { cl_wearer: 'CL Wearers', luxury: 'Luxury Buyers', sunglasses: 'Sunglass Buyers', second_pair: 'Second Pair', family: 'Family' }
                      return (
                        <span key={t} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                          {labels[t] ?? t}
                          <button onClick={() => toggleType(t)} className="text-violet-400 hover:text-violet-600">×</button>
                        </span>
                      )
                    })}
                    {minBenefit > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        ${minBenefit}+ benefit
                        <button onClick={() => setMinBenefit(0)} className="text-emerald-400 hover:text-emerald-600">×</button>
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between border-t border-teal-200 pt-3">
                  <span className="text-xs text-teal-600">Est. optical revenue</span>
                  <span className="text-sm font-bold text-teal-800">${(Math.round(estimatedReach * EST_BOOKING_RATE) * EST_AVG_TRANSACTION).toLocaleString()}</span>
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
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {saving ? 'Saving…' : scheduleMode === 'now' ? 'Launch Campaign' : scheduleMode === 'staggered' ? 'Start Staggered Send' : 'Schedule Campaign'}
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
          {campaign.message ? (
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
          ) : (
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
              <p className="text-xs text-slate-400">Message template stored per patient — open a campaign from the Campaigns page to see details.</p>
            </div>
          )}

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
  const { user } = useAuth()
  const [practiceId, setPracticeId] = useState<string | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loadingCampaigns, setLoadingCampaigns] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [preselectedType, setPreselectedType] = useState<CampaignType | undefined>(undefined)
  const [preselectedBrand, setPreselectedBrand] = useState<string | undefined>(undefined)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)

  // Resolve practice_id once on mount
  useEffect(() => {
    async function resolve() {
      if (!user) return
      const { data } = await supabase
        .from('users')
        .select('practice_id')
        .eq('id', user.id)
        .single()
      if (data?.practice_id) setPracticeId(data.practice_id)
    }
    resolve()
  }, [user])

  // Load campaigns from Supabase
  useEffect(() => {
    async function loadCampaigns(pid: string) {
      setLoadingCampaigns(true)
      try {
        const { data: rows } = await supabase
          .from('campaigns')
          .select('id, name, type, status, created_at, scheduled_at, sent_at')
          .eq('practice_id', pid)
          .order('created_at', { ascending: false })

        if (!rows) { setLoadingCampaigns(false); return }

        // Count messages per campaign for patientsReached
        const campaignIds = rows.map(r => r.id)
        const msgCounts: Record<string, number> = {}
        if (campaignIds.length > 0) {
          const { data: msgs } = await supabase
            .from('campaign_messages')
            .select('campaign_id')
            .in('campaign_id', campaignIds)
          for (const m of (msgs ?? [])) {
            msgCounts[m.campaign_id] = (msgCounts[m.campaign_id] || 0) + 1
          }
        }

        const mapped: Campaign[] = rows.map(row => ({
          id: row.id,
          name: row.name,
          type: (row.type as CampaignType) || 'Custom Campaign',
          status: dbStatusToUi(row.status ?? 'draft'),
          message: '',
          patientsReached: msgCounts[row.id] || 0,
          smsDelivered: 0,
          smsFailed: 0,
          smsReplied: 0,
          appointmentsBooked: 0,
          revenueAttributed: 0,
          date: row.sent_at
            ? row.sent_at.split('T')[0]
            : row.scheduled_at
            ? row.scheduled_at.split('T')[0]
            : row.created_at.split('T')[0],
          patients: [],
        }))
        setCampaigns(mapped)
      } finally {
        setLoadingCampaigns(false)
      }
    }

    if (practiceId) loadCampaigns(practiceId)
  }, [practiceId, reloadKey])

  // Open modal from router state (e.g. Dashboard quick-launch)
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
          <CardDescription>
            {loadingCampaigns ? 'Loading…' : `${campaigns.length} campaign${campaigns.length !== 1 ? 's' : ''} total`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loadingCampaigns ? (
            <div className="px-6 py-8 text-center text-sm text-slate-400">Loading campaigns…</div>
          ) : campaigns.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-slate-500">No campaigns yet.</p>
              <p className="text-xs text-slate-400 mt-1">Click "New Campaign" above to create your first one.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {campaigns.map((campaign) => (
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showModal && (
        <NewCampaignModal
          practiceId={practiceId}
          onClose={() => { setShowModal(false); setPreselectedType(undefined); setPreselectedBrand(undefined) }}
          onLaunch={() => setReloadKey(k => k + 1)}
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
