export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import {
  CreditGrantSchema,
  sendAsyncEvent,
} from '@mntn-dev/async-event-service'
import { getErrorLogMessage, isNotFoundError } from '@mntn-dev/errors'
import { s } from '@mntn-dev/session'

import { CreditsAPILogger } from '~/app/api/credits/logger.ts'

export const POST = async (request: NextRequest) => {
  try {
    CreditsAPILogger.info('POST /api/credits - START', { request })

    const input = await request.json()

    CreditsAPILogger.info('POST /api/credits - INPUT', { input })

    const grants = CreditGrantSchema.array().parse(input)

    await sendAsyncEvent(s.system, {
      topic: 'grant.credits',
      payload: { grants },
    })

    const result = { status: StatusCodes.OK }

    CreditsAPILogger.info('POST /api/credits - SUCCESS', { grants, result })

    return NextResponse.json({}, result)
  } catch (error) {
    const message = getErrorLogMessage(error, 'error adding credits')
    CreditsAPILogger.error(`POST /api/credits - ERROR: ${message}`, {
      error,
    })
    if (isNotFoundError(error)) {
      return NextResponse.json({ message }, { status: StatusCodes.NOT_FOUND })
    }
    return NextResponse.json(
      { message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
