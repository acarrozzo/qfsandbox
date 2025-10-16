import {
  AuthenticationLogger,
  authenticate,
} from '@mntn-dev/authentication-server'
import { s } from '@mntn-dev/session'

import { env } from '~/env.js'

// Since middleware doesn't run for this route (via Vercel's subrequest feature when requested from middleware,) there are two challenges needing manually solved:
// 1. Authentication. How can we authenticate the request without middleware?
// 2. Claims. We need to pull out the primary_email claim to look up the right principal.
export const getAuthClaims = async (req: Request) => {
  if (env.NEXT_PUBLIC_MNTN_PASS) {
    // Clerk

    const authentication = await authenticate(req)

    if (!authentication) {
      AuthenticationLogger.info('Request authentication failed.')
      return undefined
    }

    return authentication.claims
  }

  // Auth0
  const session = await s.getAuthenticatedSession()
  return session.authn?.claims
}
