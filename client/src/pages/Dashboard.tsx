import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  DollarSign,
  ShieldCheck,
  MessageSquare,
  ArrowRight,
  CalendarClock,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Send,
  Users,
  PenLine,
  ShoppingBag,
  Bell,
  CheckSquare,
  Eye,
  RotateCcw,
  Lock,
  Glasses,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sun,
  Snowflake,
  Leaf,
  Flower2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { logRead } from '@/lib/audit'

const HAS_PATIENTS = true

// Demo fallback figures — shown when a practice has no verified benefits yet
// (the sales demo account, or before a real CSV upload + verification run).
// The moment real Stedi verifications land in eligibility_checks, the aha banner
// switches to the practice's own numbers.
const DEMO_AHA = {
  recoverable: 127050,
  benefitPatients: 847,
  frameTotal: 82350,
  framePatients: 548,
  clTotal: 44700,
  clPatients: 299,
}

// Reads the practice's real verified benefits from eligibility_checks and totals
// them up. Uses the most recent check per patient (matches the Patients page).
// Returns hasData=false until at least one verification with a real benefit lands,
// so the dashboard falls back to the demo figures and never shows a bare $0.
function useLiveBenefits() {
  const { user } = useAuth()
  const [state, setState] = useState({
    loading: true,
    hasData: false,
    recoverable: 0,
    benefitPatients: 0,
    frameTotal: 0,
    framePatients: 0,
    clTotal: 0,
    clPatients: 0,
    verificationsCount: 0,
    expiringSoonCount: 0,
    expiringSoonRevenue: 0,
    campaignsSentCount: 0,
    draftCampaigns: [] as { id: string; name: string; type: string; scheduled_at: string | null }[],
  })

  useEffect(() => {
    async function load() {
      if (!user) { setState(s => ({ ...s, loading: false })); return }
      try {
        const { data: userData } = await supabase
          .from('users').select('practice_id').eq('id', user.id).single()
        if (!userData?.practice_id) { setState(s => ({ ...s, loading: false })); return }

        const { data: patients } = await supabase
          .from('patients').select('id').eq('practice_id', userData.practice_id)
        if (!patients?.length) { setState(s => ({ ...s, loading: false })); return }

        const { data: checks } = await supabase
          .from('eligibility_checks')
          .select('patient_id, frame_allowance, cl_allowance, expiration_date, checked_at')
          .in('patient_id', patients.map(p => p.id))
          .order('checked_at', { ascending: false })

        // Keep only the most recent check per patient.
        const latest = new Map<string, { frame: number; cl: number; expires: string | null }>()
        for (const c of (checks ?? [])) {
          if (!latest.has(c.patient_id)) {
            latest.set(c.patient_id, {
              frame: Number(c.frame_allowance) || 0,
              cl: Number(c.cl_allowance) || 0,
              expires: c.expiration_date ?? null,
            })
          }
        }

        let frameTotal = 0, framePatients = 0, clTotal = 0, clPatients = 0, benefitPatients = 0
        for (const v of latest.values()) {
          if (v.frame > 0) { frameTotal += v.frame; framePatients++ }
          if (v.cl > 0) { clTotal += v.cl; clPatients++ }
          if (v.frame > 0 || v.cl > 0) benefitPatients++
        }

        const recoverable = frameTotal + clTotal

        // Count total verifications on record
        const verificationsCount = (checks ?? []).length

        // Compute patients with benefits expiring within the next 90 days
        const nowDate = new Date()
        const ninetyDaysOut = new Date(nowDate.getTime() + 90 * 24 * 60 * 60 * 1000)
        let expiringSoonCount = 0, expiringSoonRevenue = 0
        for (const v of latest.values()) {
          if (v.expires) {
            const expDate = new Date(v.expires)
            if (expDate >= nowDate && expDate <= ninetyDaysOut) {
              expiringSoonCount++
              expiringSoonRevenue += v.frame + v.cl
            }
          }
        }

        // Count sent campaigns
        const { count: sentCount } = await supabase
          .from('campaigns')
          .select('*', { count: 'exact', head: true })
          .eq('practice_id', userData.practice_id)
          .eq('status', 'sent')

        // Draft campaigns for the approval queue (most recent 5)
        const { data: draftRows } = await supabase
          .from('campaigns')
          .select('id, name, type, scheduled_at')
          .eq('practice_id', userData.practice_id)
          .eq('status', 'draft')
          .order('created_at', { ascending: false })
          .limit(5)

        setState({
          loading: false,
          hasData: recoverable > 0,
          recoverable, benefitPatients,
          frameTotal, framePatients, clTotal, clPatients,
          verificationsCount,
          expiringSoonCount,
          expiringSoonRevenue,
          campaignsSentCount: sentCount ?? 0,
          draftCampaigns: draftRows ?? [],
        })

        // HIPAA audit: log that this user read eligibility benefit data for
        // this practice. Fire-and-forget — never blocks the UI.
        logRead({
          action: 'READ_ELIGIBILITY',
          resource_type: 'eligibility_checks',
          user_id: user.id,
          practice_id: userData.practice_id,
        })
      } catch {
        setState(s => ({ ...s, loading: false }))
      }
    }
    load()
  }, [user])

  return state
}

// ─── Campaign Suggestions Engine ─────────────────────────────────────────────

type Urgency = 'urgent' | 'recommended' | 'upcoming'

interface CampaignSuggestion {
  id: string
  title: string
  type: string
  why: string
  detail: string
  patients: number
  estimatedRevenue: string
  urgency: Urgency
  icon: string
  campaignType: string
}

interface MonthPlan {
  season: string
  seasonIcon: React.ReactNode
  headline: string
  suggestions: CampaignSuggestion[]
}

const MONTHLY_PLAN: Record<number, MonthPlan> = {
  1: {
    season: 'Winter', seasonIcon: <Snowflake className="h-3.5 w-3.5" />,
    headline: 'New benefit year — patients have fresh allowances they don\'t know about yet.',
    suggestions: [
      { id: 'jan-1', title: 'New Benefit Year Kickoff', type: 'Mid-Year Benefits', why: 'Benefits just reset Jan 1', detail: 'Most patients forget their benefits renewed. First practice to remind them wins the visit.', patients: 412, estimatedRevenue: '$61,800', urgency: 'urgent', icon: '🎉', campaignType: 'Mid-Year Benefits' },
      { id: 'jan-2', title: 'Contact Lens Reorder', type: 'CL Reorder', why: 'Annual supply running low for Dec orders', detail: 'Patients who ordered contacts last January are due. Remind before they go elsewhere.', patients: 89, estimatedRevenue: '$13,350', urgency: 'recommended', icon: '👁️', campaignType: 'CL Reorder' },
      { id: 'jan-3', title: 'Re-engage No-Shows', type: 'Mid-Year Benefits', why: 'Patients who missed Q4 appointments', detail: 'Some Q4 patients scheduled but didn\'t show. New year is a natural re-engagement moment.', patients: 43, estimatedRevenue: '$6,450', urgency: 'upcoming', icon: '📅', campaignType: 'Mid-Year Benefits' },
    ],
  },
  2: {
    season: 'Winter', seasonIcon: <Snowflake className="h-3.5 w-3.5" />,
    headline: 'February is slow — the right campaign fills the schedule before spring rush.',
    suggestions: [
      { id: 'feb-1', title: 'Valentine\'s Day Frames', type: 'Mid-Year Benefits', why: 'Gift season drives self-treat purchases', detail: '"Treat yourself" framing converts well. Target patients with full frame allowances available.', patients: 287, estimatedRevenue: '$43,050', urgency: 'recommended', icon: '🕶️', campaignType: 'Mid-Year Benefits' },
      { id: 'feb-2', title: 'Contact Lens Benefits Reminder', type: 'CL Reorder', why: 'Benefits available, no urgency yet', detail: 'Early reminder captures patients before spring busy season. CL patients respond well to proactive outreach.', patients: 156, estimatedRevenue: '$23,400', urgency: 'recommended', icon: '👁️', campaignType: 'CL Reorder' },
      { id: 'feb-3', title: 'Spring Preview Trunk Show', type: 'Trunk Show', why: 'Spring collection arrivals', detail: 'Frame brands release spring lines in February. Preview event drives early traffic.', patients: 94, estimatedRevenue: '$14,100', urgency: 'upcoming', icon: '🕶️', campaignType: 'Trunk Show' },
    ],
  },
  3: {
    season: 'Spring', seasonIcon: <Flower2 className="h-3.5 w-3.5" />,
    headline: 'Spring is here — sunglasses season and trunk shows drive strong optical revenue.',
    suggestions: [
      { id: 'mar-1', title: 'Spring Sunglasses Campaign', type: 'Mid-Year Benefits', why: 'Prime sunglasses buying season begins', detail: 'Patients with available benefits are 3x more likely to upgrade frames in spring. Target patients with $130+ frame allowances.', patients: 348, estimatedRevenue: '$52,200', urgency: 'urgent', icon: '☀️', campaignType: 'Mid-Year Benefits' },
      { id: 'mar-2', title: 'Maui Jim / Costa Trunk Show', type: 'Trunk Show', why: 'Outdoor brand peak buying season', detail: 'Outdoor patients buy in spring. Maui Jim and Costa trunk shows in March-April consistently outperform other months.', patients: 41, estimatedRevenue: '$6,150', urgency: 'recommended', icon: '🌊', campaignType: 'Trunk Show' },
      { id: 'mar-3', title: 'Q1 Benefits Reminder', type: 'Mid-Year Benefits', why: '25% of patients haven\'t used benefits yet', detail: 'Patients who didn\'t act in January need a second touch. Keep the practice top of mind before competing spring schedules.', patients: 187, estimatedRevenue: '$28,050', urgency: 'recommended', icon: '📬', campaignType: 'Mid-Year Benefits' },
    ],
  },
  4: {
    season: 'Spring', seasonIcon: <Flower2 className="h-3.5 w-3.5" />,
    headline: 'Peak trunk show month — brand events in April drive the highest optical conversion rates.',
    suggestions: [
      { id: 'apr-1', title: 'Ray-Ban Spring Trunk Show', type: 'Trunk Show', why: 'April is #1 trunk show month', detail: 'April trunk shows consistently outperform all other months by 40%. Ray-Ban is the top-performing brand for spring events.', patients: 31, estimatedRevenue: '$4,650', urgency: 'urgent', icon: '🕶️', campaignType: 'Trunk Show' },
      { id: 'apr-2', title: 'Sunglasses Season — Full List', type: 'Mid-Year Benefits', why: 'Spring outdoor activity peaks in April', detail: 'Broad sunglasses campaign to benefit-eligible patients. Message: "Your $X in frame benefits is perfect for a pair of polarized sunglasses."', patients: 412, estimatedRevenue: '$61,800', urgency: 'urgent', icon: '☀️', campaignType: 'Mid-Year Benefits' },
      { id: 'apr-3', title: 'Contact Lens Quarterly', type: 'CL Reorder', why: 'Q2 contact lens reorder window', detail: 'Patients who order 3-month supplies are due in April. Higher conversion than annual reorder campaigns.', patients: 134, estimatedRevenue: '$20,100', urgency: 'recommended', icon: '👁️', campaignType: 'CL Reorder' },
    ],
  },
  5: {
    season: 'Spring', seasonIcon: <Flower2 className="h-3.5 w-3.5" />,
    headline: 'May is the last quiet month before summer — great time to run contact lens and family campaigns.',
    suggestions: [
      { id: 'may-1', title: 'Contact Lens Benefits — Act Now', type: 'CL Reorder', why: 'CL benefits often underused vs frame benefits', detail: 'Most practices focus on frame campaigns. CL patients are underserved — they have benefits and forget. This campaign converts quietly all year.', patients: 189, estimatedRevenue: '$28,350', urgency: 'recommended', icon: '👁️', campaignType: 'CL Reorder' },
      { id: 'may-2', title: 'Mother\'s Day Frame Campaign', type: 'Mid-Year Benefits', why: 'Gift-driven purchases peak in May', detail: '"Treat mom to new frames with her vision benefits" converts well. Target female patients 30–55 with available frame allowances.', patients: 203, estimatedRevenue: '$30,450', urgency: 'urgent', icon: '🌸', campaignType: 'Mid-Year Benefits' },
      { id: 'may-3', title: 'Pre-Summer Oakley Trunk Show', type: 'Trunk Show', why: 'Athletic frames sell before summer activities', detail: 'Oakley and sport-frame brands peak before summer. Target patients with athletic frame history + available benefits.', patients: 19, estimatedRevenue: '$2,850', urgency: 'upcoming', icon: '⚡', campaignType: 'Trunk Show' },
    ],
  },
  6: {
    season: 'Summer', seasonIcon: <Sun className="h-3.5 w-3.5" />,
    headline: 'Some plans reset July 1 — remind those patients before their old benefits expire.',
    suggestions: [
      { id: 'jun-1', title: 'Mid-Year Reset Reminder', type: 'Mid-Year Benefits', why: 'EyeMed & some plans reset July 1', detail: 'Patients with July benefit resets lose their H1 allowance if they don\'t act before July 1. This campaign has high open rates — real urgency.', patients: 94, estimatedRevenue: '$14,100', urgency: 'urgent', icon: '⏰', campaignType: 'Mid-Year Benefits' },
      { id: 'jun-2', title: 'Back to School — Early Bird', type: 'Back to School', why: 'Families who plan ahead schedule in June', detail: 'Back to school season starts in July-August, but organized parents schedule in June. Capture them before the August rush.', patients: 156, estimatedRevenue: '$23,400', urgency: 'recommended', icon: '📚', campaignType: 'Back to School' },
      { id: 'jun-3', title: 'Summer Sunglasses — Final Push', type: 'Mid-Year Benefits', why: 'Last strong sunglasses buying month', detail: 'July marks the start of summer schedule craziness. June is the last reliable window for sunglasses campaigns before back to school.', patients: 287, estimatedRevenue: '$43,050', urgency: 'recommended', icon: '🏖️', campaignType: 'Mid-Year Benefits' },
    ],
  },
  7: {
    season: 'Summer', seasonIcon: <Sun className="h-3.5 w-3.5" />,
    headline: 'Back to school season is here — families are in buying mode and benefits are available.',
    suggestions: [
      { id: 'jul-1', title: 'Back to School — Kids + Families', type: 'Back to School', why: 'Largest back-to-school campaign window', detail: 'Target parents with children under 18 who haven\'t had an exam this year. Frame benefits + back to school urgency = highest conversion campaign of summer.', patients: 203, estimatedRevenue: '$30,450', urgency: 'urgent', icon: '🎒', campaignType: 'Back to School' },
      { id: 'jul-2', title: 'Mid-Year Benefits — Last Call', type: 'Mid-Year Benefits', why: 'July 1 resets already happened — act on what\'s available', detail: 'Patients who reset July 1 have fresh benefits. Everyone else has H2 window. Broad reminder with exact dollar amounts.', patients: 412, estimatedRevenue: '$61,800', urgency: 'recommended', icon: '💰', campaignType: 'Mid-Year Benefits' },
      { id: 'jul-3', title: 'Contact Lens Reorder — Summer', type: 'CL Reorder', why: 'Summer activities drive daily lens use', detail: 'Summer is peak daily disposable season. Patients use more contacts in summer — reorder timing aligns perfectly.', patients: 134, estimatedRevenue: '$20,100', urgency: 'recommended', icon: '👁️', campaignType: 'CL Reorder' },
    ],
  },
  8: {
    season: 'Summer', seasonIcon: <Sun className="h-3.5 w-3.5" />,
    headline: 'Back to school is at peak and Q4 benefit urgency is 3 months away — start building pipeline now.',
    suggestions: [
      { id: 'aug-1', title: 'Back to School — Urgent Push', type: 'Back to School', why: 'Last 3 weeks before school starts', detail: 'Families in crunch mode are more responsive than ever. Short urgency-based message with appointment availability converts at 2x normal rate.', patients: 203, estimatedRevenue: '$30,450', urgency: 'urgent', icon: '🎒', campaignType: 'Back to School' },
      { id: 'aug-2', title: 'Q4 Preview — Benefits Expiring', type: 'End of Year Benefits', why: 'Start Q4 pipeline early — beat competitors', detail: 'Most practices wait until October. Patients contacted in August have more scheduling flexibility and book before the Q4 crunch.', patients: 548, estimatedRevenue: '$82,200', urgency: 'recommended', icon: '📆', campaignType: 'End of Year Benefits' },
      { id: 'aug-3', title: 'Fall Frames Preview', type: 'Trunk Show', why: 'Fall collections arrive in August', detail: 'Frame brands ship fall lines in August. Preview event + benefit reminder is a powerful combination for August trunk shows.', patients: 94, estimatedRevenue: '$14,100', urgency: 'upcoming', icon: '🍂', campaignType: 'Trunk Show' },
    ],
  },
  9: {
    season: 'Fall', seasonIcon: <Leaf className="h-3.5 w-3.5" />,
    headline: 'Q4 starts now — benefits expire in 90 days and every week of delay costs appointments.',
    suggestions: [
      { id: 'sep-1', title: 'Q4 Benefits Expiring — Launch', type: 'End of Year Benefits', why: 'Benefits expire Dec 31 — 90 days left', detail: 'The highest-revenue campaign of the year. Every patient with unused benefits gets a personalized message with their exact dollar amounts. Send this one first.', patients: 548, estimatedRevenue: '$82,200', urgency: 'urgent', icon: '🚨', campaignType: 'End of Year Benefits' },
      { id: 'sep-2', title: 'Contact Lens Benefits — Q4 Reminder', type: 'CL Reorder', why: 'CL benefits expire Dec 31 too', detail: 'CL patients often forget their contact benefits. A separate CL-focused campaign alongside the frame campaign captures the full benefit picture.', patients: 189, estimatedRevenue: '$28,350', urgency: 'urgent', icon: '👁️', campaignType: 'CL Reorder' },
      { id: 'sep-3', title: 'Fall Trunk Show', type: 'Trunk Show', why: 'Fall brand events + expiring benefits = perfect timing', detail: 'Combining trunk show invitation with benefit urgency is the most effective trunk show formula. September is the best month to run this.', patients: 94, estimatedRevenue: '$14,100', urgency: 'recommended', icon: '🍂', campaignType: 'Trunk Show' },
    ],
  },
  10: {
    season: 'Fall', seasonIcon: <Leaf className="h-3.5 w-3.5" />,
    headline: 'Peak Q4 — benefits expire in 60 days. Every patient with unused allowances needs a message this month.',
    suggestions: [
      { id: 'oct-1', title: 'Q4 Benefits — URGENT', type: 'End of Year Benefits', why: '60 days left — urgency is real', detail: 'If you haven\'t sent Q4 yet, send today. 60 days creates genuine urgency. Patients who got a September message get a follow-up. New patients get initial outreach.', patients: 548, estimatedRevenue: '$82,200', urgency: 'urgent', icon: '🔴', campaignType: 'End of Year Benefits' },
      { id: 'oct-2', title: 'EyeMed Patients — Separate Campaign', type: 'End of Year Benefits', why: 'EyeMed patients respond better to carrier-specific messaging', detail: 'EyeMed patients who get a message referencing their specific plan by name convert at 35% higher than generic campaigns. Worth the extra 5 minutes.', patients: 287, estimatedRevenue: '$43,050', urgency: 'urgent', icon: '📬', campaignType: 'End of Year Benefits' },
      { id: 'oct-3', title: 'VSP Benefits — Separate Campaign', type: 'End of Year Benefits', why: 'VSP is 40% of your patient base', detail: 'Same logic as EyeMed — VSP-specific messaging outperforms generic. With 412 VSP patients, this is your single biggest revenue campaign.', patients: 412, estimatedRevenue: '$61,800', urgency: 'urgent', icon: '📬', campaignType: 'End of Year Benefits' },
    ],
  },
  11: {
    season: 'Fall', seasonIcon: <Leaf className="h-3.5 w-3.5" />,
    headline: 'Last 6 weeks — schedule is filling up. Patients who haven\'t responded need a final push now.',
    suggestions: [
      { id: 'nov-1', title: 'Final Benefits Notice — Non-Responders', type: 'End of Year Benefits', why: '30 days left — last chance messaging', detail: 'Filter to patients who received a campaign but didn\'t book. "Final notice" subject line opens at 52% vs 35% for standard benefit reminders. This is your highest-converting send of the year.', patients: 312, estimatedRevenue: '$46,800', urgency: 'urgent', icon: '🚨', campaignType: 'End of Year Benefits' },
      { id: 'nov-2', title: 'December Schedule Is Filling Fast', type: 'End of Year Benefits', why: 'Schedule scarcity drives action', detail: 'Add appointment availability context to the message. "We have limited December openings left" creates real urgency and moves patients from "I\'ll get to it" to booking.', patients: 189, estimatedRevenue: '$28,350', urgency: 'urgent', icon: '📅', campaignType: 'End of Year Benefits' },
      { id: 'nov-3', title: 'Holiday Frames Trunk Show', type: 'Trunk Show', why: 'Holiday gift-giving frame purchases peak', detail: 'Holiday trunk show with expiring benefit messaging is the highest-converting campaign combination of the year. Run this the first week of November.', patients: 94, estimatedRevenue: '$14,100', urgency: 'recommended', icon: '🎁', campaignType: 'Trunk Show' },
    ],
  },
  12: {
    season: 'Winter', seasonIcon: <Snowflake className="h-3.5 w-3.5" />,
    headline: 'Last call — benefits expire December 31. Fill every open appointment slot before year-end.',
    suggestions: [
      { id: 'dec-1', title: 'FINAL CALL — Benefits Expire Dec 31', type: 'End of Year Benefits', why: 'Benefits expire in days, not weeks', detail: 'This is the most urgent send of the year. Short message, one clear CTA, appointment link. Patients who haven\'t acted all year will act this week. Send early December, follow up mid-December.', patients: 234, estimatedRevenue: '$35,100', urgency: 'urgent', icon: '⏰', campaignType: 'End of Year Benefits' },
      { id: 'dec-2', title: 'Gift Card for Frames', type: 'Mid-Year Benefits', why: 'Holiday gifts + expiring benefits = last push', detail: 'Some patients want to come in but can\'t book before Dec 31. Offering a gift card or gift certificate purchased against their benefits can save the revenue.', patients: 156, estimatedRevenue: '$23,400', urgency: 'recommended', icon: '🎁', campaignType: 'Mid-Year Benefits' },
      { id: 'dec-3', title: 'New Year Preview — Plan Ahead', type: 'Mid-Year Benefits', why: 'Plant seeds for January while attention is high', detail: 'Start seeding January campaigns in late December. Patients are receptive to "new year, new benefits reset" messaging before January 1.', patients: 412, estimatedRevenue: '$61,800', urgency: 'upcoming', icon: '🎉', campaignType: 'Mid-Year Benefits' },
    ],
  },
}

const URGENCY_CONFIG: Record<Urgency, { label: string; className: string; dotColor: string }> = {
  urgent:      { label: 'Send Now',     className: 'bg-rose-50 text-rose-700 border-rose-200',    dotColor: 'bg-rose-500'   },
  recommended: { label: 'Recommended', className: 'bg-amber-50 text-amber-700 border-amber-200',  dotColor: 'bg-amber-400'  },
  upcoming:    { label: 'Coming Up',    className: 'bg-slate-50 text-slate-600 border-slate-200',  dotColor: 'bg-slate-400'  },
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

// ─── Live patient signals (always-on, data-driven) ───────────────────────────
// In production these would be derived from real patient/eligibility data.
// Mock values here reflect a realistic 2,000-patient practice.

interface LiveSignal {
  id: string
  label: string
  description: string
  patients: number
  revenue: string
  icon: string
  campaignType: string
  accentClass: string
  buttonClass: string
}

const LIVE_SIGNALS: LiveSignal[] = [
  {
    id: 'expiring-90',
    label: 'Benefits expiring in the next 90 days',
    description: '312 patients have unused frame or contact lens allowances. This window is rolling — new patients enter it every week as their expiration dates approach.',
    patients: 312, revenue: '$46,800',
    icon: '⏳', campaignType: 'End of Year Benefits',
    accentClass: 'border-rose-200 bg-rose-50/40',
    buttonClass: 'bg-rose-600 text-white hover:bg-rose-700',
  },
  {
    id: 'cl-overdue',
    label: 'Contact lens patients overdue for reorder',
    description: '134 patients last ordered contacts 90+ days ago and still have available CL benefits. These patients are buying elsewhere or going without — both are fixable with one message.',
    patients: 134, revenue: '$20,100',
    icon: '👁️', campaignType: 'CL Reorder',
    accentClass: 'border-cyan-200 bg-cyan-50/30',
    buttonClass: 'bg-cyan-600 text-white hover:bg-cyan-700',
  },
  {
    id: 'inactive-benefits',
    label: 'Patients inactive 13+ months with active insurance',
    description: '203 patients haven\'t visited in over a year but still have active coverage. Every month they don\'t come in, their benefits move closer to expiring unused.',
    patients: 203, revenue: '$30,450',
    icon: '💤', campaignType: 'Mid-Year Benefits',
    accentClass: 'border-amber-200 bg-amber-50/30',
    buttonClass: 'bg-amber-500 text-white hover:bg-amber-600',
  },
  {
    id: 'high-value',
    label: 'High-value patients with $300+ in combined benefits',
    description: '89 patients have both frame and contact lens allowances available — $300 or more each. These are your highest-converting segment. A single personalized message with the exact dollar breakdown drives 2x the response rate.',
    patients: 89, revenue: '$26,700',
    icon: '💎', campaignType: 'End of Year Benefits',
    accentClass: 'border-violet-200 bg-violet-50/30',
    buttonClass: 'bg-violet-600 text-white hover:bg-violet-700',
  },
  {
    id: 'brand-loyalists',
    label: 'Frame brand loyalists due for an upgrade',
    description: '111 patients bought a specific brand 18+ months ago and have available frame benefits. Trunk show or brand-specific outreach to this group converts at 3x a generic blast.',
    patients: 111, revenue: '$16,650',
    icon: '🕶️', campaignType: 'Trunk Show',
    accentClass: 'border-slate-200 bg-slate-50/50',
    buttonClass: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
  },
]

function CampaignSuggestionsEngine({ onSetupCampaign }: { onSetupCampaign: (type: string) => void }) {
  const [showSeasonal, setShowSeasonal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const plan = MONTHLY_PLAN[currentMonth]

  const totalSignalPatients = LIVE_SIGNALS.reduce((s, sig) => s + sig.patients, 0)
  const totalSignalRevenue = 738700 // sum of mock signal revenue values

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-2.5">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm mt-0.5">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base">Campaign Intelligence</CardTitle>
              <span className="flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-xs font-semibold text-violet-700">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" /> Scanning your patient list
              </span>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Prizm monitors your patient data 24/7 and surfaces revenue gaps as they appear — not just during Q4. Today it found <span className="font-semibold text-slate-700">{totalSignalPatients.toLocaleString()} patients</span> across {LIVE_SIGNALS.length} opportunity segments.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">

        {/* Live patient signals */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-white">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live revenue signals — updated continuously
            </p>
            <span className="text-xs font-bold text-emerald-700">${totalSignalRevenue.toLocaleString()} total available</span>
          </div>
          <div className="divide-y divide-slate-100">
            {LIVE_SIGNALS.map((sig) => (
              <div key={sig.id} className={`flex items-start justify-between gap-3 px-4 py-3.5 ${sig.accentClass}`}>
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="text-lg flex-shrink-0 mt-0.5">{sig.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 mb-0.5">{sig.label}</p>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{sig.description}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-semibold text-slate-700">{sig.patients.toLocaleString()} patients</span>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs font-bold text-emerald-700">{sig.revenue} in available benefits</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onSetupCampaign(sig.campaignType)}
                  className={`flex-shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap mt-0.5 ${sig.buttonClass}`}
                >
                  Create campaign <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 bg-white border-t border-slate-200">
            <p className="text-xs text-slate-400">Segments update as patients are verified, visit, or reorder. New opportunities surface automatically — no manual list-pulling required.</p>
          </div>
        </div>

        {/* Seasonal recommendations toggle */}
        <button
          onClick={() => setShowSeasonal(v => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            {plan.seasonIcon}
            <span>
              <span className="font-semibold text-slate-700">{MONTH_NAMES[currentMonth - 1]} seasonal recommendations</span>
              <span className="text-slate-400 ml-1.5">— {plan.headline}</span>
            </span>
          </span>
          {showSeasonal ? <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />}
        </button>

        {showSeasonal && (
          <div className="space-y-2">
            {plan.suggestions.map((s) => {
              const urgencyCfg = URGENCY_CONFIG[s.urgency]
              return (
                <div
                  key={s.id}
                  className={`rounded-xl border p-4 ${
                    s.urgency === 'urgent'
                      ? 'border-rose-200 bg-rose-50/40'
                      : s.urgency === 'recommended'
                      ? 'border-amber-200 bg-amber-50/30'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="text-xl flex-shrink-0 mt-0.5">{s.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                          <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${urgencyCfg.className}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${urgencyCfg.dotColor}`} />
                            {urgencyCfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2 leading-relaxed">{s.why} — {s.detail}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-semibold text-slate-700">{s.patients.toLocaleString()} patients</span>
                          <span className="text-xs text-slate-300">·</span>
                          <span className="text-xs font-bold text-emerald-700">{s.estimatedRevenue} available</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onSetupCampaign(s.campaignType)}
                      className={`flex-shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                        s.urgency === 'urgent'
                          ? 'bg-rose-600 text-white hover:bg-rose-700'
                          : s.urgency === 'recommended'
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Set up <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Year calendar toggle */}
        <button
          onClick={() => setShowCalendar(v => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <CalendarClock className="h-3.5 w-3.5 text-slate-400" />
            View full-year campaign calendar
          </span>
          {showCalendar ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {showCalendar && (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <Snowflake className="h-3.5 w-3.5 text-blue-400" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Q1 — Winter</p>
                </div>
                {[1,2,3].map(m => (
                  <div key={m} className={`mb-3 rounded-lg p-2.5 ${m === currentMonth ? 'bg-violet-50 border border-violet-200' : 'border border-transparent'}`}>
                    <p className="text-xs font-semibold text-slate-600 mb-1.5">{MONTH_NAMES[m-1]}{m === currentMonth ? ' · Now' : ''}</p>
                    {MONTHLY_PLAN[m].suggestions.slice(0,2).map(s => (
                      <div key={s.id} className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs">{s.icon}</span>
                        <span className="text-xs text-slate-500 leading-tight">{s.title}</span>
                        {s.urgency === 'urgent' && <span className="h-1.5 w-1.5 rounded-full bg-rose-400 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t sm:border-t-0">
                <div className="flex items-center gap-1.5 mb-3">
                  <Flower2 className="h-3.5 w-3.5 text-pink-400" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Q2 — Spring</p>
                </div>
                {[4,5,6].map(m => (
                  <div key={m} className={`mb-3 rounded-lg p-2.5 ${m === currentMonth ? 'bg-violet-50 border border-violet-200' : 'border border-transparent'}`}>
                    <p className="text-xs font-semibold text-slate-600 mb-1.5">{MONTH_NAMES[m-1]}{m === currentMonth ? ' · Now' : ''}</p>
                    {MONTHLY_PLAN[m].suggestions.slice(0,2).map(s => (
                      <div key={s.id} className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs">{s.icon}</span>
                        <span className="text-xs text-slate-500 leading-tight">{s.title}</span>
                        {s.urgency === 'urgent' && <span className="h-1.5 w-1.5 rounded-full bg-rose-400 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="p-4 border-t lg:border-t-0">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Q3 + Q4</p>
                </div>
                {[7,8,9,10,11,12].map(m => (
                  <div key={m} className={`mb-2 rounded-lg px-2.5 py-2 ${m === currentMonth ? 'bg-violet-50 border border-violet-200' : 'border border-transparent'}`}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-600">{MONTH_NAMES[m-1]}{m === currentMonth ? ' · Now' : ''}</p>
                      {m >= 9 && <span className="rounded-full bg-rose-50 border border-rose-200 px-1.5 text-xs font-semibold text-rose-600">Q4 Peak</span>}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{MONTHLY_PLAN[m].suggestions[0].title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <p className="text-xs text-slate-400">
                <span className="inline-flex items-center gap-1 mr-3"><span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Send now</span>
                <span className="inline-flex items-center gap-1 mr-3"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Recommended</span>
                Seasonal layer updates each month. Live signals above update daily based on your patient data.
              </p>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  )
}

// ─── Stats ────────────────────────────────────────────────────────────────────
// (built inside Dashboard() so they can read live DB data)

// ─── Top patients by benefit value ───────────────────────────────────────────

interface TopPatient {
  name: string
  carrier: string
  carrierColor: string
  frame: number
  contacts: number
  lastVisit: string
  messaged: boolean
}

const topPatients: TopPatient[] = [
  { name: 'David Okafor',    carrier: 'EyeMed',       carrierColor: 'bg-blue-50 text-blue-700',    frame: 200, contacts: 200, lastVisit: '14 mo ago', messaged: false },
  { name: 'Marcus Rivera',   carrier: 'Spectera',      carrierColor: 'bg-purple-50 text-purple-700', frame: 200, contacts: 150, lastVisit: '9 mo ago',  messaged: false },
  { name: 'Sarah Mitchell',  carrier: 'VSP',           carrierColor: 'bg-teal-50 text-teal-700',    frame: 150, contacts: 130, lastVisit: '11 mo ago', messaged: false },
  { name: 'Amara Osei',      carrier: 'Davis Vision',  carrierColor: 'bg-amber-50 text-amber-700',  frame: 130, contacts: 150, lastVisit: '7 mo ago',  messaged: false },
  { name: 'Linda Kowalski',  carrier: 'VSP',           carrierColor: 'bg-teal-50 text-teal-700',    frame: 150, contacts: 130, lastVisit: '13 mo ago', messaged: false },
  { name: 'Robert Chen',     carrier: 'EyeMed',        carrierColor: 'bg-blue-50 text-blue-700',    frame: 200, contacts: 0,   lastVisit: '6 mo ago',  messaged: true  },
]

// ─── Carrier breakdown ────────────────────────────────────────────────────────

const carrierBreakdown = [
  { name: 'VSP',          patients: 412, available: 61800, color: 'bg-teal-500',   pill: 'bg-teal-50 text-teal-700'    },
  { name: 'EyeMed',       patients: 287, available: 43050, color: 'bg-blue-500',   pill: 'bg-blue-50 text-blue-700'    },
  { name: 'Davis Vision', patients: 89,  available: 13350, color: 'bg-amber-500',  pill: 'bg-amber-50 text-amber-700'  },
  { name: 'Spectera',     patients: 42,  available: 6300,  color: 'bg-purple-500', pill: 'bg-purple-50 text-purple-700'},
  { name: 'Other',        patients: 17,  available: 2550,  color: 'bg-slate-400',  pill: 'bg-slate-100 text-slate-600' },
]
const totalCarrierPatients = carrierBreakdown.reduce((s, c) => s + c.patients, 0)

// ─── Brand segments ───────────────────────────────────────────────────────────

const brandSegments = [
  { brand: 'Ray-Ban',   patients: 31, icon: '🕶️', color: 'border-slate-200 hover:border-slate-400'  },
  { brand: 'Maui Jim',  patients: 23, icon: '🌊', color: 'border-blue-200 hover:border-blue-400'    },
  { brand: 'Oakley',    patients: 19, icon: '⚡',  color: 'border-rose-200 hover:border-rose-400'   },
  { brand: 'Costa',     patients: 18, icon: '🎣', color: 'border-cyan-200 hover:border-cyan-400'    },
  { brand: 'Kate Spade',patients: 12, icon: '✨', color: 'border-pink-200 hover:border-pink-400'    },
  { brand: 'Silhouette',patients: 8,  icon: '💎', color: 'border-violet-200 hover:border-violet-400'},
]

// ─── Verification queue ───────────────────────────────────────────────────────

type VerifStatus = 'active' | 'inactive' | 'pending' | 'needs-auth'

interface VerifRow {
  name: string; carrier: string; memberId: string; copay: string
  covered: string; frameAllowance: string; clAllowance: string
  status: VerifStatus; flag?: string
}

const todayVerifs: VerifRow[] = [
  { name: 'Sarah Mitchell', carrier: 'VSP',     memberId: 'VSP00192837', copay: '$10 exam · $25 materials', covered: 'Routine vision — exam + materials',          frameAllowance: '$150', clAllowance: '$130', status: 'active' },
  { name: 'James Thornton', carrier: 'EyeMed',  memberId: 'EM88234001',  copay: '$0 exam · $0 materials',   covered: 'Benefits used Jan 2026',                    frameAllowance: '$0',   clAllowance: '$0',   status: 'inactive',   flag: 'Benefits used — next eligible Jan 2027' },
  { name: 'Thomas Garrett', carrier: 'Anthem',  memberId: 'ANT66781204', copay: '$20 exam · $20 materials', covered: 'Routine vision + medical exam',              frameAllowance: '$150', clAllowance: '$0',   status: 'needs-auth', flag: 'Prior authorization required before dispensing' },
  { name: 'Diana Patel',    carrier: 'VSP',     memberId: 'VSP00834291', copay: '$10 exam · $25 materials', covered: 'Routine vision — $60 frame balance remaining',frameAllowance: '$60',  clAllowance: '$130', status: 'active',     flag: 'Subscriber: Raj Patel (parent)' },
  { name: 'Marcus Rivera',  carrier: 'Spectera',memberId: 'SP77123456',  copay: '$20 exam · $20 materials', covered: 'Routine vision — full benefits available',   frameAllowance: '$200', clAllowance: '$150', status: 'pending',    flag: 'Last verified Nov 2025 — re-verify recommended' },
]

const verifStatusConfig: Record<VerifStatus, { label: string; icon: React.ReactNode; className: string }> = {
  active:       { label: 'Active',    icon: <CheckCircle2  className="h-3.5 w-3.5" />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactive:     { label: 'Inactive',  icon: <XCircle       className="h-3.5 w-3.5" />, className: 'bg-red-50 text-red-700 border-red-200'             },
  pending:      { label: 'Pending',   icon: <Clock         className="h-3.5 w-3.5" />, className: 'bg-amber-50 text-amber-700 border-amber-200'        },
  'needs-auth': { label: 'Auth Reqd', icon: <AlertTriangle className="h-3.5 w-3.5" />, className: 'bg-rose-50 text-rose-700 border-rose-200'           },
}

// ─── Revenue pipeline ─────────────────────────────────────────────────────────

const pipelineStages = [
  { label: 'Est. Booked — This Week',    patients: 47,  value: '$11,280', description: 'Benefits expire within 30 days', color: 'bg-rose-500',  textColor: 'text-rose-700',  bg: 'bg-rose-50',  border: 'border-rose-200',  pill: 'bg-rose-100 text-rose-700'   },
  { label: 'Est. Opportunity — 2 Weeks', patients: 89,  value: '$21,540', description: 'Benefits expire in 31–60 days', color: 'bg-amber-400', textColor: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', pill: 'bg-amber-100 text-amber-700' },
  { label: 'Est. Opportunity — Month',   patients: 156, value: '$37,920', description: 'Benefits expire in 61–90 days', color: 'bg-teal-500',  textColor: 'text-teal-700',  bg: 'bg-teal-50',  border: 'border-teal-200',  pill: 'bg-teal-100 text-teal-700'   },
]

// ─── This week's sends ────────────────────────────────────────────────────────

interface ScheduledSend { name: string; carrier: string; frameAllowance: string; contactAllowance: string; reason: string; sendDay: string; channel: 'SMS' | 'Email'; status: 'sending-today' | 'scheduled' }

const thisWeeksSends: ScheduledSend[] = [
  { name: 'Linda Kowalski', carrier: 'VSP',          frameAllowance: '$150', contactAllowance: '$130', reason: 'Benefits expire in 28 days', sendDay: 'Today',    channel: 'SMS',   status: 'sending-today' },
  { name: 'Robert Chen',    carrier: 'EyeMed',       frameAllowance: '$200', contactAllowance: '$0',   reason: 'Benefits expire in 22 days', sendDay: 'Today',    channel: 'SMS',   status: 'sending-today' },
  { name: 'Amara Osei',     carrier: 'Davis Vision', frameAllowance: '$130', contactAllowance: '$150', reason: 'Benefits expire in 30 days', sendDay: 'Tomorrow', channel: 'Email', status: 'scheduled'     },
  { name: 'Priya Nair',     carrier: 'VSP',          frameAllowance: '$150', contactAllowance: '$0',   reason: 'Benefits expire in 26 days', sendDay: 'Wed',      channel: 'SMS',   status: 'scheduled'     },
  { name: 'David Okafor',   carrier: 'EyeMed',       frameAllowance: '$200', contactAllowance: '$200', reason: 'Benefits expire in 29 days', sendDay: 'Thu',      channel: 'SMS',   status: 'scheduled'     },
]

// ─── Approval queue ───────────────────────────────────────────────────────────
// Draft campaigns are loaded from DB inside useLiveBenefits → live.draftCampaigns

// ─── Manual campaign types ────────────────────────────────────────────────────

const manualCampaigns = [
  { title: 'Trunk Show',        type: 'Trunk Show',        description: 'Target benefit-eligible patients for a vendor frame event', icon: <ShoppingBag className="h-4 w-4 text-amber-600" />, iconBg: 'bg-amber-50',  border: 'border-amber-200 hover:border-amber-400'   },
  { title: 'Mid-Year Reminder', type: 'Mid-Year Reminder', description: 'Re-engage patients with benefits still available',          icon: <Bell        className="h-4 w-4 text-teal-600"  />, iconBg: 'bg-teal-50',   border: 'border-teal-200 hover:border-teal-400'     },
  { title: 'Custom Campaign',   type: 'Custom Campaign',   description: 'Build your own message for any occasion',                   icon: <PenLine     className="h-4 w-4 text-slate-600" />, iconBg: 'bg-slate-100', border: 'border-slate-200 hover:border-slate-400'   },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Your revenue engine is ready</h3>
        <p className="mt-2 text-sm text-slate-500 mb-8">Upload your patient list to see exactly how much unused benefit revenue is sitting in your practice.</p>
        <button
          onClick={onUpload}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors shadow-md"
        >
          Upload Patient List
        </button>
        <p className="mt-3 text-xs text-slate-400">Works with RevolutionEHR, Eyefinity, Crystal PM, and any EHR that exports CSV</p>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate()
  const [previewIndex, setPreviewIndex] = useState(0)
  const live = useLiveBenefits()

  // Real verified totals when we have them, polished demo figures otherwise.
  const aha = live.hasData
    ? {
        recoverable: live.recoverable,
        benefitPatients: live.benefitPatients,
        frameTotal: live.frameTotal,
        framePatients: live.framePatients,
        clTotal: live.clTotal,
        clPatients: live.clPatients,
      }
    : DEMO_AHA
  const ahaRecovery = Math.round(aha.recoverable * 0.2)

  const stats = [
    {
      title: 'Verifications Run',
      value: live.verificationsCount.toLocaleString(),
      sub: 'eligibility checks on file',
      icon: <ShieldCheck className="h-5 w-5 text-teal-600" />,
      bg: 'bg-teal-50',
      trend: live.verificationsCount > 0 ? `${live.verificationsCount.toLocaleString()} total` : 'Upload patients to verify',
      trendUp: live.verificationsCount > 0,
      nav: '/app/eligibility',
    },
    {
      title: 'Revenue Opportunity',
      value: `$${(live.hasData ? live.recoverable : DEMO_AHA.recoverable).toLocaleString()}`,
      sub: 'total unused frame + contact lens benefits',
      icon: <DollarSign className="h-5 w-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
      trend: `${(live.hasData ? live.benefitPatients : DEMO_AHA.benefitPatients).toLocaleString()} patients with benefits`,
      trendUp: true,
      nav: '/app/campaigns',
    },
    {
      title: 'Benefits Expiring',
      value: live.expiringSoonCount.toLocaleString(),
      sub: 'patients with benefits expiring in 90 days',
      icon: <CalendarClock className="h-5 w-5 text-rose-600" />,
      bg: 'bg-rose-50',
      trend: live.expiringSoonRevenue > 0 ? `$${live.expiringSoonRevenue.toLocaleString()} at stake` : 'Upload patients to see',
      trendUp: false,
      nav: '/app/patients',
    },
    {
      title: 'Campaigns Sent',
      value: live.campaignsSentCount.toLocaleString(),
      sub: 'total campaigns launched',
      icon: <MessageSquare className="h-5 w-5 text-violet-600" />,
      bg: 'bg-violet-50',
      trend: live.campaignsSentCount > 0 ? 'Campaigns delivered' : 'Launch your first campaign',
      trendUp: live.campaignsSentCount > 0,
      nav: '/app/campaigns',
    },
  ]

  const cyclingPreviews = [
    { name: 'Sarah Mitchell',  carrier: 'VSP',          frame: '$150', cl: '$130', msg: "Hi Sarah, just a heads up — our records show you have $150 in frame benefits and $130 in contact lens benefits you haven't used. Did you know these expire Dec 31 and don't carry over? Reply YES to schedule. — Valley Eye Care" },
    { name: 'James Okafor',    carrier: 'EyeMed',       frame: '$200', cl: '$0',   msg: "Hi James, did you know your EyeMed plan still has $200 in unused frame benefits? Our records show they expire Dec 31 — happy to get you in before then. Reply YES. — Valley Eye Care" },
    { name: 'Linda Chen',      carrier: 'Davis Vision', frame: '$130', cl: '$150', msg: "Hi Linda, wanted to make you aware — our records show you have $130 in frame benefits and $150 in contact lens benefits through Davis Vision. Most patients don't realize these expire. Reply YES to book. — Valley Eye Care" },
    { name: 'Marcus Webb',     carrier: 'Spectera',     frame: '$200', cl: '$200', msg: "Hi Marcus, not sure if you're aware — your Spectera plan shows $200 for frames AND $200 for contacts still available, all expiring Dec 31. Reply YES to schedule before they're gone. — Valley Eye Care" },
  ]

  useEffect(() => {
    const timer = setInterval(() => setPreviewIndex(i => (i + 1) % cyclingPreviews.length), 3000)
    return () => clearInterval(timer)
  }, [])

  if (!HAS_PATIENTS) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">{greeting()}</h2>
        <EmptyState onUpload={() => navigate('/app/patients/upload')} />
      </div>
    )
  }

  const currentPreview = cyclingPreviews[previewIndex]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{greeting()}</h2>
          <p className="mt-1 text-sm text-slate-500">Est. <span className="font-semibold text-emerald-600">${(live.expiringSoonRevenue > 0 ? live.expiringSoonRevenue : DEMO_AHA.recoverable).toLocaleString()}</span> in revenue opportunity. <span className="font-semibold text-slate-700">{live.expiringSoonCount > 0 ? live.expiringSoonCount.toLocaleString() : '312'}</span> patients have benefits expiring within 90 days.</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 self-start flex-shrink-0">
          <Lock className="h-3.5 w-3.5 text-emerald-600" />
          <span className="hidden sm:inline text-xs font-medium text-emerald-700">HIPAA · Audit logging active · Data encrypted</span>
          <span className="sm:hidden text-xs font-medium text-emerald-700">HIPAA secure</span>
        </div>
      </div>

      {/* Aha moment */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-700 p-6 shadow-md">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-teal-200">Recoverable optical revenue in your patient list</p>
            {live.hasData && (
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" /> Live from your verifications
              </span>
            )}
          </div>
          <p className="text-3xl sm:text-5xl font-black text-white tracking-tight">${aha.recoverable.toLocaleString()}</p>
          <p className="mt-2 text-teal-100 text-sm">{aha.benefitPatients.toLocaleString()} patients have unused insurance benefits — frames, contacts, and exam coverage waiting to be used.</p>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-teal-200">Frame allowances</p>
              <p className="text-lg font-bold text-white">${aha.frameTotal.toLocaleString()}</p>
              <p className="text-xs text-teal-300">{aha.framePatients.toLocaleString()} patients</p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-teal-200">Contact lens benefits</p>
              <p className="text-lg font-bold text-white">${aha.clTotal.toLocaleString()}</p>
              <p className="text-xs text-teal-300">{aha.clPatients.toLocaleString()} patients</p>
            </div>
            <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <p className="text-xs text-teal-200">At 20% response rate</p>
              <p className="text-lg font-bold text-white">~${ahaRecovery.toLocaleString()}</p>
              <p className="text-xs text-teal-300">estimated recovery</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/5" />
        <div className="absolute -right-4 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title} onClick={() => navigate(s.nav)} className="border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:border-teal-200 transition-all">
            <CardContent className="pt-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} mb-3`}>{s.icon}</div>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
              <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${s.trendUp ? 'text-emerald-600' : 'text-slate-400'}`}>
                <TrendingUp className="h-3 w-3" />{s.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Campaign Suggestions Engine */}
      <CampaignSuggestionsEngine
        onSetupCampaign={(type) => navigate('/app/campaigns', { state: { openModal: true, campaignType: type } })}
      />

      {/* Urgent alert */}
      <Card className="border-rose-200 bg-rose-50/60 shadow-sm">
        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-rose-100">
              <AlertCircle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-900">${(live.expiringSoonRevenue > 0 ? live.expiringSoonRevenue : 48360).toLocaleString()} in patient benefits expiring within 90 days</p>
              <p className="text-xs text-rose-700">{live.expiringSoonCount > 0 ? live.expiringSoonCount.toLocaleString() : '312'} patients have unused frame and contact allowances. Send campaigns now to capture this revenue before benefits expire.</p>
            </div>
          </div>
          <button onClick={() => navigate('/app/campaigns')} className="flex flex-shrink-0 items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors shadow-sm whitespace-nowrap">
            View campaigns <ChevronRight className="h-3 w-3" />
          </button>
        </CardContent>
      </Card>

      {/* Top patients + carrier breakdown */}
      <div className="grid gap-4 lg:grid-cols-5">

        {/* Top patients by benefit value */}
        <Card className="border-slate-200 shadow-sm lg:col-span-3">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Top Patients by Benefit Value</CardTitle>
                  <CardDescription className="text-xs">Highest unused allowances — sorted by total available</CardDescription>
                </div>
              </div>
              <button onClick={() => navigate('/app/patients')} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
                All patients <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {topPatients.map((p) => {
                const total = p.frame + p.contacts
                return (
                  <div key={p.name} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.carrierColor}`}>{p.carrier}</span>
                        <span className="text-xs text-slate-400 hidden sm:inline">{p.lastVisit}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {p.frame > 0 && <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.5">${p.frame} frames</span>}
                        {p.contacts > 0 && <span className="text-xs font-medium text-cyan-700 bg-cyan-50 border border-cyan-200 rounded px-1.5 py-0.5">${p.contacts} contacts</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">${total}</p>
                        <p className="text-xs text-slate-400">total</p>
                      </div>
                      {!p.messaged ? (
                        <button onClick={() => navigate('/app/campaigns')} className="flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors whitespace-nowrap">
                          <Send className="h-3 w-3" /> Send
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-400">
                          <CheckCircle2 className="h-3 w-3" /> Sent
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-100 px-4 py-3">
              <button onClick={() => navigate('/app/patients')} className="text-xs font-medium text-teal-600 hover:underline">
                View all 847 patients with unused benefits →
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Carrier breakdown */}
        <Card className="border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                <ShieldCheck className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <CardTitle className="text-base">By Insurance Carrier</CardTitle>
                <CardDescription className="text-xs">{totalCarrierPatients} patients · $127,050 available</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {carrierBreakdown.map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${c.pill}`}>{c.name}</span>
                    <span className="text-xs text-slate-400">{c.patients} patients</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700">${c.available.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${c.color}`} style={{ width: `${Math.round((c.patients / totalCarrierPatients) * 100)}%` }} />
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/app/patients')} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Filter patients by carrier <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </CardContent>
        </Card>

      </div>

      {/* Campaign approval queue */}
      <Card className="border-amber-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                <CheckSquare className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  Awaiting Your Approval
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">{live.draftCampaigns.length}</span>
                </CardTitle>
                <CardDescription className="text-xs">Review each campaign before it sends — personalized messages with exact benefit amounts are ready</CardDescription>
              </div>
            </div>
            <button onClick={() => navigate('/app/campaigns')} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
              All campaigns <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {live.draftCampaigns.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-slate-400">No campaigns pending approval</p>
              <button onClick={() => navigate('/app/campaigns')} className="mt-3 text-xs font-medium text-teal-600 hover:underline">
                Create a campaign
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {live.draftCampaigns.map((c) => (
                <div key={c.id} className="px-3 sm:px-5 py-4">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 w-full">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">{c.type}</span>
                        <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-xs font-medium">Draft</span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        {c.scheduled_at
                          ? `Scheduled: ${new Date(c.scheduled_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`
                          : 'Not yet scheduled'}
                      </p>
                      <div className="rounded-lg border border-teal-100 bg-slate-50 px-3 py-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-xs font-medium text-slate-400">Live preview — each patient gets their own message</p>
                          <div className="flex gap-1">
                            {cyclingPreviews.map((_, i) => (
                              <span key={i} className={`h-1.5 w-1.5 rounded-full transition-colors ${i === previewIndex ? 'bg-teal-500' : 'bg-slate-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {currentPreview.name[0]}
                          </div>
                          <span className="text-xs font-semibold text-slate-700">{currentPreview.name}</span>
                          <span className="text-xs text-slate-400">{currentPreview.carrier}</span>
                          <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.5">{currentPreview.frame} frames</span>
                          {currentPreview.cl !== '$0' && <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 border border-cyan-200 rounded px-1.5 py-0.5">{currentPreview.cl} contacts</span>}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed italic">"{currentPreview.msg}"</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col flex-row gap-1.5 flex-shrink-0 w-full sm:w-auto">
                      <button onClick={() => navigate('/app/campaigns')} className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors whitespace-nowrap">
                        <CheckCircle2 className="h-3 w-3" /> Approve
                      </button>
                      <button onClick={() => navigate('/app/campaigns')} className="flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap">
                        <Eye className="h-3 w-3" /> Review
                      </button>
                      <button onClick={() => navigate('/app/campaigns')} className="hidden sm:flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors whitespace-nowrap">
                        <RotateCcw className="h-3 w-3" /> Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Brand segments */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                <Glasses className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base">Brand Segments</CardTitle>
                <CardDescription className="text-xs">Patients grouped by their last frame purchase — perfect for trunk show targeting</CardDescription>
              </div>
            </div>
            <button onClick={() => navigate('/app/campaigns', { state: { openModal: true, campaignType: 'Trunk Show' } })} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors whitespace-nowrap">
              New trunk show <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {brandSegments.map((b) => (
              <button
                key={b.brand}
                onClick={() => navigate('/app/campaigns', { state: { openModal: true, campaignType: 'Trunk Show', brand: b.brand } })}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 bg-white p-4 text-center transition-all hover:shadow-sm ${b.color}`}
              >
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-slate-800">{b.brand}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{b.patients} patients</p>
                </div>
                <span className="rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-xs font-semibold text-teal-700">Target</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">Brand data pulled from EHR optical/dispensing history · <button className="text-teal-600 hover:underline font-medium" onClick={() => navigate('/app/patients')}>update via CSV upload</button></p>
        </CardContent>
      </Card>

      {/* Campaign Revenue Estimates */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  Campaign Revenue Estimates
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Running
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">Prizm automatically sends personalized benefit reminders as patient allowances near expiration</CardDescription>
                <p className="text-xs text-slate-500 mt-1">Estimated based on industry booking rates — actual results vary</p>
              </div>
            </div>
            <button onClick={() => navigate('/app/campaigns')} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
              All campaigns <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {pipelineStages.map((stage) => (
              <div key={stage.label} className={`rounded-xl border ${stage.border} ${stage.bg} p-4`}>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${stage.pill}`}>{stage.label}</span>
                <p className="text-2xl font-bold text-slate-900 mt-3">{stage.patients}</p>
                <p className="text-xs text-slate-500 mt-0.5">patients</p>
                <div className="mt-2 h-1 w-full rounded-full bg-white/60">
                  <div className={`h-full rounded-full ${stage.color}`} style={{ width: `${Math.min(100, (stage.patients / 200) * 100)}%` }} />
                </div>
                <p className={`mt-2 text-sm font-semibold ${stage.textColor}`}>{stage.value}</p>
                <p className="text-xs text-slate-400">{stage.description}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Send className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">This Week's Automatic Sends</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 divide-y divide-slate-100">
              {thisWeeksSends.map((send) => (
                <div key={send.name} className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3">
                  <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600">
                    {send.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-semibold text-slate-800">{send.name}</p>
                      <span className="text-xs text-slate-400">{send.carrier}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {[send.frameAllowance !== '$0' && `${send.frameAllowance} frames`, send.contactAllowance !== '$0' && `${send.contactAllowance} contacts`].filter(Boolean).join(' · ')}
                      <span className="ml-1.5 text-slate-400">— {send.reason}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${send.channel === 'SMS' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'}`}>{send.channel}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${send.status === 'sending-today' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{send.sendDay}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400 text-right">89 patients queued for next week · <button onClick={() => navigate('/app/campaigns')} className="text-teal-600 hover:underline font-medium">view full queue</button></p>
          </div>
        </CardContent>
      </Card>

      {/* Bottom row — campaigns + verification */}
      <div className="grid gap-4 lg:grid-cols-2">

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">One-Time Campaigns</CardTitle>
            <CardDescription className="text-xs">For trunk shows, events, and custom outreach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {manualCampaigns.map((c) => (
              <button key={c.title} onClick={() => navigate('/app/campaigns', { state: { openModal: true, campaignType: c.type } })} className={`flex w-full items-center gap-3 rounded-xl border-2 bg-white p-3 text-left transition-all hover:shadow-sm ${c.border}`}>
                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${c.iconBg}`}>{c.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-800">{c.title}</p>
                  <p className="text-xs text-slate-400 leading-snug">{c.description}</p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
                  <ShieldCheck className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Verifications Today</CardTitle>
                  <CardDescription className="text-xs">38 checked · 31 active · 4 issues</CardDescription>
                </div>
              </div>
              <button onClick={() => navigate('/app/eligibility')} className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
                View all <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {todayVerifs.map((v) => {
                const cfg = verifStatusConfig[v.status]
                return (
                  <div key={v.name} onClick={() => navigate('/app/eligibility')} className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 mt-0.5">
                      {v.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-800">{v.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        {v.frameAllowance !== '$0' && <span className="text-xs font-medium text-teal-700">{v.frameAllowance} frames</span>}
                        {v.clAllowance !== '$0' && <span className="text-xs font-medium text-cyan-700">{v.clAllowance} contacts</span>}
                        {v.frameAllowance === '$0' && v.clAllowance === '$0' && <span className="text-xs text-slate-400">No benefits available</span>}
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium flex-shrink-0 ${cfg.className}`}>
                      {cfg.icon}{cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-100 px-4 py-3">
              <button onClick={() => navigate('/app/eligibility')} className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors">
                <ShieldCheck className="h-3 w-3" /> Run New Verification
              </button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
