import * as cookie from 'cookie'
import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import { authCallbackUrl, buildCurrentUrl, route } from '@mntn-dev/app-routing'
import {
  decodeAccessToken,
  type RedirectFun,
} from '@mntn-dev/authentication-server'
import type { LogLevel } from '@mntn-dev/logger'

import { AuthenticationMiddlewareLogger } from './logger.ts'

export const AuthErrorResponse = ({
  req,
  req: {
    method,
    nextUrl: { pathname },
    headers,
  },
  context,
  level,
  status,
  redirectToSignIn,
  error,
}: {
  req: NextRequest
  context: string
  level: LogLevel
  status: number
  redirectToSignIn: RedirectFun<Response>
  error?: unknown
}) => {
  const endpoint = `${method} ${pathname}`
  const cookies = cookie.parse(headers.get('cookie') ?? '')
  const session = decodeAccessToken(cookies.__session ?? '')
  const timestamp = Date.now()

  // All API routes should only ever return 40x.

  if (pathname.startsWith('/api')) {
    AuthenticationMiddlewareLogger.log(level)(
      `Authentication failed. Returning a 40x.`,
      { context, endpoint, error, session, timestamp, status }
    )

    return NextResponse.json({ error: 'Unauthorized' }, { status })
  }

  // All pages should redirect to logout or forbidden.

  if (status === StatusCodes.PRECONDITION_FAILED) {
    return NextResponse.redirect(route('/disabled').toAbsoluteUrl())
  } else {
    const returnBackUrl = authCallbackUrl(buildCurrentUrl(req))

    AuthenticationMiddlewareLogger.log(level)(
      `Authentication failed. Redirecting to login.`,
      {
        context,
        endpoint,
        error,
        session,
        timestamp,
        returnBackUrl,
        status,
      }
    )

    return redirectToSignIn({
      returnBackUrl,
    })
  }
}
