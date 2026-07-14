// HIPAA audit logging — PHI read events.
//
// Call logRead() immediately after any successful Supabase query that returns
// PHI (patients, eligibility_checks, campaign_messages). The actual database
// INSERT is done server-side via /api/audit-log so the service role key is
// never exposed to the browser.
//
// This is intentionally fire-and-forget: never await the return value, and
// never let a failure here bubble up or block the UI.

export function logRead(params: {
  action: 'READ_PATIENT_LIST' | 'READ_ELIGIBILITY' | 'READ_CAMPAIGN_MESSAGES'
  resource_type: string
  resource_id?: string
  user_id: string
  practice_id: string
}): void {
  fetch('/api/audit-log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).catch(() => {
    // Silently discard — audit log failures must never break the app or
    // expose information in the browser console.
  })
}
