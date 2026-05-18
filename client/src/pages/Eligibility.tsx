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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { PATIENTS, getPatientFullName, type Patient } from '@/data/mockPatients'

const CARRIERS = ['VSP', 'EyeMed', 'Davis Vision', 'Spectera', 'UHC Vision', 'Humana', 'Anthem']
const RELATIONSHIPS = ['Self', 'Spouse', 'Child', 'Other']

interface BenefitRow {
  label: string
  value: string
  used: string
  remaining: string
  icon: React.ReactNode
}

interface VerificationRecord {
  id: number
  patient: string
  dob: string
  insurance: string
  memberId: string
  checkedAt: string
  status: 'active' | 'inactive' | 'pending'
  benefits?: BenefitRow[]
}

const initialVerifications: VerificationRecord[] = [
  {
    id: 1,
    patient: 'Sarah Mitchell',
    dob: '03/22/1985',
    insurance: 'VSP',
    memberId: 'VSP00192837',
    checkedAt: '2 min ago',
    status: 'active',
    benefits: [
      { label: 'Eye Exam', value: 'Covered', used: 'Not used', remaining: '1 exam available', icon: <Stethoscope className="h-4 w-4 text-teal-500" /> },
      { label: 'Frames', value: '$150 allowance', used: '$0 used', remaining: '$150 remaining', icon: <Glasses className="h-4 w-4 text-blue-500" /> },
      { label: 'Lenses', value: 'Covered pair', used: 'Not used', remaining: 'Full benefit available', icon: <Eye className="h-4 w-4 text-violet-500" /> },
      { label: 'Contacts', value: '$130 allowance', used: '$0 used', remaining: '$130 remaining', icon: <Contact2 className="h-4 w-4 text-amber-500" /> },
    ],
  },
  {
    id: 2,
    patient: 'James Thornton',
    dob: '07/14/1979',
    insurance: 'EyeMed',
    memberId: 'EM88234001',
    checkedAt: '18 min ago',
    status: 'active',
    benefits: [
      { label: 'Eye Exam', value: 'Covered', used: 'Used 01/10/2026', remaining: 'Next eligible 01/10/2027', icon: <Stethoscope className="h-4 w-4 text-teal-500" /> },
      { label: 'Frames', value: '$200 allowance', used: '$200 used', remaining: '$0 remaining', icon: <Glasses className="h-4 w-4 text-blue-500" /> },
      { label: 'Lenses', value: 'Covered pair', used: 'Used 01/10/2026', remaining: 'Next eligible 01/10/2027', icon: <Eye className="h-4 w-4 text-violet-500" /> },
      { label: 'Contacts', value: 'Not covered', used: '—', remaining: '—', icon: <Contact2 className="h-4 w-4 text-amber-500" /> },
    ],
  },
  {
    id: 3,
    patient: 'Linda Kowalski',
    dob: '11/30/1962',
    insurance: 'Davis Vision',
    memberId: 'DV55910234',
    checkedAt: '2 hr ago',
    status: 'inactive',
  },
  {
    id: 4,
    patient: 'Marcus Rivera',
    dob: '05/30/1968',
    insurance: 'Spectera',
    memberId: 'SP77123456',
    checkedAt: '3 hr ago',
    status: 'pending',
  },
  {
    id: 5,
    patient: 'Robert Chen',
    dob: '09/17/1958',
    insurance: 'UHC Vision',
    memberId: 'UHC44902817',
    checkedAt: '4 hr ago',
    status: 'active',
    benefits: [
      { label: 'Eye Exam', value: 'Covered', used: 'Used 05/12/2026', remaining: 'Next eligible 05/12/2027', icon: <Stethoscope className="h-4 w-4 text-teal-500" /> },
      { label: 'Frames', value: '$200 allowance', used: '$0 used', remaining: '$200 remaining', icon: <Glasses className="h-4 w-4 text-blue-500" /> },
      { label: 'Lenses', value: 'Covered pair', used: 'Not used', remaining: 'Full benefit available', icon: <Eye className="h-4 w-4 text-violet-500" /> },
      { label: 'Contacts', value: 'Not covered', used: '—', remaining: '—', icon: <Contact2 className="h-4 w-4 text-amber-500" /> },
    ],
  },
]

const statusConfig = {
  active: { label: 'Active', icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inactive', icon: <XCircle className="h-3.5 w-3.5" />, className: 'bg-red-50 text-red-700 border-red-200' },
  pending: { label: 'Pending', icon: <Clock className="h-3.5 w-3.5" />, className: 'bg-amber-50 text-amber-700 border-amber-200' },
}

function buildBenefitResult(patient: Patient): BenefitRow[] {
  const b = patient.benefits
  return [
    {
      label: 'Eye Exam',
      value: b.exam.covered ? 'Covered' : 'Not covered',
      used: b.exam.used ? `Used ${b.exam.usedDate ?? ''}` : 'Not used',
      remaining: b.exam.covered && !b.exam.used ? '1 exam available' : b.exam.used ? `Next eligible next year` : 'Not covered',
      icon: <Stethoscope className="h-4 w-4 text-teal-500" />,
    },
    {
      label: 'Frames',
      value: `$${b.frames.allowance} allowance`,
      used: `$${b.frames.used} used`,
      remaining: `$${b.frames.allowance - b.frames.used} remaining`,
      icon: <Glasses className="h-4 w-4 text-blue-500" />,
    },
    {
      label: 'Lenses',
      value: b.lenses.covered ? 'Covered pair' : 'Not covered',
      used: b.lenses.used ? `Used ${b.lenses.usedDate ?? ''}` : 'Not used',
      remaining: b.lenses.covered && !b.lenses.used ? 'Full benefit available' : b.lenses.used ? 'Used this period' : 'Not covered',
      icon: <Eye className="h-4 w-4 text-violet-500" />,
    },
    {
      label: 'Contacts',
      value: b.contacts.allowance > 0 ? `$${b.contacts.allowance} allowance` : 'Not covered',
      used: b.contacts.allowance > 0 ? `$${b.contacts.used} used` : '—',
      remaining: b.contacts.allowance > 0 ? `$${b.contacts.allowance - b.contacts.used} remaining` : '—',
      icon: <Contact2 className="h-4 w-4 text-amber-500" />,
    },
  ]
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
  const [form, setForm] = useState({
    carrier: 'VSP',
    memberId: '',
    groupNumber: '',
    subscriberName: '',
    subscriberDob: '',
    relationship: 'Self',
  })
  const [resultBenefits, setResultBenefits] = useState<BenefitRow[]>([])
  const [resultStatus, setResultStatus] = useState<'active' | 'inactive'>('active')

  const suggestions = PATIENTS.filter(
    (p) =>
      patientSearch.length > 1 &&
      getPatientFullName(p).toLowerCase().includes(patientSearch.toLowerCase()),
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
    setTimeout(() => {
      const benefits = selectedPatient
        ? buildBenefitResult(selectedPatient)
        : [
            { label: 'Eye Exam', value: 'Covered', used: 'Not used', remaining: '1 exam available', icon: <Stethoscope className="h-4 w-4 text-teal-500" /> },
            { label: 'Frames', value: '$150 allowance', used: '$0 used', remaining: '$150 remaining', icon: <Glasses className="h-4 w-4 text-blue-500" /> },
            { label: 'Lenses', value: 'Covered pair', used: 'Not used', remaining: 'Full benefit available', icon: <Eye className="h-4 w-4 text-violet-500" /> },
            { label: 'Contacts', value: '$130 allowance', used: '$0 used', remaining: '$130 remaining', icon: <Contact2 className="h-4 w-4 text-amber-500" /> },
          ]
      setResultBenefits(benefits)
      setResultStatus(selectedPatient ? (selectedPatient.status === 'active' ? 'active' : 'inactive') : 'active')
      setStep('result')
    }, 1500)
  }

  function handleDone() {
    const name = selectedPatient ? getPatientFullName(selectedPatient) : patientSearch || 'Manual Entry'
    const record: VerificationRecord = {
      id: Date.now(),
      patient: name,
      dob: selectedPatient ? `${selectedPatient.dob.split('-')[1]}/${selectedPatient.dob.split('-')[2]}/${selectedPatient.dob.split('-')[0]}` : '—',
      insurance: form.carrier,
      memberId: form.memberId,
      checkedAt: 'Just now',
      status: resultStatus,
      benefits: resultBenefits,
    }
    onComplete(record)
    onClose()
  }

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
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Run Eligibility Verification</h2>
            <p className="text-xs text-slate-500">Real-time benefit check via Stedi 270/271 EDI</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Checking state */}
        {step === 'checking' && (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-16">
            <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
            <p className="text-base font-semibold text-slate-700">Checking eligibility...</p>
            <p className="text-sm text-slate-400">Connecting to {form.carrier} via 270/271 EDI</p>
          </div>
        )}

        {/* Form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-5 px-6 py-5">
              {/* Patient search */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">Patient</label>
                  <button
                    type="button"
                    onClick={() => setManualMode(!manualMode)}
                    className="text-xs font-medium text-teal-600 hover:underline"
                  >
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
                      onChange={(e) => {
                        setPatientSearch(e.target.value)
                        setShowSuggestions(true)
                        setSelectedPatient(null)
                      }}
                      onFocus={() => setShowSuggestions(true)}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                        {suggestions.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
                            onClick={() => selectPatient(p)}
                          >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                              {p.firstName[0]}{p.lastName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-800">{getPatientFullName(p)}</p>
                              <p className="text-xs text-slate-400">DOB: {p.dob} &middot; {p.primaryInsurance.carrier}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <input className="input-field" placeholder="Patient name (for records)" value={patientSearch} onChange={(e) => setPatientSearch(e.target.value)} />
                )}
              </div>

              {/* Insurance fields */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Insurance Information</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Insurance Carrier</label>
                    <select className="input-field" value={form.carrier} onChange={(e) => setForm((f) => ({ ...f, carrier: e.target.value }))}>
                      {CARRIERS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Member ID</label>
                    <input required className="input-field" value={form.memberId} onChange={(e) => setForm((f) => ({ ...f, memberId: e.target.value }))} placeholder="VSP00000000" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Group Number</label>
                    <input className="input-field" value={form.groupNumber} onChange={(e) => setForm((f) => ({ ...f, groupNumber: e.target.value }))} placeholder="G-00000" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Relationship</label>
                    <select className="input-field" value={form.relationship} onChange={(e) => setForm((f) => ({ ...f, relationship: e.target.value }))}>
                      {RELATIONSHIPS.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Subscriber Name</label>
                    <input className="input-field" value={form.subscriberName} onChange={(e) => setForm((f) => ({ ...f, subscriberName: e.target.value }))} placeholder="Full name" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">Subscriber DOB</label>
                    <input type="date" className="input-field" value={form.subscriberDob} onChange={(e) => setForm((f) => ({ ...f, subscriberDob: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="submit" className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                <ShieldCheck className="h-4 w-4" /> Check Eligibility
              </button>
            </div>
          </form>
        )}

        {/* Result */}
        {step === 'result' && (
          <div>
            <div className="px-6 py-5">
              {/* Status banner */}
              <div className={`mb-5 flex items-center gap-3 rounded-xl border p-4 ${resultStatus === 'active' ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${resultStatus === 'active' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {resultStatus === 'active'
                    ? <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    : <XCircle className="h-5 w-5 text-red-600" />
                  }
                </div>
                <div>
                  <p className={`text-sm font-bold ${resultStatus === 'active' ? 'text-emerald-800' : 'text-red-800'}`}>
                    {resultStatus === 'active' ? 'Benefits Active' : 'Coverage Inactive'}
                  </p>
                  <p className={`text-xs ${resultStatus === 'active' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {form.carrier} &middot; Member ID: {form.memberId} &middot; Benefit period ends 12/31/2026
                  </p>
                </div>
              </div>

              {/* Copays */}
              {resultStatus === 'active' && (
                <div className="mb-4 flex gap-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-center">
                    <p className="text-xs text-slate-500">Exam Copay</p>
                    <p className="text-lg font-bold text-slate-800">$10</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-center">
                    <p className="text-xs text-slate-500">Materials Copay</p>
                    <p className="text-lg font-bold text-slate-800">$25</p>
                  </div>
                </div>
              )}

              {/* Benefits grid */}
              <div className="grid gap-2 sm:grid-cols-2">
                {resultBenefits.map((b) => (
                  <div key={b.label} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50">
                      {b.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700">{b.label}</p>
                      <p className="text-xs text-slate-500">{b.value}</p>
                      <p className="mt-1 text-xs font-medium text-teal-600">{b.remaining}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
              <button onClick={() => setStep('form')} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Run Another
              </button>
              <button onClick={handleDone} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Stats ----
const todayStats = [
  { label: 'Verifications Run', value: '38', icon: <ShieldCheck className="h-5 w-5 text-teal-600" />, bg: 'bg-teal-50' },
  { label: 'Active Benefits', value: '31', icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50' },
  { label: 'Inactive / Issues', value: '4', icon: <XCircle className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
  { label: 'Avg Response Time', value: '1.2s', icon: <RefreshCw className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
]

export default function Eligibility() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(1)
  const [showModal, setShowModal] = useState(false)
  const [verifications, setVerifications] = useState<VerificationRecord[]>(initialVerifications)

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
          <p className="mt-1 text-sm text-slate-500">
            Real-time benefit checks via Stedi 270/271 EDI — exam, frames, lenses, and contacts.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
        >
          <ShieldCheck className="h-4 w-4" />
          Run Verification
        </button>
      </div>

      {/* Today's stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {todayStats.map((s) => (
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

      {/* Search + results */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Verifications</CardTitle>
          <CardDescription>Click any record to expand benefit details</CardDescription>
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>

          {/* Verification rows */}
          <div className="space-y-2">
            {filtered.map((v) => {
              const status = statusConfig[v.status]
              const isExpanded = expandedId === v.id

              return (
                <div key={v.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : v.id)}
                    className="flex w-full items-center gap-4 px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                      {v.patient.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">{v.patient}</p>
                      <p className="text-xs text-slate-400">DOB: {v.dob} &middot; {v.insurance} &middot; {v.memberId}</p>
                    </div>
                    <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${status.className}`}>
                      {status.icon}
                      {status.label}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:block">{v.checkedAt}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && v.benefits && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Benefit Summary</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {v.benefits.map((b) => (
                          <div key={b.label} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50">
                              {b.icon}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-700">{b.label}</p>
                              <p className="text-xs text-slate-500">{b.value}</p>
                              <p className="mt-1 text-xs font-medium text-teal-600">{b.remaining}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isExpanded && !v.benefits && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-4">
                      <p className="text-sm text-slate-500">
                        {v.status === 'inactive'
                          ? 'Coverage is inactive or terminated. Please contact the carrier or patient for updated insurance information.'
                          : 'Verification is pending. Results will appear once the eligibility check completes.'}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {showModal && (
        <VerificationModal
          onClose={() => setShowModal(false)}
          onComplete={handleNewRecord}
        />
      )}
    </div>
  )
}
