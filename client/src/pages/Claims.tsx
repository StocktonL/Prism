import { useState } from 'react'
import {
  FileText,
  Plus,
  X,
  ChevronRight,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  DollarSign,
  Loader2,
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
import { PATIENTS, getPatientFullName, type Patient } from '@/data/mockPatients'

// ---- Types ----
type ClaimStatus = 'Submitted' | 'Pending' | 'Approved' | 'Paid' | 'Denied' | 'Needs Info'

interface DiagCode {
  code: string
  description: string
}

interface ProcedureLine {
  id: number
  code: string
  description: string
  qty: number
  billed: number
}

interface Claim {
  id: number
  claimNumber: string
  patient: string
  serviceDate: string
  insurance: string
  cptCodes: string[]
  billed: number
  paid: number
  status: ClaimStatus
  denialReason?: string
  eob?: {
    allowed: number
    adjustment: number
    patientResponsibility: number
    paid: number
  }
  diagnoses: DiagCode[]
  procedures: ProcedureLine[]
  priorAuth?: string
  renderingNpi: string
  renderingProvider: string
}

// ---- Mock data ----
const DIAG_OPTIONS: DiagCode[] = [
  { code: 'H52.13', description: 'Myopia, bilateral' },
  { code: 'H52.223', description: 'Astigmatism, bilateral' },
  { code: 'H52.4', description: 'Presbyopia' },
  { code: 'Z01.00', description: 'Encounter for eye exam' },
  { code: 'H40.1130', description: 'Glaucoma suspect, bilateral' },
]

const PROC_OPTIONS: Omit<ProcedureLine, 'id' | 'qty'>[] = [
  { code: '92004', description: 'Comprehensive eye exam, new patient', billed: 185 },
  { code: '92014', description: 'Comprehensive eye exam, established', billed: 145 },
  { code: '92012', description: 'Eye exam, established, intermediate', billed: 95 },
  { code: 'V2020', description: 'Frames', billed: 150 },
  { code: 'V2100', description: 'Single vision lenses', billed: 85 },
  { code: 'V2300', description: 'Bifocal lenses', billed: 110 },
  { code: 'V2500', description: 'Contact lenses (soft)', billed: 130 },
]

const INITIAL_CLAIMS: Claim[] = [
  {
    id: 1,
    claimNumber: 'CLM-2026-00441',
    patient: 'Sarah Mitchell',
    serviceDate: '2026-04-10',
    insurance: 'VSP',
    cptCodes: ['92014', 'V2100'],
    billed: 230,
    paid: 185,
    status: 'Paid',
    diagnoses: [
      { code: 'H52.13', description: 'Myopia, bilateral' },
      { code: 'Z01.00', description: 'Encounter for eye exam' },
    ],
    procedures: [
      { id: 1, code: '92014', description: 'Comprehensive eye exam, established', qty: 1, billed: 145 },
      { id: 2, code: 'V2100', description: 'Single vision lenses', qty: 1, billed: 85 },
    ],
    renderingNpi: '1234567890',
    renderingProvider: 'Dr. Andrea Reynolds',
    eob: { allowed: 210, adjustment: 25, patientResponsibility: 0, paid: 185 },
  },
  {
    id: 2,
    claimNumber: 'CLM-2026-00438',
    patient: 'Robert Chen',
    serviceDate: '2026-05-12',
    insurance: 'UHC Vision',
    cptCodes: ['92014', 'V2020', 'V2100'],
    billed: 380,
    paid: 0,
    status: 'Pending',
    diagnoses: [
      { code: 'H52.4', description: 'Presbyopia' },
      { code: 'Z01.00', description: 'Encounter for eye exam' },
    ],
    procedures: [
      { id: 1, code: '92014', description: 'Comprehensive eye exam, established', qty: 1, billed: 145 },
      { id: 2, code: 'V2020', description: 'Frames', qty: 1, billed: 150 },
      { id: 3, code: 'V2100', description: 'Single vision lenses', qty: 1, billed: 85 },
    ],
    renderingNpi: '1234567890',
    renderingProvider: 'Dr. Andrea Reynolds',
  },
  {
    id: 3,
    claimNumber: 'CLM-2026-00435',
    patient: 'Diana Patel',
    serviceDate: '2026-04-22',
    insurance: 'VSP',
    cptCodes: ['92014', 'V2020', 'V2100'],
    billed: 380,
    paid: 310,
    status: 'Approved',
    diagnoses: [
      { code: 'H52.223', description: 'Astigmatism, bilateral' },
      { code: 'Z01.00', description: 'Encounter for eye exam' },
    ],
    procedures: [
      { id: 1, code: '92014', description: 'Comprehensive eye exam, established', qty: 1, billed: 145 },
      { id: 2, code: 'V2020', description: 'Frames', qty: 1, billed: 150 },
      { id: 3, code: 'V2100', description: 'Single vision lenses', qty: 1, billed: 85 },
    ],
    renderingNpi: '1234567890',
    renderingProvider: 'Dr. Andrea Reynolds',
    eob: { allowed: 350, adjustment: 40, patientResponsibility: 0, paid: 310 },
  },
  {
    id: 4,
    claimNumber: 'CLM-2026-00421',
    patient: 'James Thornton',
    serviceDate: '2026-01-10',
    insurance: 'EyeMed',
    cptCodes: ['92014', 'V2020', 'V2300'],
    billed: 400,
    paid: 0,
    status: 'Denied',
    denialReason: 'CO-4: Service not covered by plan / benefit exhausted for this plan period.',
    diagnoses: [
      { code: 'H52.4', description: 'Presbyopia' },
      { code: 'Z01.00', description: 'Encounter for eye exam' },
    ],
    procedures: [
      { id: 1, code: '92014', description: 'Comprehensive eye exam, established', qty: 1, billed: 145 },
      { id: 2, code: 'V2020', description: 'Frames', qty: 1, billed: 145 },
      { id: 3, code: 'V2300', description: 'Bifocal lenses', qty: 1, billed: 110 },
    ],
    renderingNpi: '1234567890',
    renderingProvider: 'Dr. Andrea Reynolds',
  },
  {
    id: 5,
    claimNumber: 'CLM-2026-00418',
    patient: 'Priya Nair',
    serviceDate: '2026-05-10',
    insurance: 'EyeMed',
    cptCodes: ['92014', 'V2500'],
    billed: 275,
    paid: 0,
    status: 'Needs Info',
    diagnoses: [
      { code: 'H52.13', description: 'Myopia, bilateral' },
      { code: 'Z01.00', description: 'Encounter for eye exam' },
    ],
    procedures: [
      { id: 1, code: '92014', description: 'Comprehensive eye exam, established', qty: 1, billed: 145 },
      { id: 2, code: 'V2500', description: 'Contact lenses (soft)', qty: 1, billed: 130 },
    ],
    renderingNpi: '1234567890',
    renderingProvider: 'Dr. Andrea Reynolds',
  },
  {
    id: 6,
    claimNumber: 'CLM-2026-00409',
    patient: 'David Okafor',
    serviceDate: '2026-05-05',
    insurance: 'Davis Vision',
    cptCodes: ['92014'],
    billed: 145,
    paid: 0,
    status: 'Submitted',
    diagnoses: [
      { code: 'H52.223', description: 'Astigmatism, bilateral' },
      { code: 'Z01.00', description: 'Encounter for eye exam' },
    ],
    procedures: [
      { id: 1, code: '92014', description: 'Comprehensive eye exam, established', qty: 1, billed: 145 },
    ],
    renderingNpi: '1234567890',
    renderingProvider: 'Dr. Andrea Reynolds',
  },
]

// ---- Status helpers ----
function statusBadge(status: ClaimStatus) {
  const map: Record<ClaimStatus, { cls: string; icon: React.ReactNode }> = {
    Submitted: { cls: 'border-blue-200 bg-blue-50 text-blue-700', icon: <FileText className="h-3 w-3" /> },
    Pending: { cls: 'border-amber-200 bg-amber-50 text-amber-700', icon: <Clock className="h-3 w-3" /> },
    Approved: { cls: 'border-teal-200 bg-teal-50 text-teal-700', icon: <CheckCircle2 className="h-3 w-3" /> },
    Paid: { cls: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: <DollarSign className="h-3 w-3" /> },
    Denied: { cls: 'border-red-200 bg-red-50 text-red-700', icon: <XCircle className="h-3 w-3" /> },
    'Needs Info': { cls: 'border-orange-200 bg-orange-50 text-orange-700', icon: <AlertCircle className="h-3 w-3" /> },
  }
  const s = map[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.icon} {status}
    </span>
  )
}

function formatDate(d: string) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${m}/${day}/${y}`
}

// ---- New Claim Modal ----
type ClaimStep = 1 | 2 | 3 | 4 | 5

interface NewClaimModalProps {
  onClose: () => void
  onSubmit: (c: Claim) => void
}

function NewClaimModal({ onClose, onSubmit }: NewClaimModalProps) {
  const [step, setStep] = useState<ClaimStep>(1)
  const [submitting, setSubmitting] = useState(false)

  // Step 1
  const [patientSearch, setPatientSearch] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Step 2
  const [serviceDate, setServiceDate] = useState('')
  const [placeOfService, setPlaceOfService] = useState('11 - Office')
  const [npi, setNpi] = useState('1234567890')
  const [providerName, setProviderName] = useState('Dr. Andrea Reynolds')

  // Step 3
  const [selectedDiags, setSelectedDiags] = useState<DiagCode[]>([])

  // Step 4
  const [procedures, setProcedures] = useState<ProcedureLine[]>([])

  // Step 5
  const [priorAuth, setPriorAuth] = useState('')

  const patientSuggestions = PATIENTS.filter(
    (p) => patientSearch.length > 1 && getPatientFullName(p).toLowerCase().includes(patientSearch.toLowerCase()),
  ).slice(0, 5)

  function toggleDiag(d: DiagCode) {
    setSelectedDiags((prev) => {
      const exists = prev.find((x) => x.code === d.code)
      if (exists) return prev.filter((x) => x.code !== d.code)
      if (prev.length >= 4) return prev
      return [...prev, d]
    })
  }

  function addProcedure(opt: Omit<ProcedureLine, 'id' | 'qty'>) {
    if (procedures.find((p) => p.code === opt.code)) return
    setProcedures((prev) => [...prev, { ...opt, id: Date.now(), qty: 1 }])
  }

  function removeProcedure(id: number) {
    setProcedures((prev) => prev.filter((p) => p.id !== id))
  }

  function updateBilled(id: number, val: number) {
    setProcedures((prev) => prev.map((p) => (p.id === id ? { ...p, billed: val } : p)))
  }

  const totalBilled = procedures.reduce((sum, p) => sum + p.billed * p.qty, 0)

  function handleSubmit() {
    setSubmitting(true)
    setTimeout(() => {
      const claim: Claim = {
        id: Date.now(),
        claimNumber: `CLM-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`,
        patient: selectedPatient ? getPatientFullName(selectedPatient) : patientSearch,
        serviceDate,
        insurance: selectedPatient?.primaryInsurance.carrier ?? 'Unknown',
        cptCodes: procedures.map((p) => p.code),
        billed: totalBilled,
        paid: 0,
        status: 'Submitted',
        diagnoses: selectedDiags,
        procedures,
        priorAuth: priorAuth || undefined,
        renderingNpi: npi,
        renderingProvider: providerName,
      }
      onSubmit(claim)
      setSubmitting(false)
      onClose()
    }, 1200)
  }

  const STEP_LABELS = ['Patient', 'Service Info', 'Diagnosis', 'Procedures', 'Insurance']

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-900">New Claim</h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {STEP_LABELS.map((label, i) => {
              const n = (i + 1) as ClaimStep
              const active = step === n
              const done = step > n
              return (
                <div key={label} className="flex items-center gap-1.5 flex-shrink-0">
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-teal-600 text-white' : done ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-400'}`}>
                    {n}
                  </div>
                  <span className={`text-xs font-medium ${active ? 'text-teal-700' : done ? 'text-teal-600' : 'text-slate-400'}`}>{label}</span>
                  {i < 4 && <ChevronRight className="h-3 w-3 text-slate-300" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step 1 — Patient */}
        {step === 1 && (
          <div>
            <div className="px-6 py-5">
              <p className="mb-3 text-sm text-slate-500">Search for an existing patient or enter their name manually.</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-field pl-9"
                  placeholder="Search patient by name..."
                  value={patientSearch}
                  onChange={(e) => { setPatientSearch(e.target.value); setShowSuggestions(true); setSelectedPatient(null) }}
                  onFocus={() => setShowSuggestions(true)}
                />
                {showSuggestions && patientSuggestions.length > 0 && (
                  <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                    {patientSuggestions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50"
                        onClick={() => { setSelectedPatient(p); setPatientSearch(getPatientFullName(p)); setShowSuggestions(false) }}
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{getPatientFullName(p)}</p>
                          <p className="text-xs text-slate-400">DOB: {p.dob} &middot; {p.primaryInsurance.carrier} &middot; {p.primaryInsurance.memberId}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedPatient && (
                <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
                  <p className="text-sm font-semibold text-teal-800">{getPatientFullName(selectedPatient)}</p>
                  <p className="text-xs text-teal-600 mt-0.5">
                    DOB: {formatDate(selectedPatient.dob)} &middot; {selectedPatient.primaryInsurance.carrier} &middot; Member ID: {selectedPatient.primaryInsurance.memberId}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end border-t border-slate-200 px-6 py-4">
              <button
                onClick={() => setStep(2)}
                disabled={!patientSearch}
                className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Service Info */}
        {step === 2 && (
          <div>
            <div className="grid gap-3 px-6 py-5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Service Date</label>
                <input type="date" required className="input-field" value={serviceDate} onChange={(e) => setServiceDate(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Place of Service</label>
                <select className="input-field" value={placeOfService} onChange={(e) => setPlaceOfService(e.target.value)}>
                  <option>11 - Office</option>
                  <option>22 - On Campus Outpatient</option>
                  <option>99 - Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Rendering Provider NPI</label>
                <input className="input-field font-mono" value={npi} onChange={(e) => setNpi(e.target.value)} placeholder="1234567890" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Provider Name</label>
                <input className="input-field" value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Dr. Name" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button onClick={() => setStep(1)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Back</button>
              <button onClick={() => setStep(3)} disabled={!serviceDate} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}

        {/* Step 3 — Diagnosis */}
        {step === 3 && (
          <div>
            <div className="px-6 py-5">
              <p className="mb-3 text-sm text-slate-500">Select up to 4 ICD-10 diagnosis codes.</p>
              <div className="space-y-2">
                {DIAG_OPTIONS.map((d) => {
                  const selected = !!selectedDiags.find((x) => x.code === d.code)
                  return (
                    <label
                      key={d.code}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${selected ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                      <div className={`h-4 w-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${selected ? 'border-teal-600 bg-teal-600' : 'border-slate-300'}`}>
                        {selected && <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-white"><path d="M1 5l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-xs font-semibold text-slate-500">{d.code}</span>
                        <span className="ml-2 text-sm text-slate-700">{d.description}</span>
                      </div>
                      <input type="checkbox" className="sr-only" checked={selected} onChange={() => toggleDiag(d)} />
                    </label>
                  )
                })}
              </div>
              {selectedDiags.length > 0 && (
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Selected ({selectedDiags.length}/4):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDiags.map((d) => (
                      <span key={d.code} className="rounded-md bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">{d.code}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button onClick={() => setStep(2)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Back</button>
              <button onClick={() => setStep(4)} disabled={selectedDiags.length === 0} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}

        {/* Step 4 — Procedures */}
        {step === 4 && (
          <div>
            <div className="px-6 py-5">
              <p className="mb-3 text-sm text-slate-500">Add CPT/HCPCS procedure line items. Click to add, adjust billed amounts as needed.</p>
              <div className="space-y-1.5 mb-4">
                {PROC_OPTIONS.map((opt) => {
                  const added = !!procedures.find((p) => p.code === opt.code)
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => addProcedure(opt)}
                      disabled={added}
                      className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${added ? 'border-teal-200 bg-teal-50 opacity-60 cursor-not-allowed' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
                    >
                      <span className="font-mono text-xs font-semibold text-slate-500 w-12">{opt.code}</span>
                      <span className="flex-1 text-sm text-slate-700">{opt.description}</span>
                      <span className="text-sm font-semibold text-slate-600">${opt.billed}</span>
                      {added ? <CheckCircle2 className="h-4 w-4 text-teal-500 flex-shrink-0" /> : <Plus className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>

              {procedures.length > 0 && (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-3 py-2">
                    <p className="text-xs font-semibold text-slate-500">Line Items</p>
                  </div>
                  {procedures.map((proc) => (
                    <div key={proc.id} className="flex items-center gap-3 border-t border-slate-100 px-3 py-2.5">
                      <span className="font-mono text-xs font-semibold text-slate-500 w-12">{proc.code}</span>
                      <span className="flex-1 text-sm text-slate-700">{proc.description}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">$</span>
                        <input
                          type="number"
                          className="w-20 rounded border border-slate-200 bg-white px-2 py-1 text-sm text-right font-semibold text-slate-700 focus:border-teal-400 focus:outline-none"
                          value={proc.billed}
                          onChange={(e) => updateBilled(proc.id, Number(e.target.value))}
                          min={0}
                        />
                      </div>
                      <button onClick={() => removeProcedure(proc.id)} className="text-slate-400 hover:text-red-500">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="text-xs font-semibold text-slate-600">Total Billed</span>
                    <span className="text-sm font-bold text-slate-800">${totalBilled.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button onClick={() => setStep(3)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Back</button>
              <button onClick={() => setStep(5)} disabled={procedures.length === 0} className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}

        {/* Step 5 — Insurance & Summary */}
        {step === 5 && (
          <div>
            <div className="px-6 py-5 space-y-4">
              {selectedPatient && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Insurance from Patient Record</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><p className="text-xs text-slate-400">Carrier</p><p className="font-medium text-slate-800">{selectedPatient.primaryInsurance.carrier}</p></div>
                    <div><p className="text-xs text-slate-400">Member ID</p><p className="font-mono font-medium text-slate-800">{selectedPatient.primaryInsurance.memberId}</p></div>
                    <div><p className="text-xs text-slate-400">Group</p><p className="font-medium text-slate-800">{selectedPatient.primaryInsurance.groupNumber}</p></div>
                    <div><p className="text-xs text-slate-400">Subscriber</p><p className="font-medium text-slate-800">{selectedPatient.primaryInsurance.subscriberName}</p></div>
                  </div>
                </div>
              )}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Prior Authorization # (optional)</label>
                <input className="input-field" value={priorAuth} onChange={(e) => setPriorAuth(e.target.value)} placeholder="Leave blank if not required" />
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Claim Summary</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Patient</span><span className="font-medium text-slate-800">{selectedPatient ? getPatientFullName(selectedPatient) : patientSearch}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Service Date</span><span className="font-medium text-slate-800">{formatDate(serviceDate)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Provider</span><span className="font-medium text-slate-800">{providerName}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Diagnoses</span><span className="font-medium text-slate-800">{selectedDiags.map((d) => d.code).join(', ')}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Procedures</span><span className="font-medium text-slate-800">{procedures.map((p) => p.code).join(', ')}</span></div>
                  <div className="flex justify-between border-t border-slate-100 pt-2"><span className="font-semibold text-slate-700">Total Billed</span><span className="font-bold text-slate-900">${totalBilled.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button onClick={() => setStep(4)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">Back</button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                Submit Claim
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Claim Detail Expansion ----
interface ClaimDetailProps {
  claim: Claim
}

function ClaimDetail({ claim }: ClaimDetailProps) {
  return (
    <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Diagnoses */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Diagnosis Codes</p>
          <div className="space-y-1">
            {claim.diagnoses.map((d) => (
              <div key={d.code} className="flex items-center gap-2 text-sm">
                <span className="font-mono text-xs font-semibold text-slate-500 w-16">{d.code}</span>
                <span className="text-slate-700">{d.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Provider */}
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Rendering Provider</p>
          <p className="text-sm font-medium text-slate-700">{claim.renderingProvider}</p>
          <p className="text-xs text-slate-400 font-mono">NPI: {claim.renderingNpi}</p>
        </div>
      </div>

      {/* Procedures */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Procedure Line Items</p>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="px-3 py-2 text-xs font-semibold text-slate-500">Code</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-500">Description</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-500 text-right">Qty</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-500 text-right">Billed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {claim.procedures.map((p) => (
                <tr key={p.id}>
                  <td className="px-3 py-2 font-mono text-xs text-slate-500">{p.code}</td>
                  <td className="px-3 py-2 text-slate-700">{p.description}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{p.qty}</td>
                  <td className="px-3 py-2 text-right font-semibold text-slate-800">${(p.billed * p.qty).toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-slate-50">
                <td colSpan={3} className="px-3 py-2 text-xs font-semibold text-slate-500 text-right">Total</td>
                <td className="px-3 py-2 text-right font-bold text-slate-800">${claim.billed.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* EOB */}
      {claim.eob && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Explanation of Benefits</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Allowed', value: claim.eob.allowed, color: 'text-slate-800' },
              { label: 'Adjustment', value: claim.eob.adjustment, color: 'text-amber-700' },
              { label: 'Patient Resp.', value: claim.eob.patientResponsibility, color: 'text-slate-800' },
              { label: 'Paid', value: claim.eob.paid, color: 'text-emerald-700' },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-2.5 text-center">
                <p className={`text-base font-bold ${item.color}`}>${item.value}</p>
                <p className="text-xs text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Denial reason */}
      {claim.denialReason && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700 mb-0.5">Denial Reason</p>
              <p className="text-sm text-red-800">{claim.denialReason}</p>
            </div>
          </div>
        </div>
      )}

      {claim.priorAuth && (
        <p className="text-xs text-slate-500">Prior Auth: <span className="font-mono font-medium text-slate-700">{claim.priorAuth}</span></p>
      )}
    </div>
  )
}

// ---- Main Page ----
export default function Claims() {
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS)
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const totalBilled = claims.reduce((s, c) => s + c.billed, 0)
  const totalPaid = claims.reduce((s, c) => s + c.paid, 0)
  const pending = claims.filter((c) => c.status === 'Pending' || c.status === 'Submitted').length
  const approved = claims.filter((c) => c.status === 'Approved' || c.status === 'Paid').length

  const stats = [
    { label: 'Total Claims', value: claims.length, icon: <FileText className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Pending', value: pending, icon: <Clock className="h-5 w-5 text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Approved / Paid', value: approved, icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Total Billed', value: `$${totalBilled.toLocaleString()}`, icon: <DollarSign className="h-5 w-5 text-teal-600" />, bg: 'bg-teal-50' },
    { label: 'Total Paid', value: `$${totalPaid.toLocaleString()}`, icon: <DollarSign className="h-5 w-5 text-green-600" />, bg: 'bg-green-50' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Claims</h2>
          <p className="mt-1 text-sm text-slate-500">Submit and track vision insurance claims for patient visits.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Claim
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center gap-3 pt-4 pb-4">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Claims table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Claims</CardTitle>
          <CardDescription>Click any claim to expand full detail and EOB</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 bg-slate-50">
                <TableHead className="pl-6 font-semibold text-slate-600">Claim #</TableHead>
                <TableHead className="font-semibold text-slate-600">Patient</TableHead>
                <TableHead className="font-semibold text-slate-600">Service Date</TableHead>
                <TableHead className="font-semibold text-slate-600">Insurance</TableHead>
                <TableHead className="font-semibold text-slate-600">CPT Codes</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">Billed</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">Paid</TableHead>
                <TableHead className="font-semibold text-slate-600">Status</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims.map((claim) => {
                const isExpanded = expandedId === claim.id
                return (
                  <>
                    <TableRow
                      key={claim.id}
                      className="cursor-pointer border-slate-100 hover:bg-slate-50 transition-colors"
                      onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                    >
                      <TableCell className="pl-6 font-mono text-xs text-slate-500">{claim.claimNumber}</TableCell>
                      <TableCell className="font-medium text-slate-800">{claim.patient}</TableCell>
                      <TableCell className="text-sm text-slate-600">{formatDate(claim.serviceDate)}</TableCell>
                      <TableCell className="text-sm text-slate-600">{claim.insurance}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {claim.cptCodes.map((c) => (
                            <span key={c} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">{c}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm font-semibold text-slate-800">${claim.billed.toFixed(2)}</TableCell>
                      <TableCell className="text-right text-sm font-semibold text-slate-800">{claim.paid > 0 ? `$${claim.paid.toFixed(2)}` : '—'}</TableCell>
                      <TableCell>{statusBadge(claim.status)}</TableCell>
                      <TableCell>
                        {isExpanded
                          ? <ChevronUp className="h-4 w-4 text-slate-400" />
                          : <ChevronDown className="h-4 w-4 text-slate-400" />
                        }
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <tr key={`${claim.id}-detail`}>
                        <td colSpan={9} className="p-0">
                          <ClaimDetail claim={claim} />
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showModal && (
        <NewClaimModal
          onClose={() => setShowModal(false)}
          onSubmit={(c) => setClaims((prev) => [c, ...prev])}
        />
      )}
    </div>
  )
}
