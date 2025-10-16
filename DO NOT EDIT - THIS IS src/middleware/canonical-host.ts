import {
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from 'next/server.js'

import { MiddlewareLogger } from '~/middleware/utils/middleware-logger.ts'

import type { RequiredEnvVars } from './types.ts'
import type { MiddlewareChain } from './utils/stack-middleware.ts'

/**
 * A middleware factory that redirects to the auth URL.
 *
 * The factory prepares a middleware chain with environment variables.
 *
 * The middleware chain will perform the middleware function
 * and then call the next middleware in the chain.
 *
 * The middleware function itself will redirect to the auth URL if the hostname doesn't match.
 *
 * @param env Required environment variables.
 * @returns A middleware function that redirects preview deployments to the canonical URL.
 */
export const withCanonicalHost: (env: RequiredEnvVars) => MiddlewareChain =
  (env: RequiredEnvVars) =>
  (nextMiddlewareLink: NextMiddleware) =>
  (request: NextRequest, nextFetchEvent: NextFetchEvent) => {
    const {
      nextUrl: { origin, href },
    } = request

    // When running locally on a reverse proxy, origin and APP_BASE_URL will look different so let's allow localhost:3005 to pass through.
    if (['http://localhost:3005', 'https://localhost:3005'].includes(origin)) {
      return nextMiddlewareLink(request, nextFetchEvent)
    }

    const canonicalHost =
      env.CUSTOM_URL ??
      env.APP_BASE_URL ??
      (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : undefined)

    const preRedirectEnv = {
      'env.APP_BASE_URL': env.APP_BASE_URL,
      'env.CUSTOM_URL': env.CUSTOM_URL,
      'env.VERCEL_URL': env.VERCEL_URL,
      'request.nextUrl.href': request.nextUrl.href,
      canonicalHost,
    }

    // Redirect to the canonicalHost if the origin doesn't match.
    // Skip redirect for API routes
    if (
      canonicalHost &&
      request.nextUrl.origin !== canonicalHost &&
      !request.nextUrl.pathname.startsWith('/api')
    ) {
      const redirectUrl = href.replace(origin, canonicalHost)

      MiddlewareLogger.debug('withCanonicalHost:redirecting', {
        ...preRedirectEnv,
        redirectUrl,
      })

      /**
       * A 308 redirect is similar to a 301 but with the important difference that
       * it preserves the HTTP method (GET, POST, etc.) in the redirect,
       * making it more suitable for API endpoints and form submissions.
       *
       * note: comment out the redirect for ngrok testing
       */
      return NextResponse.redirect(redirectUrl, { status: 308 })
    }

    return nextMiddlewareLink(request, nextFetchEvent)
  }
