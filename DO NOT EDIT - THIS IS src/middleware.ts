import type { NextMiddleware } from 'next/server'

import { withHighlightLogging } from '~/middleware/highlight-logging.ts'

import { env } from './env.js'
import { withAuthentication } from './middleware/authentication.ts'
import { withAuthorization } from './middleware/authorization.ts'
import { withCanonicalHost } from './middleware/canonical-host.ts'
import { withCookieParams } from './middleware/cookie-params.ts'
import { withLegacyAuthentication } from './middleware/legacy-authentication.ts'
import { stackMiddlewares } from './middleware/utils/stack-middleware.ts'

const middleware: NextMiddleware = (req, event) => {
  if (env.NEXT_PUBLIC_MNTN_PASS === false) {
    return stackMiddlewares([
      withCanonicalHost(env),
      withCookieParams(env),
      withHighlightLogging(env),
      withLegacyAuthentication(env),
      withAuthorization(env),
    ])(req, event)
  }

  return stackMiddlewares([
    withCanonicalHost(env),
    withCookieParams(env),
    withHighlightLogging(env),
    withAuthentication(env),
  ])(req, event)
}

export default middleware

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|assets|favicon.ico|sw.js|\\.well-known).*)',
  ],
  unstable_allowDynamic: ['**/node_modules/lodash-es/**/*.js'],
}
