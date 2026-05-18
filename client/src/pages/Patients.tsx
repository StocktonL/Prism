import { useState } from 'react'
import {
  Search,
  UserPlus,
  X,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Glasses,
  Contact2,
  Stethoscope,
  Users,
  AlertTriangle,
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

const CARRIERS = ['VSP', 'EyeMed', 'Davis Vision', 'Spectera', 'UHC Vision', 'Humana', 'Anthem']
const RELATIONSHIPS = ['Self', 'Spouse', 'Child', 'Other']
const GENDERS = ['Male', 'Female', 'Other']

function statusBadge(status: Patient['status']) {
  if (status === 'active')
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
        <CheckCircle2 className="h-3 w-3" /> Active
      </span>
    )
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        <Clock className="h-3 w-3" /> Pending
      </span>
    )
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      <XCircle className="h-3 w-3" /> Unverified
    </span>
  )
}

function formatDob(dob: string) {
  const [y, m, d] = dob.split('-')
  return `${m}/${d}/${y}`
}

function formatDate(date: string) {
  if (!date) return '—'
  const [y, m, d] = date.split('-')
  return `${m}/${d}/${y}`
}

// ---- Add Patient Modal ----
interface AddPatientModalProps {
  onClose: () => void
  onAdd: (p: Patient) => void
}

const EMPTY_INS = {
  carrier: 'VSP',
  memberId: '',
  groupNumber: '',
  subscriberName: '',
  subscriberDob: '',
  relationship: 'Self' as const,
}

function AddPatientModal({ onClose, onAdd }: AddPatientModalProps) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Female' as Patient['gender'],
    phone: '',
    email: '',
    address: '',
  })
  const [primary, setPrimary] = useState({ ...EMPTY_INS })
  const [hasSecondary, setHasSecondary] = useState(false)
  const [secondary, setSecondary] = useState({ ...EMPTY_INS })

  function setF(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }))
  }
  function setP(k: string, v: string) {
    setPrimary((f) => ({ ...f, [k]: v }))
  }
  function setS(k: string, v: string) {
    setSecondary((f) => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const newPatient: Patient = {
      id: Date.now(),
      ...form,
      primaryInsurance: primary as Patient['primaryInsurance'],
      secondaryInsurance: hasSecondary ? (secondary as Patient['primaryInsurance']) : undefined,
      lastVerified: new Date().toISOString().split('T')[0],
      status: 'pending',
      lastVisit: '',
      benefits: {
        exam: { covered: true, used: false },
        frames: { allowance: 150, used: 0 },
        lenses: { covered: true, used: false },
        contacts: { allowance: 130, used: 0 },
        benefitPeriodEnd: '2026-12-31',
        examCopay: 10,
        materialsCopay: 25,
      },
      eligibilityHistory: [],
    }
    onAdd(newPatient)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-8"
      onClick={onClose}
    >
      <form
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Add New Patient</h2>
            <p className="text-xs text-slate-500">Fill in patient and insurance information</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {/* Demographics */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Patient Information</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">First Name</label>
                <input required className="input-field" value={form.firstName} onChange={(e) => setF('firstName', e.target.value)} placeholder="Jane" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Last Name</label>
                <input required className="input-field" value={form.lastName} onChange={(e) => setF('lastName', e.target.value)} placeholder="Smith" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Date of Birth</label>
                <input required type="date" className="input-field" value={form.dob} onChange={(e) => setF('dob', e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Gender</label>
                <select className="input-field" value={form.gender} onChange={(e) => setF('gender', e.target.value)}>
                  {GENDERS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Phone</label>
                <input className="input-field" value={form.phone} onChange={(e) => setF('phone', e.target.value)} placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => setF('email', e.target.value)} placeholder="jane@example.com" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-700">Address</label>
                <input className="input-field" value={form.address} onChange={(e) => setF('address', e.target.value)} placeholder="123 Main Street, City, State ZIP" />
              </div>
            </div>
          </div>

          {/* Primary Insurance */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Primary Insurance</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Carrier</label>
                <select className="input-field" value={primary.carrier} onChange={(e) => setP('carrier', e.target.value)}>
                  {CARRIERS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Member ID</label>
                <input required className="input-field" value={primary.memberId} onChange={(e) => setP('memberId', e.target.value)} placeholder="VSP00000000" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Group Number</label>
                <input className="input-field" value={primary.groupNumber} onChange={(e) => setP('groupNumber', e.target.value)} placeholder="G-00000" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Relationship to Subscriber</label>
                <select className="input-field" value={primary.relationship} onChange={(e) => setP('relationship', e.target.value)}>
                  {RELATIONSHIPS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Subscriber Name</label>
                <input className="input-field" value={primary.subscriberName} onChange={(e) => setP('subscriberName', e.target.value)} placeholder="Jane Smith" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Subscriber DOB</label>
                <input type="date" className="input-field" value={primary.subscriberDob} onChange={(e) => setP('subscriberDob', e.target.value)} />
              </div>
            </div>
          </div>

          {/* Secondary Insurance Toggle */}
          <div>
            <label className="flex cursor-pointer items-center gap-3">
              <div
                onClick={() => setHasSecondary(!hasSecondary)}
                className={`relative h-5 w-9 rounded-full transition-colors ${hasSecondary ? 'bg-teal-600' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${hasSecondary ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">Add Secondary Insurance</span>
            </label>

            {hasSecondary && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Carrier</label>
                  <select className="input-field" value={secondary.carrier} onChange={(e) => setS('carrier', e.target.value)}>
                    {CARRIERS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Member ID</label>
                  <input className="input-field" value={secondary.memberId} onChange={(e) => setS('memberId', e.target.value)} placeholder="EM00000000" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Group Number</label>
                  <input className="input-field" value={secondary.groupNumber} onChange={(e) => setS('groupNumber', e.target.value)} placeholder="G-00000" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Relationship to Subscriber</label>
                  <select className="input-field" value={secondary.relationship} onChange={(e) => setS('relationship', e.target.value)}>
                    {RELATIONSHIPS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Subscriber Name</label>
                  <input className="input-field" value={secondary.subscriberName} onChange={(e) => setS('subscriberName', e.target.value)} placeholder="John Smith" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Subscriber DOB</label>
                  <input type="date" className="input-field" value={secondary.subscriberDob} onChange={(e) => setS('subscriberDob', e.target.value)} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700">
            Add Patient
          </button>
        </div>
      </form>
    </div>
  )
}

// ---- Patient Detail Panel ----
interface PatientDetailProps {
  patient: Patient
  onClose: () => void
}

function PatientDetailPanel({ patient, onClose }: PatientDetailProps) {
  const b = patient.benefits

  const frameRemaining = b.frames.allowance - b.frames.used
  const contactsRemaining = b.contacts.allowance - b.contacts.used

  function historyBadge(s: 'active' | 'inactive' | 'pending') {
    if (s === 'active') return <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Active</span>
    if (s === 'inactive') return <span className="rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">Inactive</span>
    return <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">Pending</span>
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-lg font-bold text-teal-700">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{getPatientFullName(patient)}</h2>
              <p className="text-xs text-slate-500">DOB: {formatDob(patient.dob)} &middot; {patient.gender} &middot; {patient.phone}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 px-6 py-5">
          {/* Contact info */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Contact</p>
            <div className="space-y-1 text-sm text-slate-700">
              <p>{patient.email}</p>
              <p>{patient.address}</p>
            </div>
          </div>

          {/* Insurance */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Primary Insurance</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><p className="text-xs text-slate-400">Carrier</p><p className="font-medium text-slate-800">{patient.primaryInsurance.carrier}</p></div>
              <div><p className="text-xs text-slate-400">Member ID</p><p className="font-medium text-slate-800">{patient.primaryInsurance.memberId}</p></div>
              <div><p className="text-xs text-slate-400">Group</p><p className="font-medium text-slate-800">{patient.primaryInsurance.groupNumber}</p></div>
              <div><p className="text-xs text-slate-400">Relationship</p><p className="font-medium text-slate-800">{patient.primaryInsurance.relationship}</p></div>
              <div className="col-span-2"><p className="text-xs text-slate-400">Subscriber</p><p className="font-medium text-slate-800">{patient.primaryInsurance.subscriberName}</p></div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Benefit Summary &mdash; {patient.primaryInsurance.carrier}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                {
                  icon: <Stethoscope className="h-4 w-4 text-teal-500" />,
                  label: 'Eye Exam',
                  value: b.exam.covered ? 'Covered' : 'Not covered',
                  sub: b.exam.used ? `Used ${formatDate(b.exam.usedDate ?? '')}` : 'Not used — available',
                  ok: b.exam.covered && !b.exam.used,
                },
                {
                  icon: <Glasses className="h-4 w-4 text-blue-500" />,
                  label: 'Frames',
                  value: `$${b.frames.allowance} allowance`,
                  sub: `$${b.frames.used} used / $${frameRemaining} remaining`,
                  ok: frameRemaining > 0,
                },
                {
                  icon: <Eye className="h-4 w-4 text-violet-500" />,
                  label: 'Lenses',
                  value: b.lenses.covered ? 'Covered pair' : 'Not covered',
                  sub: b.lenses.used ? `Used ${formatDate(b.lenses.usedDate ?? '')}` : 'Not used — available',
                  ok: b.lenses.covered && !b.lenses.used,
                },
                {
                  icon: <Contact2 className="h-4 w-4 text-amber-500" />,
                  label: 'Contacts',
                  value: b.contacts.allowance > 0 ? `$${b.contacts.allowance} allowance` : 'Not covered',
                  sub: b.contacts.allowance > 0 ? `$${b.contacts.used} used / $${contactsRemaining} remaining` : '—',
                  ok: contactsRemaining > 0,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50">
                    {row.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-700">{row.label}</p>
                    <p className="text-xs text-slate-500">{row.value}</p>
                    <p className={`mt-1 text-xs font-medium ${row.ok ? 'text-teal-600' : 'text-slate-400'}`}>{row.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-400">Benefit period ends: {formatDate(b.benefitPeriodEnd)} &middot; Exam copay: ${b.examCopay} &middot; Materials copay: ${b.materialsCopay}</p>
          </div>

          {/* Eligibility history */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Eligibility History</p>
            <div className="space-y-2">
              {patient.eligibilityHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{formatDate(h.date)}</p>
                    <p className="text-xs text-slate-400">Checked by {h.checkedBy}</p>
                  </div>
                  {historyBadge(h.status)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700">
            <ShieldCheck className="h-4 w-4" /> Run Verification
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <MessageSquare className="h-4 w-4" /> Send SMS
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- Main Page ----
export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>(PATIENTS)
  const [query, setQuery] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const filtered = patients.filter(
    (p) =>
      getPatientFullName(p).toLowerCase().includes(query.toLowerCase()) ||
      p.dob.includes(query) ||
      p.primaryInsurance.carrier.toLowerCase().includes(query.toLowerCase()) ||
      p.primaryInsurance.memberId.toLowerCase().includes(query.toLowerCase()),
  )

  const totalActive = patients.filter((p) => p.status === 'active').length
  const benefitsExpiring = patients.filter((p) => {
    const end = new Date(p.benefits.benefitPeriodEnd)
    const now = new Date()
    const diff = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 30
  }).length
  const unverified = patients.filter((p) => p.status === 'unverified').length

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: <Users className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
    { label: 'Active Insurance', value: totalActive, icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Benefits Expiring (30d)', value: benefitsExpiring, icon: <AlertTriangle className="h-5 w-5 text-amber-600" />, bg: 'bg-amber-50' },
    { label: 'Unverified', value: unverified, icon: <XCircle className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Patients</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your patient roster and insurance eligibility.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add Patient
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

      {/* Table */}
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
              placeholder="Search by name, DOB, or insurance..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
                <TableHead className="font-semibold text-slate-600">Last Verified</TableHead>
                <TableHead className="font-semibold text-slate-600">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer border-slate-100 hover:bg-teal-50/40 transition-colors"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {patient.firstName[0]}{patient.lastName[0]}
                      </div>
                      <span className="font-medium text-slate-800">{getPatientFullName(patient)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{formatDob(patient.dob)}</TableCell>
                  <TableCell className="text-sm text-slate-600">{patient.phone}</TableCell>
                  <TableCell className="text-sm text-slate-600">{patient.primaryInsurance.carrier}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{patient.primaryInsurance.memberId}</TableCell>
                  <TableCell className="text-sm text-slate-600">{formatDate(patient.lastVerified)}</TableCell>
                  <TableCell>{statusBadge(patient.status)}</TableCell>
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

      {showAdd && (
        <AddPatientModal
          onClose={() => setShowAdd(false)}
          onAdd={(p) => setPatients((prev) => [...prev, p])}
        />
      )}

      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  )
}
