import {
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from 'next/server'

import {
  buildCurrentUrl,
  findRoute,
  logoutUrl,
  route,
} from '@mntn-dev/app-routing'
import { auth0, getSessionFromAuth0Client } from '@mntn-dev/auth-server'
import { FilteredLogger, Logger } from '@mntn-dev/logger'

import type { RequiredEnvVars } from './types.ts'
import { fetchPrincipal } from './utils/fetch-principal.ts'
import type { MiddlewareChain } from './utils/stack-middleware.ts'

const AuthenticationErrorResponse = ({
  endpoint,
  pathname,
  req,
  error,
  action,
}: {
  endpoint: string
  pathname: string
  req: NextRequest
  error: unknown | undefined
  action: string
}) => {
  if (pathname.startsWith('/api')) {
    AuthenticationMiddlewareLogger.warn(
      `Authentication failed for ${endpoint} when ${action}. Returning a 401.`,
      { error }
    )

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const redirectUrl = logoutUrl(buildCurrentUrl(req))

  AuthenticationMiddlewareLogger.warn(
    `Authentication failed for ${endpoint} when ${action}. Redirecting to login.`,
    { redirectUrl, error }
  )

  return NextResponse.redirect(redirectUrl)
}

const AuthenticationMiddlewareLogger = FilteredLogger(
  Logger('legacy-authentication-middleware')
)

export const withLegacyAuthentication: (
  env: RequiredEnvVars
) => MiddlewareChain =
  (_env: RequiredEnvVars) =>
  (next: NextMiddleware) =>
  async (req: NextRequest, _next: NextFetchEvent) => {
    const {
      method,
      nextUrl: { pathname },
      headers,
    } = req

    const host = headers.get('host')
    const protocol = headers.get('x-forwarded-proto') ?? 'http'
    const origin = `${protocol}://${host}`
    const currentRoute = findRoute(pathname, false)
    const endpoint = `${method} ${pathname}`

    AuthenticationMiddlewareLogger.debug(
      `Starting authentication middleware for ${currentRoute ? 'known route' : 'unknown route'}`,
      {
        endpoint,
        route: currentRoute?.pattern,
      }
    )

    if (pathname.startsWith('/api/auth') || pathname.startsWith('/login')) {
      AuthenticationMiddlewareLogger.debug(
        'Escaping authentication because of /api/auth/* route',
        { endpoint }
      )

      return next(req, _next)
    }

    try {
      const authResponse = await auth0.middleware(req)

      if (pathname.startsWith('/auth') && pathname !== '/auth/callback') {
        AuthenticationMiddlewareLogger.debug(
          'Escaping authentication because route is a dynamic auth0 route',
          {
            'request.nextUrl.pathname': pathname,
          }
        )
        return authResponse
      }

      if (!currentRoute?.isProtected) {
        AuthenticationMiddlewareLogger.debug(
          `Escaping authentication because route is not protected`,
          { endpoint }
        )

        return authResponse
      }

      const session = await getSessionFromAuth0Client(auth0)

      if (!session) {
        AuthenticationMiddlewareLogger.error(
          'Some or all auth info missing when parsing the previously authenticated session. Returning a 401',
          { endpoint }
        )

        return AuthenticationErrorResponse({
          pathname,
          endpoint,
          req,
          error: undefined,
          action: 'getting session from Auth0',
        })
      }

      const {
        claims: { primary_email: emailAddress },
      } = session

      AuthenticationMiddlewareLogger.info(`Authentication successful`, {
        endpoint,
      })

      try {
        AuthenticationMiddlewareLogger.debug(
          `Fetching principal for ${emailAddress}`,
          { endpoint }
        )

        const principal = await fetchPrincipal({
          req,
          res: authResponse,
          emailAddress,
        })

        if (principal === null) {
          AuthenticationMiddlewareLogger.debug(
            `Principal not found for ${emailAddress}. Redirecting to /welcome page`,
            { endpoint }
          )

          const welcomeUrl = `${origin}${route('/welcome').query({ returnTo: req.nextUrl.pathname }).toRelativeUrl()}`
          return NextResponse.redirect(welcomeUrl)
        }

        AuthenticationMiddlewareLogger.debug(
          `Principal found for ${emailAddress}`,
          { endpoint }
        )

        return authResponse
      } catch (error) {
        return AuthenticationErrorResponse({
          pathname,
          endpoint,
          req,
          error,
          action: 'fetching principal',
        })
      }
    } catch (error) {
      return AuthenticationErrorResponse({
        pathname,
        endpoint,
        req,
        error,
        action: 'parsing auth info',
      })
    }
  }
