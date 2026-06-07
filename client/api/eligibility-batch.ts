import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'
import { PAYER_IDS, parseBenefits } from './eligibility'

const SUPABASE_URL = 'https://jkqnqdmejclartbrknyj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcW5xZG1lamNsYXJ0YnJrbnlqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTk5MTgsImV4cCI6MjA5NDYzNTkxOH0.9UZ5Nkw101Za38oyqatwY2fsgaKeOllmJKNbNTxWwXM'

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = authHeader.replace('Bearer ', '')

  // Validate session
  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: { user }, error: authErr } = await authClient.auth.getUser(token)
  if (authErr || !user) return res.status(401).json({ error: 'Invalid session' })

  // Use service role for DB writes (bypasses RLS), fall back to user JWT
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const db = serviceKey
    ? createClient(SUPABASE_URL, serviceKey)
    : createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      })

  const { data: userData } = await db
    .from('users')
    .select('practice_id')
    .eq('id', user.id)
    .single()

  if (!userData?.practice_id) return res.status(400).json({ error: 'No practice found' })
  const practice_id = userData.practice_id

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  // Patients with insurance that need verification
  const { data: patients } = await db
    .from('patients')
    .select('id, first_name, last_name, date_of_birth, insurance_carrier, member_id, group_number')
    .eq('practice_id', practice_id)
    .not('insurance_carrier', 'is', null)
    .not('member_id', 'is', null)
    .neq('member_id', '')
    .limit(25)

  if (!patients?.length) {
    return res.json({ checked: 0, cached: 0, failed: 0, skipped: 0 })
  }

  // Find patients already checked in the last 30 days
  const { data: recentChecks } = await db
    .from('eligibility_checks')
    .select('patient_id')
    .in('patient_id', patients.map(p => p.id))
    .gte('checked_at', thirtyDaysAgo)

  const recentIds = new Set((recentChecks ?? []).map(c => c.patient_id))

  const toCheck = patients.filter(
    p => !recentIds.has(p.id) && p.member_id && PAYER_IDS[p.insurance_carrier]
  )
  const skipped = patients.length - recentIds.size - toCheck.length

  const apiKey = process.env.STEDI_API_KEY
  const practiceNpi = process.env.PRACTICE_NPI

  if (!apiKey || !practiceNpi) {
    return res.json({ checked: 0, cached: recentIds.size, failed: 0, skipped, note: 'Stedi not configured' })
  }

  let checked = 0
  let failed = 0
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '')

  for (const patient of toCheck) {
    try {
      const stediPayload = {
        controlNumber: String(Date.now()).slice(-9),
        tradingPartnerServiceId: PAYER_IDS[patient.insurance_carrier],
        provider: {
          organizationName: process.env.PRACTICE_NAME ?? 'Prizm Vision',
          npi: practiceNpi,
        },
        subscriber: {
          memberId: patient.member_id,
          firstName: patient.first_name ?? '',
          lastName: patient.last_name,
          dateOfBirth: patient.date_of_birth ? patient.date_of_birth.replace(/-/g, '') : '',
          ...(patient.group_number ? { groupNumber: patient.group_number } : {}),
        },
        encounter: {
          serviceTypeCodes: ['30', 'AL'],
          dateOfService: today,
        },
      }

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
          }
        )
      )

      if (!stediRes.ok) {
        failed++
        continue
      }

      const raw = await stediRes.json() as Record<string, unknown>
      const benefits = parseBenefits(raw)

      await db.from('eligibility_checks').insert({
        patient_id: patient.id,
        practice_id,
        frame_allowance: benefits.frameAllowance,
        cl_allowance: benefits.clAllowance,
        exam_copay: benefits.examCopay,
        deductible_met: false,
        expiration_date: benefits.planYear?.end || null,
        plan_name: benefits.planName ?? null,
        api_provider: 'stedi',
        // raw_response intentionally omitted — may contain PHI
      })

      checked++
    } catch {
      failed++
    }
  }

  return res.json({ checked, cached: recentIds.size, failed, skipped })
}
