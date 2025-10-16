import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import { sendAsyncEvent } from '@mntn-dev/async-event-service'
import { ExternalChargeReportWebhookSchema } from '@mntn-dev/domain-types'
import { getErrorLogMessage } from '@mntn-dev/errors'
import { s } from '@mntn-dev/session'

import { FinanceAPILogger } from '../../../logger.ts'

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json()

    FinanceAPILogger.info('POST /api/finance/billing/charge/report', { body })

    const { brandId, paymentId, ...charge } =
      ExternalChargeReportWebhookSchema.parse(body)

    const session = s.system

    await sendAsyncEvent(session, {
      topic: 'billing.external-charge-reported',
      payload: {
        charge: {
          ...charge,
          externalChargeId: paymentId,
          billingProfileId: brandId,
        },
      },
    })

    return new NextResponse(null, { status: StatusCodes.OK })
  } catch (error) {
    const message = getErrorLogMessage(error, 'error reporting')
    FinanceAPILogger.error(`ERROR: ${message}`, {
      error,
    })

    return NextResponse.json(
      { message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
