import type { VercelRequest, VercelResponse } from '@vercel/node'

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt === maxRetries) throw err
      const delay = Math.min(100 * Math.pow(2, attempt) * (1 + Math.random() * 0.1), 5000)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Max retries exceeded')
}

// Stedi/Change Healthcare payer IDs for vision carriers
export const PAYER_IDS: Record<string, string> = {
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
export function parseBenefits(raw: Record<string, unknown>): ParsedBenefits {
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

  const practiceNpi = process.env.PRACTICE_NPI
  if (!practiceNpi) {
    return res.status(500).json({ error: 'Practice NPI not configured. Contact support.' })
  }

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')

  const stediPayload = {
    controlNumber: controlNumber(),
    tradingPartnerServiceId: payerId,
    provider: {
      organizationName: process.env.PRACTICE_NAME ?? 'Prizm Vision',
      npi: practiceNpi,
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

  // TODO: Check eligibility_checks table for cached result < 30 days old
  // const cached = await checkEligibilityCache(patientId, carrier)
  // if (cached) return res.json(cached)
  // Requires Supabase service role connection — implement when Supabase is wired

  try {
    const stediRes = await withRetry(() =>
      fetch(
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
    )

    if (!stediRes.ok) {
      // Log only the status code — errText may contain PHI from the upstream payer
      console.error('Stedi eligibility check failed:', stediRes.status)
      return res.status(502).json({ error: 'Eligibility check failed. Please try again.' })
    }

    const raw = await stediRes.json() as Record<string, unknown>
    const benefits = parseBenefits(raw)

    return res.json({
      carrier,
      memberId,
      benefits,
      checkedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Stedi request failed:', err instanceof Error ? err.message : 'unknown')
    return res.status(500).json({ error: 'Could not reach eligibility network. Try again.' })
  }
}
