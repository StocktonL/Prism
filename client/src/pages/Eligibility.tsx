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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

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

const recentVerifications: VerificationRecord[] = [
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
    patient: 'Marcus Webb',
    dob: '04/05/1990',
    insurance: 'Spectera',
    memberId: 'SP77123456',
    checkedAt: '3 hr ago',
    status: 'pending',
  },
]

const statusConfig = {
  active: { label: 'Active', icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Inactive', icon: <XCircle className="h-3.5 w-3.5" />, className: 'bg-red-50 text-red-700 border-red-200' },
  pending: { label: 'Pending', icon: <Clock className="h-3.5 w-3.5" />, className: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const todayStats = [
  { label: 'Verifications Run', value: '38', icon: <ShieldCheck className="h-5 w-5 text-teal-600" />, bg: 'bg-teal-50' },
  { label: 'Active Benefits', value: '31', icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />, bg: 'bg-emerald-50' },
  { label: 'Inactive / Issues', value: '4', icon: <XCircle className="h-5 w-5 text-red-500" />, bg: 'bg-red-50' },
  { label: 'Avg Response Time', value: '1.2s', icon: <RefreshCw className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
]

export default function Eligibility() {
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(1)

  const filtered = recentVerifications.filter(
    (v) =>
      v.patient.toLowerCase().includes(search.toLowerCase()) ||
      v.insurance.toLowerCase().includes(search.toLowerCase()) ||
      v.memberId.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Eligibility Verification</h2>
          <p className="mt-1 text-sm text-slate-500">
            Real-time benefit checks via Stedi — exam, frames, lenses, and contacts.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 transition-colors">
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

                  {/* Expanded benefit details */}
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
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
