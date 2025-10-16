import { notFound } from '@mntn-dev/app-navigation'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'

import { ErrorMessage } from '#components/error/error-message.tsx'
import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'
import AddBillingMethod from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/methods/add-method/components/add-billing-method'
import { getOrCreateBillingServiceId } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/utils/get-or-create-billing-service-id'
import { getServerTranslation } from '~/utils/server/get-server-translation.ts'

/**
 * Add Payment Method Page
 * @returns
 */

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
      `Not allowed to add billing methods for organization ${organizationId}`
    )
    notFound()
  }

  await trpcServerSideClient.organizations.getOrganization.prefetch({
    organizationId,
  })

  const billingId = await getOrCreateBillingServiceId(session)
  if (!billingId) {
    return <ErrorMessage message={t('setup-failed')} />
  }

  const { clientSecret } = await trpcServerSideClient.billing.createSetupIntent(
    {
      customerId: billingId,
    }
  )

  return (
    <AddBillingMethod
      billingId={billingId}
      clientSecret={clientSecret}
      organizationId={organizationId}
    />
  )
}
