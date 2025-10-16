export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import { isAuthorizedSession, s } from '@mntn-dev/session'

import { ApiRouteLogger } from '~/app/api/api-route-logger.ts'

import { authorizedFileProxy } from './authorized-proxy.ts'

export const GET = async (request: NextRequest) => {
  ApiRouteLogger.info('files proxy - GET request received')
  try {
    const session = await s.getAuthorizedSession()

    if (isAuthorizedSession(session)) {
      const fileUrl = await authorizedFileProxy(
        request,
        await s.getAuthorizedSessionOrThrow()
      )

      if (!fileUrl) {
        return NextResponse.json(
          { message: 'Not allowed to view file.' },
          {
            status: StatusCodes.UNAUTHORIZED,
          }
        )
      }

      return NextResponse.redirect(fileUrl, StatusCodes.TEMPORARY_REDIRECT)
    }

    return NextResponse.json(
      { message: 'Not allowed to view file.' },
      {
        status: StatusCodes.UNAUTHORIZED,
      }
    )
  } catch (error) {
    ApiRouteLogger.error('files proxy - error', { error })
    return NextResponse.json(error, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    })
  }
}
