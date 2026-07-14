import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { logRead } from '@/lib/audit'
import {
  Search,
  UserPlus,
  X,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  AlertTriangle,
  Loader2,
  Upload,
  Glasses,
  Contact2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ── Types ─────────────────────────────────────────────────────────────────────

interface EligibilityCheck {
  id: string
  frame_allowance: number
  cl_allowance: number
  exam_copay: number
  deductible_met: boolean | null
  expiration_date: string | null
  plan_name: string | null
  checked_at: string
}

interface DbPatient {
  id: string
  practice_id: string
  first_name: string
  last_name: string
  date_of_birth: string | null
  phone: string | null
  email: string | null
  insurance_carrier: string | null
  member_id: string | null
  group_number: string | null
  insurance_relationship: string | null
  subscriber_name: string | null
  last_visit_date: string | null
  contact_lens_wearer: boolean
  last_frame_purchase: string | null
  last_frame_brand: string | null
  last_frame_model: string | null
  last_cl_order: string | null
  last_cl_brand: string | null
  cl_supply_days: number | null
  created_at: string
  latestCheck?: EligibilityCheck | null
}

type PatientStatus = 'active' | 'pending' | 'unverified'
type Segment = 'all' | 'has_insurance' | 'cl' | 'family' | 'no_insurance'

// ── Helpers ───────────────────────────────────────────────────────────────────

function deriveStatus(p: DbPatient): PatientStatus {
  if (!p.insurance_carrier || !p.member_id) return 'unverified'
  if (!p.latestCheck) return 'pending'
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return new Date(p.latestCheck.checked_at) > thirtyDaysAgo ? 'active' : 'pending'
}

function fmt(d: string | null | undefined): string {
  if (!d) return '—'
  const parts = d.split('T')[0].split('-')
  if (parts.length !== 3) return d
  return `${parts[1]}/${parts[2]}/${parts[0]}`
}

function fmtPhone(p: string | null): string {
  if (!p) return '—'
  const d = p.replace(/\D/g, '')
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  return p
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PatientStatus }) {
  if (status === 'active')
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Verified
      </span>
    )
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <Clock className="h-3 w-3" /> Needs Check
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      <XCircle className="h-3 w-3" /> No Insurance
    </span>
  )
}

// ── AddPatientModal ───────────────────────────────────────────────────────────

const CARRIERS = ['VSP', 'EyeMed', 'Davis Vision', 'Spectera', 'UHC Vision', 'Humana', 'Anthem', 'MetLife Vision']
const RELATIONSHIPS = ['Self', 'Spouse', 'Child', 'Other']

interface AddPatientModalProps {
  practiceId: string
  onClose: () => void
  onAdded: (patient: DbPatient) => void
}

function AddPatientModal({ practiceId, onClose, onAdded }: AddPatientModalProps) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone: '',
    email: '',
    insurance_carrier: '',
    member_id: '',
    group_number: '',
    insurance_relationship: 'Self',
    subscriber_name: '',
    contact_lens_wearer: false,
  })

  function set(k: string, v: string | boolean) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        practice_id: practiceId,
        insurance_carrier: form.insurance_carrier || null,
        member_id: form.member_id || null,
        group_number: form.group_number || null,
        date_of_birth: form.date_of_birth || null,
        phone: form.phone || null,
        email: form.email || null,
        subscriber_name: form.subscriber_name || null,
      }
      const { data, error: err } = await supabase
        .from('patients')
        .insert(payload)
        .select()
        .single()
      if (err) throw err
      onAdded({ ...data, latestCheck: null })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save patient')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8"
      onClick={onClose}
    >
      <form
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl mx-4"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Patient</h2>
            <p className="text-xs text-slate-500">Fill in patient and insurance information</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Patient</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">First Name *</label>
                <input required className="input-field" value={form.first_name} onChange={e => set('first_name', e.target.value)} placeholder="Jane" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Last Name *</label>
                <input required className="input-field" value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Smith" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Date of Birth</label>
                <input type="date" className="input-field" value={form.date_of_birth} onChange={e => set('date_of_birth', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Phone</label>
                <input className="input-field" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="cl_wearer"
                  checked={form.contact_lens_wearer}
                  onChange={e => set('contact_lens_wearer', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                <label htmlFor="cl_wearer" className="text-sm font-medium text-slate-700">Contact lens wearer</label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Insurance</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Carrier</label>
                <select className="input-field" value={form.insurance_carrier} onChange={e => set('insurance_carrier', e.target.value)}>
                  <option value="">— None —</option>
                  {CARRIERS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Member ID</label>
                <input className="input-field" value={form.member_id} onChange={e => set('member_id', e.target.value)} placeholder="VSP00000000" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Group Number</label>
                <input className="input-field" value={form.group_number} onChange={e => set('group_number', e.target.value)} placeholder="G-00000" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Relationship</label>
                <select className="input-field" value={form.insurance_relationship} onChange={e => set('insurance_relationship', e.target.value)}>
                  {RELATIONSHIPS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">Subscriber Name</label>
                <input className="input-field" value={form.subscriber_name} onChange={e => set('subscriber_name', e.target.value)} placeholder="Jane Smith" />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : 'Add Patient'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ── PatientDetailPanel ────────────────────────────────────────────────────────

interface PatientDetailProps {
  patient: DbPatient
  onClose: () => void
}

function PatientDetailPanel({ patient, onClose }: PatientDetailProps) {
  const [localCheck, setLocalCheck] = useState<EligibilityCheck | null>(patient.latestCheck ?? null)
  const [verifying, setVerifying] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  async function runVerification() {
    if (!patient.insurance_carrier || !patient.member_id) return
    setVerifying(true)
    setVerifyError('')
    try {
      const res = await fetch('/api/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier: patient.insurance_carrier,
          memberId: patient.member_id,
          groupNumber: patient.group_number ?? '',
          subscriberFirstName: patient.first_name,
          subscriberLastName: patient.last_name,
          subscriberDob: patient.date_of_birth ?? '',
          relationship: patient.insurance_relationship ?? 'Self',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string }
        throw new Error(data.error ?? 'Verification failed')
      }
      const result = await res.json() as { benefits: { frameAllowance: number; clAllowance: number; examCopay: number; planName?: string; planYear?: { end: string } } }
      const { benefits } = result

      const newCheck: EligibilityCheck = {
        id: '',
        frame_allowance: benefits.frameAllowance ?? 0,
        cl_allowance: benefits.clAllowance ?? 0,
        exam_copay: benefits.examCopay ?? 0,
        deductible_met: null,
        expiration_date: benefits.planYear?.end || null,
        plan_name: benefits.planName ?? null,
        checked_at: new Date().toISOString(),
      }

      // Store in Supabase — fire and forget, RLS enforces practice isolation
      supabase.from('eligibility_checks').insert({
        patient_id: patient.id,
        practice_id: patient.practice_id,
        frame_allowance: newCheck.frame_allowance,
        cl_allowance: newCheck.cl_allowance,
        exam_copay: newCheck.exam_copay,
        deductible_met: false,
        expiration_date: newCheck.expiration_date,
        plan_name: newCheck.plan_name,
        api_provider: 'stedi',
      }).then(() => {})

      setLocalCheck(newCheck)
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : 'Verification failed. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700">
              {patient.first_name[0]}{patient.last_name[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{patient.first_name} {patient.last_name}</h2>
              <p className="text-xs text-slate-500">DOB: {fmt(patient.date_of_birth)} &middot; {fmtPhone(patient.phone)}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 px-6 py-5">
          {/* Contact */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Contact</p>
            <div className="space-y-1 text-sm text-slate-700">
              {patient.email
                ? <p>{patient.email}</p>
                : <p className="italic text-slate-400">No email on file</p>
              }
              <p>{fmtPhone(patient.phone)}</p>
              {patient.last_visit_date && (
                <p className="text-xs text-slate-500">Last visit: {fmt(patient.last_visit_date)}</p>
              )}
            </div>
          </div>

          {/* Insurance */}
          {patient.insurance_carrier ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Insurance</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><p className="text-xs text-slate-400">Carrier</p><p className="font-medium text-slate-800">{patient.insurance_carrier}</p></div>
                <div><p className="text-xs text-slate-400">Member ID</p><p className="font-mono font-medium text-slate-800">{patient.member_id ?? '—'}</p></div>
                {patient.group_number && <div><p className="text-xs text-slate-400">Group</p><p className="font-medium text-slate-800">{patient.group_number}</p></div>}
                {patient.insurance_relationship && <div><p className="text-xs text-slate-400">Relationship</p><p className="font-medium text-slate-800">{patient.insurance_relationship}</p></div>}
                {patient.subscriber_name && (
                  <div className="col-span-2"><p className="text-xs text-slate-400">Subscriber</p><p className="font-medium text-slate-800">{patient.subscriber_name}</p></div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700">No insurance information on file</p>
            </div>
          )}

          {/* Benefits */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Benefit Summary</p>
            {localCheck ? (
              <div className="space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Glasses className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Frames</p>
                      <p className={`text-sm font-bold ${localCheck.frame_allowance > 0 ? 'text-teal-600' : 'text-slate-400'}`}>
                        ${localCheck.frame_allowance.toLocaleString()} allowance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                      <Contact2 className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Contacts</p>
                      <p className={`text-sm font-bold ${localCheck.cl_allowance > 0 ? 'text-teal-600' : 'text-slate-400'}`}>
                        {localCheck.cl_allowance > 0 ? `$${localCheck.cl_allowance.toLocaleString()} allowance` : 'Not covered'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-0.5">
                  {localCheck.plan_name && <p>Plan: {localCheck.plan_name}</p>}
                  {localCheck.expiration_date && <p>Benefits expire: {fmt(localCheck.expiration_date)}</p>}
                  {localCheck.exam_copay > 0 && <p>Exam copay: ${localCheck.exam_copay}</p>}
                  <p>Verified: {fmt(localCheck.checked_at.split('T')[0])}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                <p className="text-sm text-slate-500 mb-3">Benefits not yet verified with insurance</p>
                {patient.insurance_carrier && patient.member_id && (
                  <button
                    onClick={runVerification}
                    disabled={verifying}
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                  >
                    {verifying
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
                      : <><ShieldCheck className="h-4 w-4" /> Run Verification</>
                    }
                  </button>
                )}
              </div>
            )}
            {verifyError && <p className="mt-2 text-xs text-red-600">{verifyError}</p>}
          </div>

          {/* Purchase History */}
          {(patient.last_frame_brand || patient.last_cl_brand) && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Purchase History</p>
              <div className="space-y-3">
                {patient.last_frame_brand && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <Glasses className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Last Frame Purchase</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {patient.last_frame_brand}{patient.last_frame_model ? ` — ${patient.last_frame_model}` : ''}
                      </p>
                      {patient.last_frame_purchase && (
                        <p className="text-xs text-slate-500">{fmt(patient.last_frame_purchase)}</p>
                      )}
                    </div>
                  </div>
                )}
                {patient.last_cl_brand && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                      <Contact2 className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Last Contact Lens Order</p>
                      <p className="text-sm font-semibold text-slate-800">{patient.last_cl_brand}</p>
                      {patient.last_cl_order && (
                        <p className="text-xs text-slate-500">{fmt(patient.last_cl_order)}</p>
                      )}
                      {patient.cl_supply_days && (
                        <p className="text-xs text-slate-500">{patient.cl_supply_days}-day supply</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
          {patient.insurance_carrier && patient.member_id && (
            <button
              onClick={runVerification}
              disabled={verifying}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
            >
              {verifying
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
                : <><ShieldCheck className="h-4 w-4" /> Verify Benefits</>
              }
            </button>
          )}
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <MessageSquare className="h-4 w-4" /> Send Campaign
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function Patients() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [patients, setPatients] = useState<DbPatient[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [segment, setSegment] = useState<Segment>('all')
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState<DbPatient | null>(null)
  const [practiceId, setPracticeId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!user) { setLoading(false); return }
      try {
        const { data: userData } = await supabase
          .from('users')
          .select('practice_id')
          .eq('id', user.id)
          .single()

        if (!userData?.practice_id) return

        const pid = userData.practice_id
        setPracticeId(pid)

        const { data: patientData } = await supabase
          .from('patients')
          .select('*')
          .eq('practice_id', pid)
          .order('created_at', { ascending: false })

        if (!patientData?.length) return

        // Fetch latest eligibility check per patient
        const { data: checks } = await supabase
          .from('eligibility_checks')
          .select('patient_id, id, frame_allowance, cl_allowance, exam_copay, deductible_met, expiration_date, plan_name, checked_at')
          .in('patient_id', patientData.map(p => p.id))
          .order('checked_at', { ascending: false })

        // Take only the most recent check per patient
        const checkMap = new Map<string, EligibilityCheck>()
        for (const c of (checks ?? [])) {
          if (!checkMap.has(c.patient_id)) checkMap.set(c.patient_id, c)
        }

        setPatients(patientData.map(p => ({ ...p, latestCheck: checkMap.get(p.id) ?? null })))

        // HIPAA audit: log that this user read the patient list for this practice.
        // Fire-and-forget — never blocks the UI.
        logRead({
          action: 'READ_PATIENT_LIST',
          resource_type: 'patients',
          user_id: user.id,
          practice_id: pid,
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const segmentFilter = (p: DbPatient): boolean => {
    if (segment === 'has_insurance') return !!(p.insurance_carrier && p.member_id)
    if (segment === 'cl') return p.contact_lens_wearer === true
    if (segment === 'family') return !!(p.insurance_relationship && p.insurance_relationship !== 'Self')
    if (segment === 'no_insurance') return !p.insurance_carrier || !p.member_id
    return true
  }

  const filtered = patients.filter(
    p =>
      segmentFilter(p) &&
      (`${p.first_name} ${p.last_name}`.toLowerCase().includes(query.toLowerCase()) ||
        (p.insurance_carrier ?? '').toLowerCase().includes(query.toLowerCase()) ||
        (p.member_id ?? '').toLowerCase().includes(query.toLowerCase()))
  )

  const withInsurance = patients.filter(p => p.insurance_carrier && p.member_id).length
  const clWearers = patients.filter(p => p.contact_lens_wearer).length
  const noInsurance = patients.filter(p => !p.insurance_carrier || !p.member_id).length
  const familyMembers = patients.filter(p => p.insurance_relationship && p.insurance_relationship !== 'Self').length

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: <Users className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'With Insurance', value: withInsurance, icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'CL Wearers', value: clWearers, icon: <Contact2 className="h-5 w-5 text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Missing Insurance', value: noInsurance, icon: <AlertTriangle className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Patients</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your patient roster and insurance eligibility.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/patients/upload')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Upload className="h-4 w-4" /> Import CSV
          </button>
          <button
            onClick={() => setShowAdd(true)}
            disabled={!practiceId}
            className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" /> Add Patient
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
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

      {/* Segment chips */}
      <div className="flex flex-wrap gap-2">
        {([
          { key: 'all',          label: 'All Patients',     count: patients.length },
          { key: 'has_insurance',label: 'Has Insurance',    count: withInsurance },
          { key: 'cl',           label: 'CL Wearers',       count: clWearers },
          { key: 'family',       label: 'Family Members',   count: familyMembers },
          { key: 'no_insurance', label: 'Missing Insurance',count: noInsurance },
        ] as { key: Segment; label: string; count: number }[]).map(chip => (
          <button
            key={chip.key}
            onClick={() => setSegment(chip.key)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              segment === chip.key
                ? 'border-teal-500 bg-teal-600 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {chip.label}
            <span className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
              segment === chip.key ? 'bg-teal-700 text-teal-100' : 'bg-slate-100 text-slate-500'
            }`}>
              {chip.count}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {patients.length === 0 ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 mb-4">
              <Users className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">No patients yet</h3>
            <p className="text-sm text-slate-500 mb-5 max-w-xs">
              Import your patient list from your EHR to get started. We'll verify insurance benefits automatically.
            </p>
            <button
              onClick={() => navigate('/app/patients/upload')}
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <Upload className="h-4 w-4" /> Import Patient List
            </button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Patient List</CardTitle>
                <CardDescription>{filtered.length} patient{filtered.length !== 1 ? 's' : ''} found</CardDescription>
              </div>
            </div>
            <div className="relative mt-2 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, carrier, or member ID..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 transition-all"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 bg-slate-50">
                  <TableHead className="pl-6 font-semibold text-slate-600">Name</TableHead>
                  <TableHead className="font-semibold text-slate-600">DOB</TableHead>
                  <TableHead className="font-semibold text-slate-600">Phone</TableHead>
                  <TableHead className="font-semibold text-slate-600">Insurance</TableHead>
                  <TableHead className="font-semibold text-slate-600">Member ID</TableHead>
                  <TableHead className="font-semibold text-slate-600">Last Visit</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(p => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer border-slate-100 hover:bg-teal-50/40 transition-colors"
                    onClick={() => setSelected(p)}
                  >
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {p.first_name[0]}{p.last_name[0]}
                        </div>
                        <span className="font-medium text-slate-800">{p.first_name} {p.last_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{fmt(p.date_of_birth)}</TableCell>
                    <TableCell className="text-sm text-slate-600">{fmtPhone(p.phone)}</TableCell>
                    <TableCell className="text-sm text-slate-600">{p.insurance_carrier ?? '—'}</TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{p.member_id ?? '—'}</TableCell>
                    <TableCell className="text-sm text-slate-600">{fmt(p.last_visit_date)}</TableCell>
                    <TableCell><StatusBadge status={deriveStatus(p)} /></TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12 text-center text-sm text-slate-400">
                      No patients match your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {showAdd && practiceId && (
        <AddPatientModal
          practiceId={practiceId}
          onClose={() => setShowAdd(false)}
          onAdded={p => setPatients(prev => [p, ...prev])}
        />
      )}

      {selected && (
        <PatientDetailPanel
          patient={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
