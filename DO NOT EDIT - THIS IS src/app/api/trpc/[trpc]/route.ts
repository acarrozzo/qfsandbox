export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import type { NextRequest } from 'next/server'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter, createContext } from '@mntn-dev/api'
import {
  isAuthenticationError,
  isAuthorizationError,
  isPrincipalInactiveError,
} from '@mntn-dev/errors'
import { logger } from '@mntn-dev/logger'
import { getApiBaseUrl } from '@mntn-dev/utilities-next-server'

import { env } from '~/env.js'

const handler = async (req: NextRequest) => {
  try {
    return await fetchRequestHandler({
      endpoint: '/api/trpc',
      req,
      router: appRouter,
      createContext: createContext({
        launchDarklySdkKey: env.LAUNCHDARKLY_SDK_KEY,
        filesApiBaseUrl: `${getApiBaseUrl()}/files`,
      }),
      onError({ error, path, type }) {
        logger.error('tRPC request error', {
          path,
          type,
          code: error.code,
          error,
          url: req.nextUrl.href,
        })
      },
    })
  } catch (error) {
    logger.error('An unhandled error occurred in TRPC request handler', {
      error,
    })

    if (isAuthenticationError(error)) {
      return Response.json({}, { status: StatusCodes.UNAUTHORIZED })
    }

    if (isAuthorizationError(error)) {
      return Response.json({}, { status: StatusCodes.FORBIDDEN })
    }

    if (isPrincipalInactiveError(error)) {
      return Response.json({}, { status: StatusCodes.PRECONDITION_FAILED })
    }

    return Response.json({}, { status: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}

export { handler as GET, handler as POST }
