export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'

import { realtimeServerService } from '@mntn-dev/realtime-updates-service'
import { s } from '@mntn-dev/session'

export const GET = async () => {
  s.getAuthenticatedSessionOrThrow()
  const key = await realtimeServerService.requestToken()
  return new Response(key, { status: StatusCodes.OK })
}
