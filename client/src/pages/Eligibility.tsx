import { useState, useEffect, useRef } from 'react'
import {
  ShieldCheck,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  Glasses,
  Contact2,
  Stethoscope,
  X,
  Loader2,
  AlertTriangle,
  Info,
  Play,
  Users,
  TrendingUp,
  CalendarClock,
  CheckSquare,
  Square,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PATIENTS, getPatientFullName, type Patient } from '@/data/mockPatients'

const CARRIERS = ['VSP', 'EyeMed', 'Davis Vision', 'Spectera', 'UHC Vision', 'Humana', 'Anthem']
const RELATIONSHIPS = ['Self', 'Spouse', 'Child', 'Other']

// Simulate a larger patient list
const TOTAL_PATIENTS = 847
const TOTAL_UNVERIFIED = 809

type VerificationStatus = 'active' | 'inactive' | 'pending' | 'unverified'

interface VerificationRecord {
  id: number
  patientId?: number
  patient: string
  dob: string
  insurance: string
  memberId: string
  checkedAt: string
  lastVerifiedDate?: string
  status: VerificationStatus
  frameAllowance?: number
  clAllowance?: number
  benefitExpiry?: string
}

const initialVerifications: VerificationRecord[] = [
  { id: 1, patientId: 1, patient: 'Sarah Mitchell',  dob: '03/22/1985', insurance: 'VSP',          memberId: 'VSP00192837', checkedAt: '2 min ago',  lastVerifiedDate: '2026-05-16', status: 'active',   frameAllowance: 150, clAllowance: 130,  benefitExpiry: '2026-12-31' },
  { id: 2, patientId: 2, patient: 'James Thornton',  dob: '07/14/1979', insurance: 'EyeMed',       memberId: 'EM88234001',  checkedAt: '18 min ago', lastVerifiedDate: '2026-05-16', status: 'active',   frameAllowance: 200, clAllowance: 150,  benefitExpiry: '2026-12-31' },
  { id: 3, patientId: 3, patient: 'Linda Kowalski',  dob: '11/30/1962', insurance: 'Davis Vision', memberId: 'DV55910234',  checkedAt: '2 hr ago',  lastVerifiedDate: '2026-05-14', status: 'inactive',  frameAllowance: 0,   clAllowance: 0,    benefitExpiry: '2026-12-31' },
  { id: 4, patientId: 4, patient: 'Marcus Rivera',   dob: '05/30/1968', insurance: 'Spectera',     memberId: 'SP77123456',  checkedAt: '3 hr ago',  lastVerifiedDate: '2025-11-20', status: 'pending',   frameAllowance: 0,   clAllowance: 0 },
  { id: 5, patientId: 6, patient: 'Robert Chen',     dob: '09/17/1958', insurance: 'UHC Vision',   memberId: 'UHC44902817', checkedAt: '4 hr ago',  lastVerifiedDate: '2026-05-12', status: 'active',   frameAllowance: 175, clAllowance: 0,    benefitExpiry: '2026-06-30' },
  { id: 6, patientId: 5, patient: 'Diana Okafor',    dob: '02/11/1990', insurance: 'EyeMed',       memberId: 'EM55011223',  checkedAt: '5 hr ago',  lastVerifiedDate: '2026-05-10', status: 'active',   frameAllowance: 200, clAllowance: 200,  benefitExpiry: '2026-12-31' },
]

// Patients from mock data that haven't been verified yet
const unverifiedPatients: VerificationRecord[] = PATIENTS
  .filter(p => !initialVerifications.some(v => v.patientId === p.id))
  .map((p, i) => ({
    id: 1000 + i,
    patientId: p.id,
    patient: getPatientFullName(p),
    dob: p.dob,
    insurance: p.primaryInsurance.carrier,
    memberId: p.primaryInsurance.memberId,
    checkedAt: 'Never',
    status: 'unverified' as VerificationStatus,
  }))

const statusConfig: Record<VerificationStatus, { label: string; icon: React.ReactNode; className: string }> = {
  active:     { label: 'Active',      icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactive:   { label: 'Inactive',    icon: <XCircle      className="h-3.5 w-3.5" />, className: 'bg-red-50 text-red-700 border-red-200'             },
  pending:    { label: 'Pending',     icon: <Clock        className="h-3.5 w-3.5" />, className: 'bg-amber-50 text-amber-700 border-amber-200'        },
  unverified: { label: 'Unverified',  icon: <AlertTriangle className="h-3.5 w-3.5" />, className: 'bg-slate-50 text-slate-600 border-slate-200'     },
}

function isExpiringSoon(record: VerificationRecord): boolean {
  if (!record.benefitExpiry || record.status !== 'active') return false
  const days = (new Date(record.benefitExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  return days >= 0 && days <= 90
}

function isStale(dateStr?: string): boolean {
  if (!dateStr) return false
  const days = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  return days > 30
}

// ---- Utilization Bar ----
function UtilizationBar({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0
  const color = pct >= 100 ? 'bg-slate-400' : pct >= 70 ? 'bg-amber-400' : 'bg-teal-500'
  return (
    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ---- Benefit Cards ----
function BenefitCards({ patient }: { patient: Patient }) {
  const b = patient.benefits
  const cards = [
    {
      label: 'Eye Exam',
      icon: <Stethoscope className="h-4 w-4 text-teal-500" />,
      bg: 'bg-teal-50',
      value: b.exam.covered ? 'Covered' : 'Not covered',
      usedPct: b.exam.used ? 100 : 0,
      usedLabel: b.exam.used ? `Used ${b.exam.usedDate ?? ''}` : 'Not used this period',
      remainingLabel: b.exam.covered && !b.exam.used ? '1 exam available' : b.exam.used ? 'Next eligible next year' : 'Not covered',
      inNetwork: 'Covered',
      outNetwork: `$${b.outOfNetwork.exam} OON allowance`,
    },
    {
      label: 'Frames',
      icon: <Glasses className="h-4 w-4 text-blue-500" />,
      bg: 'bg-blue-50',
      value: `$${b.frames.allowance} allowance`,
      usedPct: b.frames.allowance > 0 ? Math.round((b.frames.used / b.frames.allowance) * 100) : 0,
      usedLabel: `$${b.frames.used} used`,
      remainingLabel: `$${b.frames.allowance - b.frames.used} remaining`,
      inNetwork: `$${b.frames.allowance} allowance`,
      outNetwork: `$${b.outOfNetwork.frames} OON allowance`,
    },
    {
      label: 'Lenses',
      icon: <Eye className="h-4 w-4 text-violet-500" />,
      bg: 'bg-violet-50',
      value: b.lenses.covered ? 'Covered pair' : 'Not covered',
      usedPct: b.lenses.used ? 100 : 0,
      usedLabel: b.lenses.used ? `Used ${b.lenses.usedDate ?? ''}` : 'Not used this period',
      remainingLabel: b.lenses.covered && !b.lenses.used ? 'Full benefit available' : b.lenses.used ? 'Used this period' : 'Not covered',
      inNetwork: b.lenses.covered ? 'Covered pair' : 'Not covered',
      outNetwork: `$${b.outOfNetwork.lenses} OON allowance`,
    },
    {
      label: 'Contacts',
      icon: <Contact2 className="h-4 w-4 text-amber-500" />,
      bg: 'bg-amber-50',
      value: b.contacts.allowance > 0 ? `$${b.contacts.allowance} allowance` : 'Not covered',
      usedPct: b.contacts.allowance > 0 ? Math.round((b.contacts.used / b.contacts.allowance) * 100) : 0,
      usedLabel: b.contacts.allowance > 0 ? `$${b.contacts.used} used` : '—',
      remainingLabel: b.contacts.allowance > 0 ? `$${b.contacts.allowance - b.contacts.used} remaining` : 'Not covered',
      inNetwork: b.contacts.allowance > 0 ? `$${b.contacts.allowance} allowance` : 'Not covered',
      outNetwork: b.contacts.allowance > 0 ? `$${b.outOfNetwork.contacts} OON allowance` : '—',
    },
  ]
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-md ${c.bg}`}>{c.icon}</div>
            <div>
              <p className="text-xs font-semibold text-slate-700">{c.label}</p>
              <p className="text-xs text-slate-500">{c.value}</p>
            </div>
          </div>
          <UtilizationBar used={c.usedPct} total={100} />
          <div className="mt-1.5 flex justify-between text-xs">
            <span className="text-slate-400">{c.usedLabel}</span>
            <span className="font-medium text-teal-600">{c.remainingLabel}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-2 text-xs text-slate-400">
            <span>In-network: {c.inNetwork}</span>
            <span>{c.outNetwork}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ---- Expanded Detail Panel ----
function ExpandedDetail({ patient, record }: { patient?: Patient; record: VerificationRecord }) {
  if (!patient) {
    return (
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-4">
        <p className="text-xs text-slate-400">No detailed benefit data available — run a verification to populate.</p>
      </div>
    )
  }
  const b = patient.benefits
  const ins = patient.primaryInsurance
  const isDependant = ins.relationship !== 'Self'
  const relationLabel = ins.relationship === 'Child' ? 'Child of' : ins.relationship === 'Spouse' ? 'Spouse of' : ins.relationship
  return (
    <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 space-y-4">
      {b.requiresPriorAuth && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-red-700">Prior Authorization Required — confirm auth number before dispensing.</p>
        </div>
      )}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-500" />
          <span className="text-sm font-semibold text-slate-800">{ins.carrier}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Plan Year: {b.planYear.start} – {b.planYear.end}</span>
        </div>
        {record.benefitExpiry && isExpiringSoon(record) && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 flex items-center gap-1">
            <CalendarClock className="h-3 w-3" /> Expiring soon
          </span>
        )}
      </div>
      {isDependant && (
        <div className="flex items-center gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
          <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            <span className="font-semibold">Patient:</span> {patient.firstName} {patient.lastName}
            <span className="mx-1.5 text-blue-300">|</span>
            <span className="font-semibold">Subscriber:</span> {ins.subscriberName} ({relationLabel})
            <span className="mx-1.5 text-blue-300">|</span>
            <span className="font-semibold">Member ID:</span> {ins.memberId}
          </p>
        </div>
      )}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Benefit Summary</p>
        <BenefitCards patient={patient} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Frequency Limits</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-slate-500">Eye Exam</span><span className="font-medium text-slate-700">{b.frequency.exam}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">Materials</span><span className="font-medium text-slate-700">{b.frequency.materials}</span></div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Copays</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs"><span className="text-slate-500">Exam copay</span><span className="font-medium text-slate-700">{b.copays.exam > 0 ? `$${b.copays.exam}` : 'No copay'}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">Materials copay</span><span className="font-medium text-slate-700">{b.copays.materials > 0 ? `$${b.copays.materials}` : 'No copay'}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-500">Contact fitting</span><span className="font-medium text-slate-700">{b.copays.contactFitting > 0 ? `$${b.copays.contactFitting}` : 'No fee'}</span></div>
          </div>
        </div>
      </div>
      {patient.secondaryInsurance && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Secondary on file:</span>{' '}
            {patient.secondaryInsurance.carrier} · {patient.secondaryInsurance.memberId} — coordination of benefits may apply.
          </p>
        </div>
      )}
    </div>
  )
}

// ---- Single Verification Modal ----
type ModalStep = 'form' | 'checking' | 'result' | 'error'

interface ParsedBenefits {
  active: boolean
  planName?: string
  planYear: { start: string; end: string }
  frameAllowance: number
  frameUsed: number
  clAllowance: number
  clUsed: number
  examCopay: number
  materialsCopay: number
  examEligible: boolean
  nextEligibleDate?: string
  requiresPriorAuth: boolean
  oonFrameAllowance: number
  oonClAllowance: number
  oonExamAllowance: number
}

interface VerificationModalProps {
  onClose: () => void
  onComplete: (record: VerificationRecord) => void
  prefillPatient?: Patient
}

function VerificationModal({ onClose, onComplete, prefillPatient }: VerificationModalProps) {
  const [step, setStep] = useState<ModalStep>('form')
  const [patientSearch, setPatientSearch] = useState(prefillPatient ? getPatientFullName(prefillPatient) : '')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(prefillPatient ?? null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [form, setForm] = useState({
    carrier: prefillPatient?.primaryInsurance.carrier ?? 'VSP',
    memberId: prefillPatient?.primaryInsurance.memberId ?? '',
    groupNumber: prefillPatient?.primaryInsurance.groupNumber ?? '',
    subscriberName: prefillPatient?.primaryInsurance.subscriberName ?? '',
    subscriberDob: prefillPatient?.primaryInsurance.subscriberDob ?? '',
    relationship: prefillPatient?.primaryInsurance.relationship ?? 'Self',
  })
  const [liveBenefits, setLiveBenefits] = useState<ParsedBenefits | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const suggestions = PATIENTS.filter(
    (p) => patientSearch.length > 1 && getPatientFullName(p).toLowerCase().includes(patientSearch.toLowerCase()),
  ).slice(0, 5)

  function selectPatient(p: Patient) {
    setSelectedPatient(p)
    setPatientSearch(getPatientFullName(p))
    setShowSuggestions(false)
    setForm({
      carrier: p.primaryInsurance.carrier,
      memberId: p.primaryInsurance.memberId,
      groupNumber: p.primaryInsurance.groupNumber,
      subscriberName: p.primaryInsurance.subscriberName,
      subscriberDob: p.primaryInsurance.subscriberDob,
      relationship: p.primaryInsurance.relationship,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('checking')
    setLiveBenefits(null)
    setErrorMsg('')
    const [subscriberFirstName, ...rest] = form.subscriberName.trim().split(' ')
    const subscriberLastName = rest.join(' ') || subscriberFirstName
    try {
      const res = await fetch('/api/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrier: form.carrier,
          memberId: form.memberId,
          groupNumber: form.groupNumber || undefined,
          subscriberFirstName: subscriberFirstName || '',
          subscriberLastName,
          subscriberDob: form.subscriberDob,
          relationship: form.relationship,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Eligibility check failed. Please try again.')
        setStep('error')
        return
      }
      setLiveBenefits(data.benefits as ParsedBenefits)
      setStep('result')
    } catch {
      setErrorMsg('Could not reach the eligibility network. Check your connection and try again.')
      setStep('error')
    }
  }

  function handleSave() {
    const record: VerificationRecord = {
      id: Date.now(),
      patientId: selectedPatient?.id,
      patient: selectedPatient ? getPatientFullName(selectedPatient) : patientSearch || 'Unknown Patient',
      dob: selectedPatient?.dob ?? '—',
      insurance: form.carrier,
      memberId: form.memberId,
      checkedAt: 'Just now',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      status: 'active',
      frameAllowance: liveBenefits?.frameAllowance ?? selectedPatient?.benefits.frames.allowance,
      clAllowance: liveBenefits?.clAllowance ?? selectedPatient?.benefits.contacts.allowance,
      benefitExpiry: selectedPatient?.benefits.benefitPeriodEnd,
    }
    onComplete(record)
    onClose()
  }

  const p = selectedPatient

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Verify Patient Eligibility</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-slate-700">Patient</label>
                  <button type="button" onClick={() => setManualMode(!manualMode)} className="text-xs text-teal-600 hover:underline">
                    {manualMode ? 'Search existing patient' : 'Enter manually'}
                  </button>
                </div>
                {!manualMode ? (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      className="input-field pl-9"
                      placeholder="Search patient by name..."
                      value={patientSearch}
                      onChange={(e) => { setPatientSearch(e.target.value); setShowSuggestions(true) }}
                      onFocus={() => setShowSuggestions(true)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-slate-200 bg-white shadow-lg">
                        {suggestions.map((p) => (
                          <button key={p.id} type="button" onClick={() => selectPatient(p)}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                              {p.firstName[0]}{p.lastName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{getPatientFullName(p)}</p>
                              <p className="text-xs text-slate-400">{p.dob} · {p.primaryInsurance.carrier}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input className="input-field" placeholder="Patient full name" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} />
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Insurance Carrier</label>
                  <select className="input-field" value={form.carrier} onChange={(e) => setForm({ ...form, carrier: e.target.value })}>
                    {CARRIERS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Member ID</label>
                  <input className="input-field" value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })} placeholder="Member ID" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Group Number</label>
                  <input className="input-field" value={form.groupNumber} onChange={(e) => setForm({ ...form, groupNumber: e.target.value })} placeholder="Group #" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Relationship to Subscriber</label>
                  <select className="input-field" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })}>
                    {RELATIONSHIPS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Subscriber Name</label>
                  <input className="input-field" value={form.subscriberName} onChange={(e) => setForm({ ...form, subscriberName: e.target.value })} placeholder="Subscriber name" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Subscriber DOB</label>
                  <input className="input-field" type="date" value={form.subscriberDob} onChange={(e) => setForm({ ...form, subscriberDob: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button type="submit" disabled={!form.memberId}
                  className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ShieldCheck className="h-4 w-4" /> Run Verification
                </button>
              </div>
            </form>
          )}
          {step === 'checking' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
              <p className="text-sm font-medium text-slate-700">Checking eligibility with {form.carrier}...</p>
              <p className="text-xs text-slate-400">Querying Stedi · 270/271 EDI transaction</p>
            </div>
          )}
          {step === 'error' && (
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Verification Failed</p>
                  <p className="text-xs text-red-600 mt-1">{errorMsg}</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setStep('form')} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Try Again</button>
                <button onClick={onClose} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">Close</button>
              </div>
            </div>
          )}
          {step === 'result' && (
            <div className="p-6 space-y-4">
              {liveBenefits ? (
                <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${liveBenefits.active ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center gap-3">
                    {liveBenefits.active ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-red-500" />}
                    <div>
                      <p className={`text-sm font-semibold ${liveBenefits.active ? 'text-emerald-800' : 'text-red-800'}`}>
                        {liveBenefits.active ? 'Benefits Active' : 'Benefits Inactive / Exhausted'}
                      </p>
                      <p className={`text-xs ${liveBenefits.active ? 'text-emerald-600' : 'text-red-600'}`}>
                        {form.carrier}{liveBenefits.planYear.start && ` · Plan Year: ${liveBenefits.planYear.start} – ${liveBenefits.planYear.end}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Live · Stedi</span>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">Benefits Active</p>
                      <p className="text-xs text-emerald-600">{p ? `${form.carrier} · Plan Year: ${p.benefits.planYear.start} – ${p.benefits.planYear.end}` : form.carrier}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-600">Verified via Stedi</span>
                </div>
              )}
              {(liveBenefits?.requiresPriorAuth || p?.benefits.requiresPriorAuth) && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-700">Prior Authorization Required — confirm auth number before dispensing.</p>
                </div>
              )}
              {form.relationship !== 'Self' && form.subscriberName && (
                <div className="flex items-center gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
                  <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">Subscriber:</span> {form.subscriberName} ({form.relationship})
                    {p && <><span className="mx-1.5 text-blue-300">|</span><span className="font-semibold">Patient:</span> {getPatientFullName(p)}</>}
                  </p>
                </div>
              )}
              {!liveBenefits && p && (
                <>
                  <BenefitCards patient={p} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Frequency Limits</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Eye Exam</span><span className="font-medium text-slate-700">{p.benefits.frequency.exam}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Materials</span><span className="font-medium text-slate-700">{p.benefits.frequency.materials}</span></div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Copays</p>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Exam copay</span><span className="font-medium text-slate-700">{p.benefits.copays.exam > 0 ? `$${p.benefits.copays.exam}` : 'No copay'}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Materials copay</span><span className="font-medium text-slate-700">{p.benefits.copays.materials > 0 ? `$${p.benefits.copays.materials}` : 'No copay'}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-slate-500">Contact fitting</span><span className="font-medium text-slate-700">{p.benefits.copays.contactFitting > 0 ? `$${p.benefits.copays.contactFitting}` : 'No fee'}</span></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="flex justify-end pt-1">
                <button onClick={handleSave} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                  Save to Verification Log
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Batch Progress Banner ----
interface BatchState {
  status: 'idle' | 'running' | 'complete'
  done: number
  total: number
  active: number
  inactive: number
}

function BatchProgressBanner({ batch, onCancel }: { batch: BatchState; onCancel: () => void }) {
  const pct = Math.round((batch.done / batch.total) * 100)
  if (batch.status === 'idle') return null

  if (batch.status === 'complete') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm font-semibold text-emerald-800">Batch Verification Complete</p>
          </div>
          <span className="text-xs text-emerald-600">{batch.done.toLocaleString()} patients checked</span>
        </div>
        <div className="flex gap-6 text-xs text-emerald-700">
          <span><span className="font-semibold">{batch.active.toLocaleString()}</span> active</span>
          <span><span className="font-semibold">{batch.inactive.toLocaleString()}</span> inactive / exhausted</span>
          <span><span className="font-semibold">{(batch.done - batch.active - batch.inactive).toLocaleString()}</span> pending review</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50 px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
          <p className="text-sm font-semibold text-teal-800">Running Batch Verification...</p>
        </div>
        <button onClick={onCancel} className="text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">Cancel</button>
      </div>
      <div className="h-2 w-full rounded-full bg-teal-200 overflow-hidden mb-2">
        <div className="h-full rounded-full bg-teal-500 transition-all duration-100" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-teal-700">
        <span>{batch.done.toLocaleString()} of {batch.total.toLocaleString()} patients verified</span>
        <span>{pct}% complete · <span className="font-semibold">{batch.active}</span> active so far</span>
      </div>
    </div>
  )
}

type TabKey = 'all' | 'unverified' | 'active' | 'expiring' | 'issues'

// ---- Main Page ----
export default function Eligibility() {
  const [verifications, setVerifications] = useState<VerificationRecord[]>(initialVerifications)
  const [unverified] = useState<VerificationRecord[]>(unverifiedPatients)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const [showModal, setShowModal] = useState(false)
  const [prefillPatient, setPrefillPatient] = useState<Patient | undefined>()
  const [tab, setTab] = useState<TabKey>('all')
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [batch, setBatch] = useState<BatchState>({ status: 'idle', done: 0, total: 0, active: 0, inactive: 0 })
  const batchRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function handleNewRecord(record: VerificationRecord) {
    setVerifications((prev) => [record, ...prev])
    setExpandedId(record.id)
    setTab('all')
  }

  function openSingleVerify(patient?: Patient) {
    setPrefillPatient(patient)
    setShowModal(true)
  }

  function startBatchVerification(targetTotal: number = TOTAL_UNVERIFIED) {
    if (batch.status === 'running') return
    setBatch({ status: 'running', done: 0, total: targetTotal, active: 0, inactive: 0 })

    batchRef.current = setInterval(() => {
      setBatch((prev) => {
        if (prev.status !== 'running') return prev
        const increment = Math.floor(Math.random() * 6 + 2)
        const done = Math.min(prev.done + increment, prev.total)
        const active = Math.floor(done * 0.82)
        const inactive = Math.floor(done * 0.09)
        if (done >= prev.total) {
          if (batchRef.current) clearInterval(batchRef.current)
          return { status: 'complete', done, total: prev.total, active, inactive }
        }
        return { ...prev, done, active, inactive }
      })
    }, 80)
  }

  function cancelBatch() {
    if (batchRef.current) clearInterval(batchRef.current)
    setBatch({ status: 'idle', done: 0, total: 0, active: 0, inactive: 0 })
  }

  useEffect(() => {
    return () => { if (batchRef.current) clearInterval(batchRef.current) }
  }, [])

  const allRecords: VerificationRecord[] = [...verifications, ...unverified]

  const filtered = allRecords.filter((v) => {
    const matchesSearch =
      v.patient.toLowerCase().includes(search.toLowerCase()) ||
      v.insurance.toLowerCase().includes(search.toLowerCase()) ||
      v.memberId.toLowerCase().includes(search.toLowerCase())
    if (!matchesSearch) return false
    switch (tab) {
      case 'unverified': return v.status === 'unverified'
      case 'active': return v.status === 'active' && !isExpiringSoon(v)
      case 'expiring': return isExpiringSoon(v)
      case 'issues': return v.status === 'inactive' || v.status === 'pending'
      default: return true
    }
  })

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'all',        label: 'All Patients',       count: allRecords.length },
    { key: 'unverified', label: 'Needs Verification', count: allRecords.filter(v => v.status === 'unverified').length },
    { key: 'active',     label: 'Active',             count: allRecords.filter(v => v.status === 'active' && !isExpiringSoon(v)).length },
    { key: 'expiring',   label: 'Expiring Soon',      count: allRecords.filter(v => isExpiringSoon(v)).length },
    { key: 'issues',     label: 'Issues',             count: allRecords.filter(v => v.status === 'inactive' || v.status === 'pending').length },
  ]

  const expiringCount = allRecords.filter(v => isExpiringSoon(v)).length
  const activeCount = allRecords.filter(v => v.status === 'active').length
  const unverifiedCount = allRecords.filter(v => v.status === 'unverified').length

  const allFilteredSelected = filtered.length > 0 && filtered.every(v => selectedIds.has(v.id))

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(v => v.id)))
    }
  }

  function toggleSelect(id: number) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function verifySelected() {
    const selectedCount = selectedIds.size
    if (selectedCount === 0) return
    startBatchVerification(selectedCount)
    setSelectedIds(new Set())
  }

  const todayStats = [
    { label: 'Total Loaded',      value: TOTAL_PATIENTS.toLocaleString(), icon: <Users         className="h-5 w-5 text-slate-600"    />, bg: 'bg-slate-100', sub: 'patients in system' },
    { label: 'Needs Verification',value: unverifiedCount.toString(),        icon: <AlertTriangle className="h-5 w-5 text-amber-500"    />, bg: 'bg-amber-50',  sub: 'not yet checked'    },
    { label: 'Active Benefits',   value: activeCount.toString(),            icon: <CheckCircle2  className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50', sub: 'in-network eligible' },
    { label: 'Expiring ≤ 90 Days',value: expiringCount.toString(),          icon: <CalendarClock className="h-5 w-5 text-orange-500"  />, bg: 'bg-orange-50', sub: 'act before they lose it' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Eligibility Verification</h2>
          <p className="mt-1 text-sm text-slate-500">Check patient vision benefits via Stedi — frames, contacts, exam, and copays.</p>
        </div>
        <button
          onClick={() => openSingleVerify()}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ShieldCheck className="h-4 w-4" /> Verify Single Patient
        </button>
      </div>

      {/* Batch CTA — the primary action */}
      {batch.status === 'idle' && (
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-teal-50 to-cyan-50 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                {unverifiedCount} patients still need verification
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Run batch verification to check all patient benefits at once via Stedi — takes about 3 minutes for 847 patients.
              </p>
              <p className="mt-1.5 text-xs text-slate-400">Results include frame allowance, CL benefit, exam eligibility, and copay amounts per patient.</p>
            </div>
            <button
              onClick={() => startBatchVerification(TOTAL_UNVERIFIED)}
              className="flex-shrink-0 flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-md shadow-teal-900/20"
            >
              <Play className="h-4 w-4" /> Run Batch Verification
            </button>
          </div>
        </div>
      )}

      {/* Batch progress / complete */}
      {batch.status !== 'idle' && (
        <BatchProgressBanner batch={batch} onCancel={cancelBatch} />
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {todayStats.map((s) => (
          <Card key={s.label} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 pt-5">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${s.bg}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
                <p className="text-xs text-slate-400">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient list */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Patient Verification Status</CardTitle>
              <CardDescription>All patients · Click any row to see full benefit breakdown</CardDescription>
            </div>
            {selectedIds.size > 0 && (
              <button
                onClick={verifySelected}
                className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                <Play className="h-3.5 w-3.5" /> Verify Selected ({selectedIds.size})
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, insurance, or member ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setSelectedIds(new Set()) }}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === t.key
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t.label}
                <span className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${
                  tab === t.key ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                }`}>{t.count}</span>
              </button>
            ))}
          </div>

          {/* Select all row */}
          {filtered.length > 0 && (
            <div className="flex items-center gap-3 px-1">
              <button onClick={toggleSelectAll} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                {allFilteredSelected
                  ? <CheckSquare className="h-4 w-4 text-teal-600" />
                  : <Square className="h-4 w-4" />
                }
                {allFilteredSelected ? 'Deselect all' : `Select all ${filtered.length}`}
              </button>
              {selectedIds.size > 0 && (
                <span className="text-xs text-slate-400">{selectedIds.size} selected</span>
              )}
            </div>
          )}

          {/* Records list */}
          <div className="space-y-2">
            {filtered.length === 0 && (
              <div className="py-8 text-center text-sm text-slate-400">No patients match your search.</div>
            )}
            {filtered.map((v) => {
              const status = statusConfig[v.status]
              const isExpanded = expandedId === v.id
              const stale = isStale(v.lastVerifiedDate)
              const expiring = isExpiringSoon(v)
              const linkedPatient = v.patientId ? PATIENTS.find((p) => p.id === v.patientId) : undefined
              const isSelected = selectedIds.has(v.id)

              return (
                <div key={v.id} className={`rounded-xl border overflow-hidden shadow-sm transition-colors ${
                  isSelected ? 'border-teal-300 bg-teal-50/40' : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    {/* Checkbox */}
                    <button onClick={(e) => { e.stopPropagation(); toggleSelect(v.id) }}
                      className="flex-shrink-0 text-slate-400 hover:text-teal-600 transition-colors">
                      {isSelected ? <CheckSquare className="h-4 w-4 text-teal-600" /> : <Square className="h-4 w-4" />}
                    </button>

                    {/* Avatar + info */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : v.id)}
                      className="flex flex-1 items-center gap-4 text-left"
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                        {v.patient.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800">{v.patient}</p>
                        <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-400">
                          <span>{v.insurance}</span>
                          <span>·</span>
                          <span>{v.memberId}</span>
                          {v.frameAllowance != null && v.frameAllowance > 0 && (
                            <><span>·</span><span className="text-teal-600 font-medium">${v.frameAllowance} frames</span></>
                          )}
                          {v.clAllowance != null && v.clAllowance > 0 && (
                            <><span>·</span><span className="text-blue-600 font-medium">${v.clAllowance} CL</span></>
                          )}
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-2">
                        {expiring && (
                          <span className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                            <CalendarClock className="h-3 w-3" /> Expiring
                          </span>
                        )}
                        {stale && v.status !== 'unverified' && (
                          <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <RefreshCw className="h-3 w-3" /> Re-verify
                          </span>
                        )}
                        <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}>
                          {status.icon}{status.label}
                        </span>
                        <span className="text-xs text-slate-400">{v.checkedAt}</span>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-slate-400" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />}
                    </button>

                    {/* Quick verify button for unverified */}
                    {v.status === 'unverified' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); openSingleVerify(linkedPatient) }}
                        className="hidden sm:flex items-center gap-1 rounded-lg bg-teal-50 border border-teal-200 px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" /> Verify
                      </button>
                    )}
                  </div>

                  {/* Expanded section */}
                  {isExpanded && (
                    <ExpandedDetail patient={linkedPatient} record={v} />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <VerificationModal
          onClose={() => { setShowModal(false); setPrefillPatient(undefined) }}
          onComplete={handleNewRecord}
          prefillPatient={prefillPatient}
        />
      )}
    </div>
  )
}
