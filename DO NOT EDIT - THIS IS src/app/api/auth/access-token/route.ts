export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import { jwtDecode } from 'jwt-decode'
import { NextResponse } from 'next/server'

import { auth } from '@mntn-dev/authentication-server'

export const GET = async () => {
  const { getToken } = await auth()

  const token = await getToken()

  return token
    ? NextResponse.json(jwtDecode(token), { status: StatusCodes.OK })
    : NextResponse.json({}, { status: StatusCodes.UNAUTHORIZED })
}
