import { Request, Response, NextFunction } from 'express'
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node'

/**
 * Clerk JWT verification middleware.
 * Attaches the decoded session claims to `req.auth`.
 *
 * Usage:
 *   router.get('/protected', requireAuth, handler)
 *
 * Requires CLERK_SECRET_KEY to be set in the environment.
 */
export const requireAuth = ClerkExpressRequireAuth()

/**
 * Error-handling wrapper that formats Clerk auth errors as JSON.
 */
export function handleAuthError(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err.message === 'Unauthenticated') {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  next(err)
}
