export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'

import { isAuthenticatedSession, s } from '@mntn-dev/session'

export const GET = async () => {
  const session = await s.getAuthorizedSession()

  return isAuthenticatedSession(session)
    ? NextResponse.json(session, { status: StatusCodes.OK })
    : NextResponse.json({}, { status: StatusCodes.UNAUTHORIZED })
}
