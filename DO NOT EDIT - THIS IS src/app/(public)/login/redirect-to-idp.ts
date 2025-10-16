import type { UserAuthConnection } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'

/**
 * Redirects the user to the Identity Provider (IdP) login page.
 * @param authConnection - The login method to use for authentication.
 * @param loginHint - A hint to the IdP about the user's email address or username.
 */
export const redirectToIdp = (
  w: Window & typeof globalThis,
  authConnection: UserAuthConnection,
  loginHint: string,
  returnTo?: string
) => {
  const url = new URL('/auth/login', w.location.origin)
  const queryRecord = {
    connection: authConnection,
    login_hint: loginHint,
    scope: 'openid profile email offline_access',
    returnTo: returnTo ?? '',
  }
  const queryParams = new URLSearchParams(queryRecord)

  url.search = queryParams.toString()

  const href = url.toString()
  logger.debug('redirectToIdp', {
    origin: w.location.origin,
    queryRecord,
    queryParams,
    href,
  })

  w.location.href = href
}
