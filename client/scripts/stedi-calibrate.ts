/**
 * Stedi parser calibration harness
 * ---------------------------------
 * Runs ONE eligibility check against Stedi TEST MODE and prints the raw 271
 * response next to what our parseBenefits() extracts from it. The point is to
 * see exactly where Stedi puts the dollar amounts (frame allowance, contact
 * lens allowance, copays) so we can tune the parser against real output instead
 * of guessing from the docs.
 *
 * SAFETY
 *   - Refuses to run unless STEDI_API_KEY starts with "test_". Calibration must
 *     use Stedi's sandbox, never a live key.
 *   - It prints the FULL raw response, so it must NEVER be pointed at a real
 *     patient's insurance card. Synthetic test data only.
 *
 * USAGE
 *   From the client/ folder:
 *
 *     STEDI_API_KEY=test_xxxxx npm run calibrate
 *
 *   Optional overrides (use the exact test subject Stedi shows you in the
 *   dashboard under Test mode, if the defaults below error out):
 *
 *     TEST_PAYER_ID=39026 \
 *     TEST_MEMBER_ID=W123456789 \
 *     TEST_FIRST=Jane TEST_LAST=Doe TEST_DOB=19800101 \
 *     PRACTICE_NPI=1234567893 \
 *     STEDI_API_KEY=test_xxxxx npm run calibrate
 *
 * After it prints, paste the "RAW STEDI RESPONSE" block back to me and I'll tune
 * parseBenefits() to match whatever shape Stedi actually returns.
 */

import { parseBenefits, PAYER_IDS } from '../api/eligibility'

const apiKey = process.env.STEDI_API_KEY
if (!apiKey) {
  console.error('✗ Set STEDI_API_KEY to your Stedi TEST key (starts with "test_").')
  process.exit(1)
}
if (!apiKey.startsWith('test_')) {
  console.error('✗ Refusing to run: STEDI_API_KEY is not a test_ key.')
  console.error('  Calibration must use Stedi TEST mode so it cannot touch a real')
  console.error('  patient or incur charges. Grab your test_ key from the Stedi dashboard.')
  process.exit(1)
}

// Defaults aim at VSP. If Stedi's sandbox rejects them, copy the exact test
// payer + member from the Stedi dashboard's "Test mode" sample and pass them in.
const payerId   = process.env.TEST_PAYER_ID  || PAYER_IDS['VSP']  // 39026
const memberId  = process.env.TEST_MEMBER_ID || 'W000000000'
const firstName = process.env.TEST_FIRST     || 'Jane'
const lastName  = process.env.TEST_LAST      || 'Doe'
const dob       = process.env.TEST_DOB       || '19800101'        // YYYYMMDD
const npi       = process.env.PRACTICE_NPI   || '1234567893'      // Stedi test NPI

const payload = {
  controlNumber: String(Date.now()).slice(-9),
  tradingPartnerServiceId: payerId,
  provider: {
    organizationName: process.env.PRACTICE_NAME || 'Prizm Vision',
    npi,
  },
  subscriber: {
    memberId,
    firstName,
    lastName,
    dateOfBirth: dob,
  },
  encounter: {
    serviceTypeCodes: ['30', 'AL'], // 30 = general, AL = vision
    dateOfService: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
  },
}

console.log('→ Sending TEST eligibility check to Stedi…')
console.log('  payer:', payerId, ' member:', memberId, ' subject:', firstName, lastName, '\n')

const res = await fetch(
  'https://healthcare.us.stedi.com/2024-04-01/change/medicalnetwork/eligibility/v3',
  {
    method: 'POST',
    headers: { Authorization: `Key ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  },
)

console.log('HTTP', res.status, res.statusText)
const raw = (await res.json()) as Record<string, unknown>

if (!res.ok) {
  console.error('\n✗ Stedi returned an error. Full body:\n')
  console.error(JSON.stringify(raw, null, 2))
  console.error('\nIf this is a payer/member error, open the Stedi dashboard → Test mode,')
  console.error('copy their sample test payer + member, and re-run with TEST_PAYER_ID / TEST_MEMBER_ID.')
  process.exit(1)
}

console.log('\n===== RAW STEDI RESPONSE (paste this block back to me) =====\n')
console.log(JSON.stringify(raw, null, 2))

const parsed = parseBenefits(raw)

console.log('\n===== WHAT OUR PARSER EXTRACTED =====\n')
console.log(JSON.stringify(parsed, null, 2))

console.log('\n===== CALIBRATION CHECKLIST =====')
const ok = (v: number) => (v > 0 ? '✓' : '✗ — find this $ in the raw block above')
console.log('  active coverage :', parsed.active ? '✓' : '✗')
console.log('  frame allowance :', `$${parsed.frameAllowance}`, ok(parsed.frameAllowance))
console.log('  CL allowance    :', `$${parsed.clAllowance}`, ok(parsed.clAllowance))
console.log('  exam copay      :', `$${parsed.examCopay}`)
console.log('  plan name       :', parsed.planName ?? '(none)')
console.log('  plan year       :', parsed.planYear.start || '?', '→', parsed.planYear.end || '?')
console.log(
  '\nIf any ✗ appears next to an amount you can see in the raw response,' +
  '\nthe parser needs a tweak — paste the raw block to me and I will fix it.\n',
)
