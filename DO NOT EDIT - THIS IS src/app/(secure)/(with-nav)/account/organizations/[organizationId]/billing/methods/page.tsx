import { notFound } from '@mntn-dev/app-navigation'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import type { PaymentsClientRequest } from '@mntn-dev/payments-shared'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'
import { UserService } from '@mntn-dev/user-service'
import { assertOk } from '@mntn-dev/utilities'

import { ErrorMessage } from '#components/error/error-message.tsx'
import { canShowBillingFeature } from '#utils/billing/can-show-billing-feature.ts'
import { canShowPaymentFeature } from '#utils/payments/can-show-payment-feature.ts'
import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'
import { getOrCreatePayeeId } from '~/app/(secure)/(with-nav)/account/finance/payment/get-or-create-payee-id.ts'
import PayeeSetup from '~/app/(secure)/(with-nav)/account/finance/payment/payee-setup.tsx'
import { BillingMethods } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/methods/components/billing-methods'
import { getOrCreateBillingServiceId } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/utils/get-or-create-billing-service-id.ts'
import { getServerTranslation } from '~/utils/server/get-server-translation.ts'

export default async function Page({
  params,
}: {
  params: { organizationId: OrganizationId }
}) {
  const { organizationId } = params
  const { t } = await getServerTranslation('billing')

  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session, organizationId)) {
    logger.error(
      `Not allowed to view billing methods for organization ${organizationId}`
    )
    notFound()
  }

  const me = assertOk(await UserService(session).getMe())

  await trpcServerSideClient.organizations.getOrganization.prefetch({
    organizationId,
  })

  if (await canShowPaymentFeature(me)) {
    const payeeId = await getOrCreatePayeeId(session)

    const request: PaymentsClientRequest = {
      payeeId,
      email: me.emailAddress,
    }

    const iframeUrl =
      await trpcServerSideClient.payments.getSetupIframeUrl(request)

    return <PayeeSetup request={request} iframeUrl={iframeUrl} />
  }

  if (await canShowBillingFeature(me)) {
    const billingId = await getOrCreateBillingServiceId(session)
    if (!billingId) {
      return <ErrorMessage message={t('setup-failed')} />
    }
    // Prefetch customer data (don't try to access the data here)
    await trpcServerSideClient.billing.getCustomer.prefetch({
      customerId: billingId,
    })

    // Prefetch payment methods data (don't try to access the data here)
    await trpcServerSideClient.billing.listPaymentMethods.prefetch(billingId)

    return (
      <HydrateClient>
        <BillingMethods billingId={billingId} organizationId={organizationId} />
      </HydrateClient>
    )
  }

  return notFound()
}
