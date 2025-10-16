import {
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from 'next/server'

import { buildCurrentUrl, eatUrlCookies, loginUrl } from '@mntn-dev/app-routing'
import { clerkMiddleware } from '@mntn-dev/authentication-server'
import { authConfig } from '@mntn-dev/authentication-types'

import { env } from '~/env.js'
import {
  type MiddlewareChain,
  stackMiddlewares,
} from '~/middleware/utils/stack-middleware'

import { withAuthorization } from './authorization.ts'
import { withCanonicalHost } from './canonical-host.ts'
import { withPrincipal } from './principal.ts'
import type { RequiredEnvVars } from './types.ts'
import { shouldAuthenticate } from './utils/should-authenticate.ts'

export const withAuthentication: (env: RequiredEnvVars) => MiddlewareChain =
  (_env: RequiredEnvVars) =>
  (next: NextMiddleware) =>
  (request: NextRequest, _next: NextFetchEvent) => {
    const {
      nextUrl: { pathname },
    } = request

    if (['/login'].includes(pathname)) {
      return next(request, _next)
    }

    return clerkMiddleware(
      async (auth, req, event) => {
        if (!shouldAuthenticate(request)) {
          return next(request, _next)
        }

        const { userId } = await auth()

        if (!userId) {
          return NextResponse.redirect(
            eatUrlCookies(loginUrl(buildCurrentUrl(req))),
            { status: 307 }
          )
        }

        return stackMiddlewares(
          [withCanonicalHost(env), withPrincipal(env), withAuthorization(env)],
          auth
        )(req, event)
      },
      {
        debug: false,
        ...authConfig(),
      }
    )(request, _next)
  }
