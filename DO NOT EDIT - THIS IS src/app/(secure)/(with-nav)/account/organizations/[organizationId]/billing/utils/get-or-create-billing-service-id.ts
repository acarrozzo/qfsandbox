import type { AuthorizedSession } from '@mntn-dev/session-types'
import { UserService } from '@mntn-dev/user-service'
import { assertOk } from '@mntn-dev/utilities'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'
import { BillingLogger } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/utils/billing-logger'

export async function getOrCreateBillingServiceId(session: AuthorizedSession) {
  const me = assertOk(await UserService(session).getMe())

  const billingId =
    await trpcServerSideClient.organizations.getOrganizationBillingServiceId({
      organizationId: me.organizationId,
    })

  if (billingId) {
    return billingId
  }

  // Create a Stripe customer for the user
  const customerResult = await trpcServerSideClient.billing.createCustomer({
    email: me.emailAddress,
    name: me.displayName,
    metadata: {
      userId: me.userId,
    },
  })

  if (!customerResult?.billingServiceId) {
    BillingLogger.error(
      'add-method page - customer creation failed or billingServiceId not returned'
    )
    return null
  }

  return customerResult.billingServiceId
}
