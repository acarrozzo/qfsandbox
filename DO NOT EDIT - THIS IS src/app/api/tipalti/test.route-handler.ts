import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'

import type { TipaltiWebhookPayload } from '@mntn-dev/domain-types'

import { ApiRouteLogger } from '../api-route-logger.ts'
import type { TipaltiWebhookRouteHandler } from './types.ts'

export const testRouteHandler: TipaltiWebhookRouteHandler<
  TipaltiWebhookPayload
  // biome-ignore lint/suspicious/useAwait: keeping the signature the same as the other route handlers
> = async ({ redactedPayload }) => {
  ApiRouteLogger.info('tipalti-webhook test payload', { redactedPayload })
  return new NextResponse(null, { status: StatusCodes.OK })
}
