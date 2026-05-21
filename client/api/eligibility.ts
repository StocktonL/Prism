import type { VercelRequest, VercelResponse } from '@vercel/node'

// Stedi/Change Healthcare payer IDs for vision carriers
const PAYER_IDS: Record<string, string> = {
  'VSP':          '39026',
  'EyeMed':       '68068',
  'Davis Vision': '48714',
  'Spectera':     '98798',
  'Anthem':       '00601',
  'UHC Vision':   '87726',
  'Humana':       '61101',
}

interface EligibilityRequestBody {
  carrier: string
  memberId: string
  groupNumber?: string
  subscriberFirstName: string
  subscriberLastName: string
  subscriberDob: string   // YYYY-MM-DD
  relationship: string
  dateOfService?: string  // YYYY-MM-DD
}

export interface ParsedBenefits {
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

function formatDob(dob: string): string {
  return dob.replace(/-/g, '')
}

function controlNumber(): string {
  return String(Date.now()).slice(-9)
}

// Parse the Stedi JSON 271 response into benefit amounts we actually use.
// The 271 structure varies by payer — VSP and EyeMed return different field paths.
// We log the raw response so parsing can be refined on real test data.
function parseBenefits(raw: Record<string, unknown>): ParsedBenefits {
  const result: ParsedBenefits = {
    active: false,
    planYear: { start: '', end: '' },
    frameAllowance: 0,
    frameUsed: 0,
    clAllowance: 0,
    clUsed: 0,
    examCopay: 0,
    materialsCopay: 0,
    examEligible: false,
    requiresPriorAuth: false,
    oonFrameAllowance: 0,
    oonClAllowance: 0,
    oonExamAllowance: 0,
  }

  const benefits = (raw.benefitsInformation as Record<string, unknown>[]) ?? []

  for (const b of benefits) {
    const code = String(b.code ?? '')
    const name = String(b.name ?? '').toLowerCase()
    const serviceCodes = (b.serviceTypeCodes as string[]) ?? []
    const amount = parseFloat(String(b.benefitAmount ?? '0')) || 0
    const inNetwork = String(b.inPlanNetworkIndicatorCode ?? '').toLowerCase()
    const isOON = inNetwork === 'n' || inNetwork === 'no'

    // Active coverage
    if (code === '1') result.active = true

    // Exam eligibility — service type 98 (professional visit) or 30 (general)
    if (serviceCodes.includes('98') || serviceCodes.includes('30')) {
      if (code === '1') result.examEligible = true
      // Copay
      if (code === 'B' && !isOON) result.examCopay = amount
      // Next eligible date
      if (b.eligibilityBeginDate) result.nextEligibleDate = String(b.eligibilityBeginDate)
    }

    // Frame / spectacle allowance — service types 88 (vision items) or 30
    if (serviceCodes.includes('88') || (serviceCodes.includes('30') && name.includes('frame'))) {
      if (code === 'F' || name.includes('allowance') || name.includes('benefit')) {
        if (isOON) result.oonFrameAllowance = amount
        else if (amount > 0) result.frameAllowance = amount
      }
      // Materials copay
      if (code === 'B' && !isOON) result.materialsCopay = amount
      // Used amount
      if (code === 'C' || name.includes('used') || name.includes('deductible met')) {
        result.frameUsed = amount
      }
    }

    // Contact lens allowance — service type AL (vision) or specific CL codes
    if (serviceCodes.includes('AL') || name.includes('contact lens') || name.includes('contacts')) {
      if (code === 'F' || name.includes('allowance') || name.includes('benefit')) {
        if (isOON) result.oonClAllowance = amount
        else if (amount > 0) result.clAllowance = amount
      }
      if (code === 'C') result.clUsed = amount
    }

    // OON exam
    if ((serviceCodes.includes('98') || serviceCodes.includes('30')) && isOON && amount > 0) {
      result.oonExamAllowance = amount
    }

    // Prior auth
    if (name.includes('prior authorization') || code === 'AR') {
      result.requiresPriorAuth = true
    }
  }

  // Plan year from date information
  const dateInfo = raw.planDateInformation as Record<string, string> | undefined
  if (dateInfo) {
    result.planYear.start = dateInfo.eligibilityBegin ?? dateInfo.planBegin ?? ''
    result.planYear.end   = dateInfo.eligibilityEnd   ?? dateInfo.planEnd   ?? ''
  }

  // Plan name
  const payer = raw.payer as Record<string, string> | undefined
  if (payer?.name) result.planName = payer.name

  return result
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const {
    carrier,
    memberId,
    groupNumber,
    subscriberFirstName,
    subscriberLastName,
    subscriberDob,
    dateOfService,
  } = req.body as EligibilityRequestBody

  if (!memberId || !carrier || !subscriberLastName) {
    return res.status(400).json({ error: 'carrier, memberId, and subscriberLastName are required' })
  }

  const payerId = PAYER_IDS[carrier]
  if (!payerId) {
    return res.status(400).json({
      error: `Carrier "${carrier}" not supported yet. Supported: ${Object.keys(PAYER_IDS).join(', ')}`,
    })
  }

  const apiKey = process.env.STEDI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'STEDI_API_KEY not configured in environment' })
  }

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')

  const stediPayload = {
    controlNumber: controlNumber(),
    tradingPartnerServiceId: payerId,
    provider: {
      organizationName: process.env.PRACTICE_NAME ?? 'Prizm Vision',
      npi: process.env.PRACTICE_NPI ?? '1234567893', // replace with real NPI
    },
    subscriber: {
      memberId,
      firstName: subscriberFirstName || '',
      lastName: subscriberLastName,
      dateOfBirth: subscriberDob ? formatDob(subscriberDob) : '',
      ...(groupNumber ? { groupNumber } : {}),
    },
    encounter: {
      serviceTypeCodes: ['30', 'AL'],  // 30=general, AL=vision
      dateOfService: dateOfService ? dateOfService.replace(/-/g, '') : today,
    },
  }

  try {
    const stediRes = await fetch(
      'https://healthcare.us.stedi.com/2024-04-01/change/medicalnetwork/eligibility/v3',
      {
        method: 'POST',
        headers: {
          Authorization: `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stediPayload),
      },
    )

    if (!stediRes.ok) {
      const errText = await stediRes.text()
      console.error('Stedi error', stediRes.status, errText)
      return res.status(stediRes.status).json({ error: 'Eligibility check failed', detail: errText })
    }

    const raw = await stediRes.json() as Record<string, unknown>
    const benefits = parseBenefits(raw)

    return res.json({
      carrier,
      memberId,
      benefits,
      checkedAt: new Date().toISOString(),
      raw, // retained for debugging — remove once parsing is verified
    })
  } catch (err) {
    console.error('Stedi request failed:', err)
    return res.status(500).json({ error: 'Could not reach eligibility network. Try again.' })
  }
}
