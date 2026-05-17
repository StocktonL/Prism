import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'

const router = Router()

interface CreateCampaignBody {
  name: string
  type: 'recall' | 'promotion' | 'appointment'
  audienceFilter?: Record<string, unknown>
  scheduledDate?: string
  message: string
}

/**
 * GET /api/campaigns
 * Returns all campaigns for the authenticated practice.
 * Protected — requires valid Clerk session token.
 */
router.get('/', requireAuth, async (_req: Request, res: Response) => {
  // TODO: query from db
  const placeholder = [
    { id: 1, name: 'Q2 Annual Recall', status: 'active', sent: 388, audience: 432 },
    { id: 2, name: 'Spring Frame Promotion', status: 'completed', sent: 1201, audience: 1204 },
  ]
  res.json({ data: placeholder, total: placeholder.length })
})

/**
 * POST /api/campaigns
 * Creates a new SMS campaign (draft state).
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const body = req.body as CreateCampaignBody

  if (!body.name || !body.type || !body.message) {
    res.status(400).json({ error: 'name, type, and message are required' })
    return
  }

  // TODO: insert into db, queue SMS via provider (e.g. Twilio)
  const campaign = {
    id: Date.now(),
    ...body,
    status: 'draft',
    createdAt: new Date().toISOString(),
  }

  res.status(201).json({ data: campaign })
})

/**
 * POST /api/campaigns/:id/send
 * Triggers sending of a draft campaign.
 */
router.post('/:id/send', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params
  // TODO: fetch campaign, validate, enqueue SMS jobs
  res.json({ id, status: 'sending', startedAt: new Date().toISOString() })
})

/**
 * DELETE /api/campaigns/:id
 * Deletes a draft campaign.
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params
  // TODO: soft-delete in db
  res.json({ id, deleted: true })
})

export default router
