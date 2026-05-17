import { Router, Request, Response } from 'express'
import { requireAuth } from '../middleware/auth'

const router = Router()

interface EligibilityCheckBody {
  patientId: string
  insuranceId: string
  dateOfService?: string
}

/**
 * POST /api/eligibility/check
 * Submits an eligibility verification request.
 * Protected — requires valid Clerk session token.
 */
router.post('/check', requireAuth, async (req: Request, res: Response) => {
  const { patientId, insuranceId, dateOfService } = req.body as EligibilityCheckBody

  if (!patientId || !insuranceId) {
    res.status(400).json({ error: 'patientId and insuranceId are required' })
    return
  }

  // TODO: integrate with real eligibility API (e.g. Change Healthcare, Availity)
  const result = {
    patientId,
    insuranceId,
    dateOfService: dateOfService ?? new Date().toISOString().slice(0, 10),
    status: 'verified' as const,
    benefitsActive: true,
    copay: '$20',
    checkedAt: new Date().toISOString(),
  }

  res.json({ data: result })
})

/**
 * GET /api/eligibility/:patientId
 * Returns the most recent eligibility result for a patient.
 */
router.get('/:patientId', requireAuth, async (req: Request, res: Response) => {
  const { patientId } = req.params
  // TODO: query from db
  res.json({
    patientId,
    status: 'verified',
    checkedAt: new Date().toISOString(),
  })
})

export default router
