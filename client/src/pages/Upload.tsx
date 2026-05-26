import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Loader2,
  ArrowLeft,
} from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

interface ParsedRow {
  first_name: string
  last_name: string
  date_of_birth: string
  phone: string
  email: string
  insurance_carrier: string
  member_id: string
  group_number: string
  last_visit_date: string
  contact_lens_wearer: boolean
  // Rx frames
  last_frame_purchase: string
  last_frame_brand: string
  last_frame_model: string
  // Sunglasses
  last_sunglasses_purchase: string
  last_sunglasses_brand: string
  last_sunglasses_model: string
  // Contact lenses
  last_cl_order: string
  last_cl_brand: string
  cl_supply_days: number | null
  // Family / insurance relationship
  insurance_relationship: string
  subscriber_name: string
}

interface ValidationReport {
  ready: ParsedRow[]
  missingEmail: ParsedRow[]
  missingInsurance: ParsedRow[]
  duplicates: ParsedRow[]
}

// ── Normalization helpers ─────────────────────────────────────────────────────

function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 10)
}

function normalizeDate(raw: string): string | null {
  if (!raw || !raw.trim()) return null
  // MM/DD/YYYY → YYYY-MM-DD
  const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2, '0')}-${mdy[2].padStart(2, '0')}`
  // already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
  return null
}

const CARRIER_MAP: Record<string, string> = {
  'vision service plan': 'VSP',
  'vsp inc': 'VSP',
  'vsp': 'VSP',
  'eyemed': 'EyeMed',
  'eye med': 'EyeMed',
  'luxottica': 'EyeMed',
  'davis vision': 'Davis Vision',
  'davis': 'Davis Vision',
  'spectera': 'Spectera',
  'uhc vision': 'UHC Vision',
  'united healthcare vision': 'UHC Vision',
  'metlife vision': 'MetLife Vision',
  'metlife': 'MetLife Vision',
}

function normalizeCarrier(raw: string): string {
  if (!raw) return ''
  return CARRIER_MAP[raw.toLowerCase().trim()] ?? raw.trim()
}

function normalizeCLSupplyDays(raw: string): number | null {
  if (!raw) return null
  const lower = raw.toLowerCase()
  if (lower.includes('annual') || lower.includes('year')) return 365
  const n = parseInt(raw.replace(/\D/g, ''), 10)
  if (isNaN(n) || n <= 0) return null
  if (n <= 30) return 30
  if (n <= 60) return 60
  if (n <= 90) return 90
  return 365
}

function normalizeRelationship(raw: string): string {
  const r = raw.toLowerCase().trim()
  if (['self', 'insured', 'subscriber', 'member'].includes(r)) return 'Self'
  if (['spouse', 'husband', 'wife', 'partner', 'domestic partner'].includes(r)) return 'Spouse'
  if (['child', 'dependent', 'son', 'daughter', 'kid', 'student'].includes(r)) return 'Child'
  if (r) return 'Other'
  return ''
}

// ── CSV parsing ───────────────────────────────────────────────────────────────

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split(/\r?\n/)
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
  })
  return { headers, rows }
}

// Column mapping: their header → our field
const FIELD_OPTIONS = [
  // Demographics
  { value: 'first_name',           label: 'First Name' },
  { value: 'last_name',            label: 'Last Name' },
  { value: 'date_of_birth',        label: 'Date of Birth' },
  { value: 'phone',                label: 'Phone' },
  { value: 'email',                label: 'Email' },
  // Insurance
  { value: 'insurance_carrier',    label: 'Insurance Carrier' },
  { value: 'member_id',            label: 'Member ID' },
  { value: 'group_number',         label: 'Group Number' },
  { value: 'insurance_relationship', label: 'Relationship to Subscriber' },
  { value: 'subscriber_name',      label: 'Subscriber Name' },
  // Visit
  { value: 'last_visit_date',      label: 'Last Visit Date' },
  // Rx frames
  { value: 'last_frame_purchase',  label: 'Last Frame Purchase Date' },
  { value: 'last_frame_brand',     label: 'Last Frame Brand' },
  { value: 'last_frame_model',     label: 'Last Frame Model / Style' },
  // Sunglasses
  { value: 'last_sunglasses_purchase', label: 'Last Sunglasses Purchase Date' },
  { value: 'last_sunglasses_brand', label: 'Last Sunglasses Brand' },
  { value: 'last_sunglasses_model', label: 'Last Sunglasses Model' },
  // Contact lenses
  { value: 'contact_lens_wearer',  label: 'Contact Lens Wearer' },
  { value: 'last_cl_order',        label: 'Last CL Order Date' },
  { value: 'last_cl_brand',        label: 'CL Brand' },
  { value: 'cl_supply_days',       label: 'CL Supply Days (30 / 60 / 90 / 365)' },
  { value: '__skip__',             label: '— Skip this column —' },
]

const REQUIRED_FIELDS = ['first_name', 'last_name']

// Auto-detect mappings from common header names across RevolutionEHR, Eyefinity, Crystal PM, etc.
function autoMap(headers: string[]): Record<string, string> {
  const map: Record<string, string> = {}
  const n = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  headers.forEach(h => {
    const k = n(h)
    // Demographics
    if      (['firstname', 'first', 'fname'].includes(k))                                       map[h] = 'first_name'
    else if (['lastname', 'last', 'lname'].includes(k))                                         map[h] = 'last_name'
    else if (['dob', 'dateofbirth', 'birthdate', 'birthday'].includes(k))                       map[h] = 'date_of_birth'
    else if (['phone', 'cell', 'mobile', 'phonenumber', 'cellphone', 'homephone'].includes(k)) map[h] = 'phone'
    else if (['email', 'emailaddress', 'mail'].includes(k))                                     map[h] = 'email'
    // Insurance core
    else if (['carrier', 'insurance', 'insurancecarrier', 'plan', 'insuranceprovider', 'visionplan', 'primarycarrier'].includes(k)) map[h] = 'insurance_carrier'
    else if (['memberid', 'insid', 'insuranceid', 'policyid', 'primarymemberid'].includes(k))  map[h] = 'member_id'
    else if (['groupnumber', 'group', 'groupid', 'groupno', 'primarygroupnumber'].includes(k)) map[h] = 'group_number'
    // Insurance relationship / family
    else if (['relationship', 'insurancerelationship', 'subscriberrelationship', 'insuredrelationship', 'relationshiptosubscriber', 'reltosubscriber', 'patientrelationship'].includes(k)) map[h] = 'insurance_relationship'
    else if (['subscribername', 'policyholder', 'insuredname', 'subscriber', 'policyholdernaem', 'insuredfirstlast', 'guarantorname'].includes(k)) map[h] = 'subscriber_name'
    // Visit
    else if (['lastvisit', 'lastvisitdate', 'lastappointment', 'lastappt', 'lastexam', 'lastexamdate'].includes(k)) map[h] = 'last_visit_date'
    // Rx frames
    else if (['lastframepurchase', 'lastframepurchasedate', 'framedate', 'lastframedate', 'framepurchasedate', 'rxframedate'].includes(k)) map[h] = 'last_frame_purchase'
    else if (['lastframebrand', 'framebrand', 'rxframebrand', 'framemfr', 'framemanufacturer', 'mfr', 'brand'].includes(k)) map[h] = 'last_frame_brand'
    else if (['lastframemodel', 'framemodel', 'framestyle', 'frameskn', 'style', 'framesku'].includes(k)) map[h] = 'last_frame_model'
    // Sunglasses
    else if (['lastsuglasses', 'sunglassesdate', 'lastsg', 'sundate', 'lastsunglassespurchase', 'sgdate'].includes(k)) map[h] = 'last_sunglasses_purchase'
    else if (['sunglassesbrand', 'sgbrand', 'sunbrand', 'planobrand', 'sunglasbrand'].includes(k)) map[h] = 'last_sunglasses_brand'
    else if (['sunglassesmodel', 'sgmodel', 'sunmodel', 'sunglasstyle'].includes(k))           map[h] = 'last_sunglasses_model'
    // Contact lenses
    else if (['contactlens', 'contactlenswearer', 'clwearer', 'wearscl', 'wearscontacts'].includes(k)) map[h] = 'contact_lens_wearer'
    else if (['lastclorder', 'lastclorderdate', 'clorderdate', 'contactlensdate', 'lastcontactlens', 'lastcl', 'cldate', 'lastclpurchase'].includes(k)) map[h] = 'last_cl_order'
    else if (['clbrand', 'contactlensbrand', 'lensbrand', 'contactbrand', 'cllens'].includes(k)) map[h] = 'last_cl_brand'
    else if (['clsupply', 'clsupplydays', 'supplycldays', 'contactsupply', 'cldays', 'supplydays', 'lensdays', 'clsupplylength'].includes(k)) map[h] = 'cl_supply_days'
    else map[h] = '__skip__'
  })
  return map
}

// ── Main component ────────────────────────────────────────────────────────────

type Step = 'upload' | 'mapping' | 'validation' | 'importing'

export default function UploadPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [step, setStep] = useState<Step>('upload')
  const [fileName, setFileName] = useState('')
  const [headers, setHeaders] = useState<string[]>([])
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [report, setReport] = useState<ValidationReport | null>(null)
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState('')

  // ── File handling ──────────────────────────────────────────────────────────

  function handleFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file.')
      return
    }
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      const { headers, rows } = parseCSV(text)
      setHeaders(headers)
      setRawRows(rows)
      setMapping(autoMap(headers))
      setStep('mapping')
    }
    reader.readAsText(file)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  // ── Validation ─────────────────────────────────────────────────────────────

  function buildValidationReport() {
    const seen = new Set<string>()
    const report: ValidationReport = { ready: [], missingEmail: [], missingInsurance: [], duplicates: [] }

    rawRows.forEach(row => {
      const mapped: Record<string, string> = {}
      headers.forEach(h => {
        const field = mapping[h]
        if (field && field !== '__skip__') mapped[field] = row[h] ?? ''
      })

      const contact_lens_wearer = ['true', '1', 'yes', 'y'].includes((mapped.contact_lens_wearer ?? '').toLowerCase())
      const patient: ParsedRow = {
        first_name:     mapped.first_name?.trim() ?? '',
        last_name:      mapped.last_name?.trim() ?? '',
        date_of_birth:  normalizeDate(mapped.date_of_birth ?? ''),
        phone:          normalizePhone(mapped.phone ?? ''),
        email:          mapped.email?.trim() ?? '',
        insurance_carrier: normalizeCarrier(mapped.insurance_carrier ?? ''),
        member_id:      mapped.member_id?.trim() ?? '',
        group_number:   mapped.group_number?.trim() ?? '',
        last_visit_date: normalizeDate(mapped.last_visit_date ?? ''),
        contact_lens_wearer,
        // Rx frames
        last_frame_purchase: normalizeDate(mapped.last_frame_purchase ?? ''),
        last_frame_brand:    mapped.last_frame_brand?.trim() ?? '',
        last_frame_model:    mapped.last_frame_model?.trim() ?? '',
        // Sunglasses
        last_sunglasses_purchase: normalizeDate(mapped.last_sunglasses_purchase ?? ''),
        last_sunglasses_brand:    mapped.last_sunglasses_brand?.trim() ?? '',
        last_sunglasses_model:    mapped.last_sunglasses_model?.trim() ?? '',
        // Contact lenses
        last_cl_order:   normalizeDate(mapped.last_cl_order ?? ''),
        last_cl_brand:   mapped.last_cl_brand?.trim() ?? '',
        cl_supply_days:  normalizeCLSupplyDays(mapped.cl_supply_days ?? ''),
        // Family
        insurance_relationship: normalizeRelationship(mapped.insurance_relationship ?? ''),
        subscriber_name: mapped.subscriber_name?.trim() ?? '',
      }

      if (!patient.first_name || !patient.last_name) return

      const key = `${patient.first_name.toLowerCase()}|${patient.last_name.toLowerCase()}|${patient.date_of_birth}`
      if (seen.has(key)) { report.duplicates.push(patient); return }
      seen.add(key)

      if (!patient.email) report.missingEmail.push(patient)
      if (!patient.insurance_carrier) report.missingInsurance.push(patient)
      if (patient.email && patient.insurance_carrier) report.ready.push(patient)
    })

    setReport(report)
    setStep('validation')
  }

  // ── Import ─────────────────────────────────────────────────────────────────

  async function handleImport() {
    if (!report || !user) return
    setImporting(true)
    setImportError('')

    try {
      // Get the practice_id for the logged-in user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('practice_id')
        .eq('id', user.id)
        .single()
      if (userError) throw userError

      const practice_id = userData.practice_id
      const allPatients = [
        ...report.ready,
        ...report.missingEmail,
        ...report.missingInsurance,
      ]

      // Insert in batches of 100
      for (let i = 0; i < allPatients.length; i += 100) {
        const batch = allPatients.slice(i, i + 100).map(p => ({ ...p, practice_id }))
        const { error } = await supabase.from('patients').insert(batch)
        if (error) throw error
      }

      navigate('/app/patients?imported=true')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Import failed. Please try again.'
      setImportError(msg)
      setImporting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (step === 'upload') return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => navigate('/app/patients')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </button>
      <h1 className="text-xl font-bold text-slate-800 mb-1">Import Patients</h1>
      <p className="text-sm text-slate-500 mb-6">Upload a CSV export from your EHR. We'll map the columns and verify insurance automatically.</p>

      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          dragging ? 'border-teal-400 bg-teal-50' : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
        }`}
      >
        <Upload className="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-700 mb-1">Drop your CSV here or click to browse</p>
        <p className="text-xs text-slate-400">Supports exports from RevolutionEHR, Eyefinity, Crystal PM, and any EHR</p>
        <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
        <p className="text-xs font-semibold text-slate-600 mb-1">Need a sample file?</p>
        <p className="text-xs text-slate-500">
          Download <a href="/sample-patients.csv" download className="text-teal-600 hover:underline font-medium">sample-patients.csv</a> to see the expected format and test the upload flow.
        </p>
      </div>
    </div>
  )

  if (step === 'mapping') return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => setStep('upload')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <h1 className="text-xl font-bold text-slate-800 mb-1">Map Your Columns</h1>
      <p className="text-sm text-slate-500 mb-6">
        We auto-detected your column names from <span className="font-medium text-slate-700">{fileName}</span>. Adjust any that look wrong.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden mb-6">
        <div className="grid grid-cols-2 gap-0 px-4 py-2 bg-slate-50 border-b border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Your Column</p>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Maps To</p>
        </div>
        {headers.map(h => (
          <div key={h} className="grid grid-cols-2 items-center gap-4 px-4 py-2.5 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              <span className="text-sm text-slate-700 truncate">{h}</span>
            </div>
            <select
              value={mapping[h] ?? '__skip__'}
              onChange={e => setMapping(m => ({ ...m, [h]: e.target.value }))}
              className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
            >
              {FIELD_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ))}
      </div>

      {REQUIRED_FIELDS.some(f => !Object.values(mapping).includes(f)) && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700">First Name and Last Name are required fields.</p>
        </div>
      )}

      <button
        onClick={buildValidationReport}
        disabled={REQUIRED_FIELDS.some(f => !Object.values(mapping).includes(f))}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-sm font-bold text-white hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Validate {rawRows.length} rows <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )

  if (step === 'validation' && report) {
    const total = report.ready.length + report.missingEmail.length + report.missingInsurance.length
    return (
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setStep('mapping')} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-xl font-bold text-slate-800 mb-1">Validation Report</h1>
        <p className="text-sm text-slate-500 mb-6">Review before importing. Patients with issues are still imported — just flagged.</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">{report.ready.length} patients ready</p>
              <p className="text-xs text-emerald-600">Have email and insurance — eligible for campaigns</p>
            </div>
          </div>
          {report.missingEmail.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">{report.missingEmail.length} missing email</p>
                <p className="text-xs text-amber-600">Can receive SMS campaigns only</p>
              </div>
            </div>
          )}
          {report.missingInsurance.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">{report.missingInsurance.length} missing insurance</p>
                <p className="text-xs text-amber-600">Cannot verify benefits until insurance is added</p>
              </div>
            </div>
          )}
          {report.duplicates.length > 0 && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-800">{report.duplicates.length} duplicates skipped</p>
                <p className="text-xs text-red-600">Same name + date of birth already in this file</p>
              </div>
            </div>
          )}
        </div>

        {importError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4">
            <p className="text-sm text-red-700">{importError}</p>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={importing || total === 0}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-3.5 text-sm font-bold text-white hover:bg-teal-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {importing ? <><Loader2 className="h-4 w-4 animate-spin" /> Importing…</> : `Import ${total} patients`}
        </button>
      </div>
    )
  }

  return null
}
