import type { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server'

import { findRoute } from '@mntn-dev/app-routing'

import type { MiddlewareChain } from '~/middleware/utils/stack-middleware'

import type { RequiredEnvVars } from './types.ts'
import { AuthorizationMiddlewareLogger } from './utils/logger.ts'
import { shouldAuthenticate } from './utils/should-authenticate.ts'

export const withAuthorization: (env: RequiredEnvVars) => MiddlewareChain =
  (_env: RequiredEnvVars) =>
  (next: NextMiddleware) =>
  (request: NextRequest, _next: NextFetchEvent) => {
    const {
      method,
      nextUrl: { pathname },
    } = request

    if (!shouldAuthenticate(request)) {
      return next(request, _next)
    }

    const endpoint = `${method} ${pathname}`

    const currentRoute = findRoute(pathname, false)

    if (currentRoute) {
      const { permissions, isProtected } = currentRoute

      AuthorizationMiddlewareLogger.debug(`Route lookup successful`, {
        endpoint,
        route: currentRoute.pattern,
        isProtected,
        permissions,
      })

      // TODO: Enforce route permissions here. Get the session authz and compare to currentRoute.permissions
    }

    return next(request, _next)
  }
