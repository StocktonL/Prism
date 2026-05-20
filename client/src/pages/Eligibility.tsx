import { useState } from 'react'
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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PATIENTS, getPatientFullName, type Patient } from '@/data/mockPatients'

const CARRIERS = ['VSP', 'EyeMed', 'Davis Vision', 'Spectera', 'UHC Vision', 'Humana', 'Anthem']
const RELATIONSHIPS = ['Self', 'Spouse', 'Child', 'Other']

interface VerificationRecord {
  id: number
  patientId?: number
  patient: string
  dob: string
  insurance: string
  memberId: string
  checkedAt: string
  lastVerifiedDate?: string
  status: 'active' | 'inactive' | 'pending'
}

const initialVerifications: VerificationRecord[] = [
  { id: 1, patientId: 1, patient: 'Sarah Mitchell',  dob: '03/22/1985', insurance: 'VSP',          memberId: 'VSP00192837', checkedAt: '2 min ago',  lastVerifiedDate: '2026-05-16', status: 'active'   },
  { id: 2, patientId: 2, patient: 'James Thornton',  dob: '07/14/1979', insurance: 'EyeMed',       memberId: 'EM88234001',  checkedAt: '18 min ago', lastVerifiedDate: '2026-05-16', status: 'active'   },
  { id: 3, patientId: 3, patient: 'Linda Kowalski',  dob: '11/30/1962', insurance: 'Davis Vision', memberId: 'DV55910234',  checkedAt: '2 hr ago',  lastVerifiedDate: '2026-05-14', status: 'inactive' },
  { id: 4, patientId: 4, patient: 'Marcus Rivera',   dob: '05/30/1968', insurance: 'Spectera',     memberId: 'SP77123456',  checkedAt: '3 hr ago',  lastVerifiedDate: '2025-11-20', status: 'pending'  },
  { id: 5, patientId: 6, patient: 'Robert Chen',     dob: '09/17/1958', insurance: 'UHC Vision',   memberId: 'UHC44902817', checkedAt: '4 hr ago',  lastVerifiedDate: '2026-05-12', status: 'active'   },
]

const statusConfig = {
  active:   { label: 'Active',   icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inactive', icon: <XCircle      className="h-3.5 w-3.5" />, className: 'bg-red-50 text-red-700 border-red-200'             },
  pending:  { label: 'Pending',  icon: <Clock        className="h-3.5 w-3.5" />, className: 'bg-amber-50 text-amber-700 border-amber-200'        },
}

function isStale(dateStr?: string): boolean {
  if (!dateStr) return false
  const days = (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  return days > 30
}

// ---- Utilization Bar ----
function UtilizationBar({ used, total, label }: { used: number; total: number; label?: string }) {
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0
  const color = pct >= 100 ? 'bg-slate-400' : pct >= 70 ? 'bg-amber-400' : 'bg-teal-500'
  return (
    <div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {label && <p className="mt-0.5 text-xs text-slate-400">{label}</p>}
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
function ExpandedDetail({ patient }: { patient: Patient }) {
  const b = patient.benefits
  const ins = patient.primaryInsurance
  const isDependant = ins.relationship !== 'Self'
  const relationLabel = ins.relationship === 'Child' ? 'Child of' : ins.relationship === 'Spouse' ? 'Spouse of' : ins.relationship

  return (
    <div className="border-t border-slate-100 bg-slate-50 px-4 py-4 space-y-4">

      {/* Prior auth warning */}
      {b.requiresPriorAuth && (
        <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
          <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-red-700">
            Prior Authorization Required — confirm auth number before dispensing materials.
          </p>
        </div>
      )}

      {/* Carrier + plan year header */}
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-500" />
          <span className="text-sm font-semibold text-slate-800">{ins.carrier}</span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">Plan Year: {b.planYear.start} – {b.planYear.end}</span>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
          b.requiresPriorAuth ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
        }`}>
          {b.requiresPriorAuth ? 'Prior Auth Required' : 'Active'}
        </span>
      </div>

      {/* Subscriber / dependent info */}
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

      {/* Benefit cards with utilization bars */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Benefit Summary</p>
        <BenefitCards patient={patient} />
      </div>

      {/* Frequency & Copays */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Frequency Limits</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Eye Exam</span>
              <span className="font-medium text-slate-700">{b.frequency.exam}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Materials</span>
              <span className="font-medium text-slate-700">{b.frequency.materials}</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Copays</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Exam copay</span>
              <span className="font-medium text-slate-700">{b.copays.exam > 0 ? `$${b.copays.exam}` : 'No copay'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Materials copay</span>
              <span className="font-medium text-slate-700">{b.copays.materials > 0 ? `$${b.copays.materials}` : 'No copay'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Contact fitting</span>
              <span className="font-medium text-slate-700">{b.copays.contactFitting > 0 ? `$${b.copays.contactFitting}` : 'No fee'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary insurance */}
      {patient.secondaryInsurance && (
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
          <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Secondary insurance on file:</span>{' '}
            {patient.secondaryInsurance.carrier} · {patient.secondaryInsurance.memberId} — coordination of benefits may apply.
          </p>
        </div>
      )}
    </div>
  )
}

// ---- Verification Modal ----
type ModalStep = 'form' | 'checking' | 'result'

interface VerificationModalProps {
  onClose: () => void
  onComplete: (record: VerificationRecord) => void
}

function VerificationModal({ onClose, onComplete }: VerificationModalProps) {
  const [step, setStep] = useState<ModalStep>('form')
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [form, setForm] = useState({ carrier: 'VSP', memberId: '', groupNumber: '', subscriberName: '', subscriberDob: '', relationship: 'Self' })

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('checking')
    setTimeout(() => setStep('result'), 1500)
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
    }
    onComplete(record)
    onClose()
  }

  const p = selectedPatient

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Run Eligibility Verification</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Form step */}
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {/* Patient search */}
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

              {/* Insurance fields */}
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

          {/* Checking step */}
          {step === 'checking' && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
              <p className="text-sm font-medium text-slate-700">Checking eligibility with {form.carrier}...</p>
              <p className="text-xs text-slate-400">Querying Stedi · 270/271 EDI transaction</p>
            </div>
          )}

          {/* Result step */}
          {step === 'result' && (
            <div className="p-6 space-y-4">
              {/* Status banner */}
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

              {/* Prior auth */}
              {p?.benefits.requiresPriorAuth && (
                <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-700">Prior Authorization Required — confirm auth number before dispensing materials.</p>
                </div>
              )}

              {/* Subscriber/dependent */}
              {p && p.primaryInsurance.relationship !== 'Self' && (
                <div className="flex items-center gap-2.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
                  <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">Subscriber:</span> {p.primaryInsurance.subscriberName} ({p.primaryInsurance.relationship})
                    <span className="mx-1.5 text-blue-300">|</span>
                    <span className="font-semibold">Patient:</span> {getPatientFullName(p)}
                  </p>
                </div>
              )}

              {/* Benefit cards */}
              {p && (
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
                  {p.secondaryInsurance && (
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                      <Info className="h-3.5 w-3.5 text-slate-400" />
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-700">Secondary on file:</span> {p.secondaryInsurance.carrier} · {p.secondaryInsurance.memberId} — coordination of benefits may apply.
                      </p>
                    </div>
                  )}
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

// ---- Today's stats ----
const todayStats = [
  { label: 'Verifications Run',  value: '38',  icon: <ShieldCheck    className="h-5 w-5 text-teal-600"    />, bg: 'bg-teal-50'    },
  { label: 'Active Benefits',    value: '31',  icon: <CheckCircle2   className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50' },
  { label: 'Inactive / Issues',  value: '4',   icon: <XCircle        className="h-5 w-5 text-red-500"     />, bg: 'bg-red-50'     },
  { label: 'Avg Response Time',  value: '1.2s',icon: <RefreshCw      className="h-5 w-5 text-blue-600"    />, bg: 'bg-blue-50'    },
]

// ---- Main Page ----
export default function Eligibility() {
  const [verifications, setVerifications] = useState<VerificationRecord[]>(initialVerifications)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const [showModal, setShowModal] = useState(false)

  const filtered = verifications.filter(
    (v) =>
      v.patient.toLowerCase().includes(search.toLowerCase()) ||
      v.insurance.toLowerCase().includes(search.toLowerCase()) ||
      v.memberId.toLowerCase().includes(search.toLowerCase()),
  )

  function handleNewRecord(record: VerificationRecord) {
    setVerifications((prev) => [record, ...prev])
    setExpandedId(record.id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Eligibility Verification</h2>
          <p className="mt-1 text-sm text-slate-500">Real-time benefit checks via Stedi — exam, frames, lenses, and contacts.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
        >
          <ShieldCheck className="h-4 w-4" /> Run Verification
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {todayStats.map((s) => (
          <Card key={s.label} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-4 pt-5">
              <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${s.bg}`}>{s.icon}</div>
              <div>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + list */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Verifications</CardTitle>
          <CardDescription>Click any record to expand the full benefit breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
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

          <div className="space-y-2">
            {filtered.map((v) => {
              const status = statusConfig[v.status]
              const isExpanded = expandedId === v.id
              const stale = isStale(v.lastVerifiedDate)
              const linkedPatient = v.patientId ? PATIENTS.find((p) => p.id === v.patientId) : undefined

              return (
                <div key={v.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  {/* Row header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : v.id)}
                    className="flex w-full items-center gap-4 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {v.patient.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{v.patient}</p>
                      <p className="text-xs text-slate-400">DOB: {v.dob} · {v.insurance} · {v.memberId}</p>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}>
                      {status.icon}{status.label}
                    </span>
                    <div className="hidden sm:flex items-center gap-2">
                      {stale && (
                        <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                          <AlertTriangle className="h-3 w-3" /> Verify again
                        </span>
                      )}
                      <span className="text-xs text-slate-400">{v.checkedAt}</span>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-slate-400" /> : <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />}
                  </button>

                  {/* Expanded section */}
                  {isExpanded && (
                    linkedPatient
                      ? <ExpandedDetail patient={linkedPatient} />
                      : (
                        <div className="border-t border-slate-100 bg-slate-50 px-4 py-4">
                          <p className="text-xs text-slate-400">No detailed benefit data available — run a new verification to populate.</p>
                        </div>
                      )
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <VerificationModal onClose={() => setShowModal(false)} onComplete={handleNewRecord} />
      )}
    </div>
  )
}
