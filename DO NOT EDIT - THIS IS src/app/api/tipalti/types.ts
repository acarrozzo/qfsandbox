import type { NextResponse } from 'next/server'

import type {
  TipaltiWebhookPayload,
  TipaltiWebhookRedactedPayload,
} from '@mntn-dev/domain-types'

export type TipaltiWebhookRouteContext<Payload extends TipaltiWebhookPayload> =
  {
    payload: Payload
    redactedPayload: TipaltiWebhookRedactedPayload
  }

export type TipaltiWebhookRouteHandler<Payload extends TipaltiWebhookPayload> =
  (context: TipaltiWebhookRouteContext<Payload>) => Promise<NextResponse>
