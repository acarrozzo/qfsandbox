export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import {
  TipaltiWebhookPayloadSchema,
  TipaltiWebhookRedactedPayloadSchema,
} from '@mntn-dev/domain-types'

import { ApiRouteLogger } from '~/app/api/api-route-logger.ts'

import { payeeDetailsChangedRouteHandler } from './payee-details-changed.route-handler.ts'
import { testRouteHandler } from './test.route-handler.ts'
import { verifyTipaltiIpn } from './verify-tipalti-ipn.ts'

/**
 * This is a webhook that listens to messages from Tipalti.
 * Unlike a traditional webhook, there is no signature provided by the sender.
 * Verification of the message is done by sending another request to Tipalti with the same body.
 *
 * Care is taken here only log common payload fields due to sensitive bank information.
 */
export const POST = async (request: NextRequest) => {
  try {
    const ipnQueryString = await request.text()

    const ipnObject = Object.fromEntries(
      new URLSearchParams(ipnQueryString).entries()
    )

    const { error: redactedPayloadError, data: redactedPayload } =
      TipaltiWebhookRedactedPayloadSchema.safeParse(ipnObject)

    if (redactedPayloadError) {
      ApiRouteLogger.warn(
        'tipalti-webhook could not parse the redacted payload schema',
        { error: redactedPayloadError }
      )

      return new NextResponse(null, { status: StatusCodes.BAD_REQUEST })
    }

    ApiRouteLogger.info('tipalti-webhook request received', {
      redactedPayload,
    })

    await verifyTipaltiIpn(ipnQueryString)

    const { error: payloadError, data: payload } =
      TipaltiWebhookPayloadSchema.safeParse(ipnObject)

    if (payloadError) {
      ApiRouteLogger.warn(
        'tipalti-webhook could not parse the payload schema',
        {
          error: payloadError,
          redactedPayload,
        }
      )

      return new NextResponse(null, { status: StatusCodes.BAD_REQUEST })
    }

    if (payload.is_test) {
      return await testRouteHandler({ payload, redactedPayload })
    }

    if (payload.type === 'payee_details_changed') {
      return await payeeDetailsChangedRouteHandler({
        payload,
        redactedPayload,
      })
    }

    ApiRouteLogger.warn('tipalti-webhook unhandled payload type', {
      redactedPayload,
      payloadType: payload.type,
    })

    return new NextResponse(null, { status: StatusCodes.BAD_REQUEST })
  } catch (error) {
    ApiRouteLogger.error(
      'tipalti-webhook request encountered an unhandled error',
      {
        message: error instanceof Error ? error.message : String(error),
        url: request.url,
      }
    )

    return NextResponse.json(
      { error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
