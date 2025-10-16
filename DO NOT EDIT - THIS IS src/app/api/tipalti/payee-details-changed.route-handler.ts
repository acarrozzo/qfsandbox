import { StatusCodes } from 'http-status-codes'
import { NextResponse } from 'next/server'

import { sendAsyncEvent } from '@mntn-dev/async-event-service'
import type { TipaltiWebhookPayeeDetailsChangedPayload } from '@mntn-dev/domain-types'
import { OrganizationService } from '@mntn-dev/organization-service'
import { s } from '@mntn-dev/session'
import { assertOk, isNonEmptyArray } from '@mntn-dev/utilities'

import { ApiRouteLogger } from '../api-route-logger.ts'
import type { TipaltiWebhookRouteHandler } from './types.ts'

export const payeeDetailsChangedRouteHandler: TipaltiWebhookRouteHandler<
  TipaltiWebhookPayeeDetailsChangedPayload
> = async ({
  payload: { payee_id: payeeId, is_payable: isPayable, c_date: syncedAt },
}) => {
  const session = s.system

  const organizations = assertOk(
    await OrganizationService(session).listOrganizations({
      payeeId,
    })
  ).filter(
    (organization) =>
      // Double filtering just to ensure we didn't get the wrong organizations and the payeeId was valid
      payeeId && organization.payeeId === payeeId
  )

  if (!isNonEmptyArray(organizations)) {
    return new NextResponse(null, { status: StatusCodes.NOT_FOUND })
  }

  const organizationIds = organizations.map(
    (organization) => organization.organizationId
  )

  if (organizations.length > 1) {
    ApiRouteLogger.error(
      'tipalti-webhook found multiple organizations for the same payee',
      {
        payeeId,
        organizationIds,
      }
    )

    return new NextResponse(null, {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    })
  }

  const [organization] = organizations

  await sendAsyncEvent(session, {
    topic: 'payee.details-changed',
    payload: {
      organizationId: organization.organizationId,
      isPayable,
      syncedAt: syncedAt.getTime(),
    },
  })

  return new NextResponse(null, { status: StatusCodes.OK })
}
