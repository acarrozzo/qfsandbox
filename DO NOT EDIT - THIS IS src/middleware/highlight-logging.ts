import type { NextFetchEvent, NextMiddleware, NextRequest } from 'next/server'
import { highlightMiddleware } from '@highlight-run/next/server'

import type { MiddlewareChain } from '~/middleware/utils/stack-middleware'

import type { RequiredEnvVars } from './types.ts'

export const withHighlightLogging: (env: RequiredEnvVars) => MiddlewareChain =
  (_env: RequiredEnvVars) =>
  (next: NextMiddleware) =>
  async (request: NextRequest, _next: NextFetchEvent) => {
    await highlightMiddleware(request)
    return next(request, _next)
  }
