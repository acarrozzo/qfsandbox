import type {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server'

import {
  COOKIE_PARAMS_HEADER,
  CookieParamsCookie,
  findCookieParamsInSearchParams,
} from '@mntn-dev/app-navigation'

import type { RequiredEnvVars } from './types.ts'
import type { MiddlewareChain } from './utils/stack-middleware.ts'

export const withCookieParams: (env: RequiredEnvVars) => MiddlewareChain =
  (_env: RequiredEnvVars) =>
  (next: NextMiddleware) =>
  async (req: NextRequest, _next: NextFetchEvent) => {
    const {
      nextUrl: { searchParams },
    } = req

    const res = (await next(req, _next)) as NextResponse

    await CookieParamsCookie.processRequest(req, res)

    // Forward cookie params (parsed from the query string) via a *request* header so the
    // server layout can read them on the *same request* (“first-render parity”).
    // Cookies written on the response are not visible to that in-flight render,
    // so this header is a one-request bridge. On subsequent requests, the cookie is canonical.
    res.headers.set(
      COOKIE_PARAMS_HEADER,
      encodeURIComponent(
        JSON.stringify(findCookieParamsInSearchParams(searchParams))
      )
    )

    return res
  }
