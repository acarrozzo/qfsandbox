import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import { ApiRouteLogger } from '~/app/api/api-route-logger.ts'

import { getAvatarProxyUrl } from './get-avatar-proxy-url.ts'

/**
 * These route handlers are open to the public.
 * we must handle our own cors headers which are
 * usually handled by Auth0
 */

export const GET = async (request: NextRequest) => {
  try {
    const url = await getAvatarProxyUrl(request)
    const response = NextResponse.redirect(url, StatusCodes.TEMPORARY_REDIRECT)
    return addCorsHeaders(response)
  } catch (error) {
    const errorContents = JSON.stringify(error, null, 2)
    ApiRouteLogger.error(
      `avatar proxy route handler - error: ${errorContents} `,
      {
        error,
      }
    )
    const errorResponse = NextResponse.json(
      { error: 'Internal Server Error' },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
    return addCorsHeaders(errorResponse) // Add CORS headers
  }
}

// Handle preflight requests
export const OPTIONS = () => {
  const response = NextResponse.json({}, { status: StatusCodes.NO_CONTENT })
  return addCorsHeaders(response)
}

const addCorsHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*') // Allow any origin
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS') // Allow only GET and OPTIONS
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  ) // Allow specific headers
  return response
}
