import { notFound } from '@mntn-dev/app-navigation'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import type { PaymentsClientRequest } from '@mntn-dev/payments-shared'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'
import { UserService } from '@mntn-dev/user-service'
import { assertOk } from '@mntn-dev/utilities'

import { canShowPaymentFeature } from '#utils/payments/can-show-payment-feature.ts'
import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'
import { getOrCreatePayeeId } from '~/app/(secure)/(with-nav)/account/finance/payment/get-or-create-payee-id.ts'
import PayeeSetup from '~/app/(secure)/(with-nav)/account/finance/payment/payee-setup.tsx'

export default async function Page({
  params,
}: {
  params: { organizationId: OrganizationId }
}) {
  const { organizationId } = params

  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session, organizationId)) {
    logger.error(
      `Not allowed to view payments setup for organization ${organizationId}`
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

  return notFound()
}
