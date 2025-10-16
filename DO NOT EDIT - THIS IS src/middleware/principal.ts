import { StatusCodes } from 'http-status-codes'
import {
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from 'next/server'

import { eatUrlCookies, route } from '@mntn-dev/app-routing'
import type { ClerkMiddlewareAuth } from '@mntn-dev/authentication-server'
import { ClaimsSchema } from '@mntn-dev/authentication-types'
import { isPrincipalInactiveError } from '@mntn-dev/errors'

import { appBaseUrl } from '~/utils/request.ts'

import type { RequiredEnvVars } from './types.ts'
import { fetchPrincipal } from './utils/fetch-principal.ts'
import {
  AuthenticationMiddlewareLogger,
  PrincipalMiddlewareLogger,
} from './utils/logger.ts'
import { AuthErrorResponse } from './utils/response.ts'
import { shouldAuthenticate } from './utils/should-authenticate.ts'
import type { MiddlewareChain } from './utils/stack-middleware.ts'

export const withPrincipal: (env: RequiredEnvVars) => MiddlewareChain =
  (_env: RequiredEnvVars) =>
  (next: NextMiddleware, auth?: ClerkMiddlewareAuth) =>
  async (req: NextRequest, _next: NextFetchEvent) => {
    const {
      method,
      nextUrl: { pathname },
    } = req

    if (!shouldAuthenticate(req) || !auth) {
      return next(req, _next)
    }

    const currentUrl = appBaseUrl(req)
    const endpoint = `${method} ${pathname}`

    try {
      const { getToken, sessionClaims, redirectToSignIn } = await auth()

      try {
        const { primary_email: emailAddress } =
          ClaimsSchema.parse(sessionClaims)

        const res = (await next(req, _next)) as NextResponse

        // Fetch the Principal

        const principal = await fetchPrincipal({
          req,
          res,
          token: await getToken(),
          emailAddress,
        })

        // Evaluate the Principal

        if (principal === null) {
          AuthenticationMiddlewareLogger.info(
            `Could not find principal by email address. Redirecting to /welcome page`,
            { emailAddress, endpoint }
          )

          const welcomeUrl = route('/welcome')
            .query({ returnTo: eatUrlCookies(currentUrl) })
            .toAbsoluteUrl()

          return NextResponse.redirect(welcomeUrl)
        }

        return res
      } catch (error) {
        if (isPrincipalInactiveError(error)) {
          return AuthErrorResponse({
            req,
            error,
            context: 'authorizing principal',
            level: 'warn',
            status: StatusCodes.PRECONDITION_FAILED,
            redirectToSignIn,
          })
        }

        return AuthErrorResponse({
          req,
          error,
          context: 'fetching principal',
          level: 'error',
          status: StatusCodes.UNAUTHORIZED,
          redirectToSignIn,
        })
      }
    } catch (error) {
      PrincipalMiddlewareLogger.error('catch error', { error })
    }
  }
