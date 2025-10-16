export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import { sendAsyncEvent } from '@mntn-dev/async-event-service'
import {
  WorkrampCertificationIdToTagKeyMap,
  WorkrampWebhookPayloadSchema,
} from '@mntn-dev/domain-types'
import { env } from '@mntn-dev/env'
import { s } from '@mntn-dev/session'
import { UserService } from '@mntn-dev/user-service'
import { assertOk, verifySignature } from '@mntn-dev/utilities'

import { ApiRouteLogger } from '~/app/api/api-route-logger.ts'

const makeResponse = (status: StatusCodes, test: boolean) =>
  new NextResponse(null, { status: test ? StatusCodes.OK : status })

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.text()

    const signature = request.headers.get('x-workramp-signature')
    const timestamp = request.headers.get('x-workramp-request-timestamp')
    const test = Boolean(request.headers.get('x-workramp-test'))

    ApiRouteLogger.info('workramp-webhook request received', {
      headers: Array.from(request.headers.entries()),
      body,
    })

    if (!(timestamp && signature)) {
      ApiRouteLogger.warn(
        'workramp-webhook missing timestamp or signature headers',
        {
          headers: Array.from(request.headers.entries()),
        }
      )

      return makeResponse(StatusCodes.UNAUTHORIZED, test)
    }

    const payload = JSON.parse(body)

    const requestContext = {
      payload,
      headers: {
        timestamp,
        signature,
        test,
      },
    }

    const verified = await verifySignature({
      timestamp,
      signature,
      body,
      signingSecret: env.WORKRAMP_SIGNING_SECRET,
    })

    if (!verified) {
      ApiRouteLogger.warn('workramp-webhook has an invalid signature', {
        requestContext,
      })

      return makeResponse(StatusCodes.UNAUTHORIZED, test)
    }

    if (!WorkrampWebhookPayloadSchema.safeParse(payload).success) {
      ApiRouteLogger.warn(
        'workramp-webhook could not parse the payload to the schema',
        {
          requestContext,
        }
      )

      return makeResponse(StatusCodes.BAD_REQUEST, test)
    }

    const {
      user: { email: emailAddress },
      certification,
      eventType,
    } = WorkrampWebhookPayloadSchema.parse(payload)

    const session = s.system

    const user = assertOk(await UserService(session).getUser({ emailAddress }))

    if (!user) {
      ApiRouteLogger.warn(
        `workramp-webhook could not find user by email address: ${emailAddress}`,
        {
          requestContext,
        }
      )

      return makeResponse(StatusCodes.NOT_FOUND, test)
    }

    if (eventType === 'contentCompletion.certification') {
      if (!(certification.id && certification.certificate.issuedAt)) {
        ApiRouteLogger.warn(
          'workramp-webhook with eventType contentCompletion.certification - key certification information missing',
          {
            requestContext,
          }
        )

        return makeResponse(StatusCodes.BAD_REQUEST, test)
      }

      const certificationKey =
        WorkrampCertificationIdToTagKeyMap[certification.id]

      if (!certificationKey) {
        ApiRouteLogger.warn(
          `workramp webhook request received but could not find a mapped certification by certificationId: ${certification.id}`,
          {
            requestContext,
          }
        )

        return makeResponse(StatusCodes.BAD_REQUEST, test)
      }

      if (!test) {
        await sendAsyncEvent(session, {
          topic: 'organization.certified',
          payload: {
            organizationId: user.organizationId,
            userId: user.userId,
            certificationKey,
            issuedAt: new Date(certification.certificate.issuedAt),
            expiresAt: certification.certificate.expiresAt
              ? new Date(certification.certificate.expiresAt)
              : undefined,
          },
        })
      }
    }

    return new NextResponse(null, { status: StatusCodes.OK })
  } catch (error) {
    ApiRouteLogger.error(
      'workramp webhook request encountered an unhandled error',
      {
        message: error instanceof Error ? error.message : String(error),
        url: request.url,
        headers: Array.from(request.headers.entries()),
      }
    )

    return NextResponse.json(
      { error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
