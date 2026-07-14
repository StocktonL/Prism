import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// Only these three PHI read actions are accepted.
// Any other value is rejected so callers cannot inject arbitrary action strings.
const ALLOWED_ACTIONS = new Set([
  'READ_PATIENT_LIST',
  'READ_ELIGIBILITY',
  'READ_CAMPAIGN_MESSAGES',
])

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { action, resource_type, resource_id, user_id, practice_id } =
    (req.body ?? {}) as Record<string, string | undefined>

  // All four core fields are required — resource_id is optional (null for list reads)
  if (!action || !resource_type || !user_id || !practice_id) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  if (!ALLOWED_ACTIONS.has(action)) {
    return res.status(400).json({ error: 'Invalid action' })
  }

  // Service role key bypasses RLS so the serverless function can always write
  // audit records even when the user's session has restrictions.
  // NEVER expose this key to the browser.
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Prefer the leftmost IP in x-forwarded-for (the originating client address).
  // Fall back to the socket remote address when the header is absent.
  const forwarded = req.headers['x-forwarded-for']
  const ip =
    (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ??
    req.socket?.remoteAddress ??
    null

  // No PHI in the audit log row — only who, what table, when, from where.
  await supabase.from('audit_logs').insert({
    action,
    resource_type,
    resource_id: resource_id ?? null,
    user_id,
    practice_id,
    ip_address: ip,
  })

  // Always return 200. A logging failure must never surface to the user or
  // block any UI flow.
  return res.status(200).json({ ok: true })
}
