import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'

const router = Router()

/**
 * GET /api/patients
 * Returns paginated patient list.
 * Protected — requires valid Clerk session token.
 */
router.get('/', requireAuth, async (_req: Request, res: Response) => {
  // TODO: replace with real DB query using db/index.ts
  // const { rows } = await query('SELECT * FROM patients ORDER BY last_name LIMIT $1 OFFSET $2', [limit, offset])
  const placeholder = [
    { id: 1, name: 'Sarah Mitchell', insurance: 'VSP Vision', eligibilityStatus: 'verified' },
    { id: 2, name: 'James Thornton', insurance: 'EyeMed', eligibilityStatus: 'verified' },
  ]
  res.json({ data: placeholder, total: placeholder.length })
})

/**
 * GET /api/patients/:id
 * Returns a single patient record.
 */
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const { id } = req.params
  // TODO: query('SELECT * FROM patients WHERE id = $1', [id])
  res.json({ id, name: 'Placeholder Patient' })
})

/**
 * POST /api/patients
 * Creates a new patient record.
 */
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const body = req.body as Record<string, unknown>
  // TODO: insert into db
  res.status(201).json({ id: Date.now(), ...body })
})

export default router
