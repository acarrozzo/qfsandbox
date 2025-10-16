import { notFound } from '@mntn-dev/app-navigation'
import type { PageProps } from '@mntn-dev/app-routing'
import { logger } from '@mntn-dev/logger'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'

import { ErrorMessage } from '#components/error/error-message.tsx'
import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'
import { getServerTranslation } from '~/utils/server/get-server-translation.ts'

import { BillingMethods } from './components/billing-methods.tsx'

type CreditCardsPageProps =
  PageProps<'/account/organizations/:organizationId/billing/profiles/:billingProfileId/credit-cards'>

export default async function Page({ params }: CreditCardsPageProps) {
  const { organizationId, billingProfileId } = params
  const { t } = await getServerTranslation('billing')

  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session, organizationId)) {
    logger.error(
      `Not allowed to view credit cards for billing profile ${billingProfileId}`
    )
    notFound()
  }

  const { billingServiceCustomerId: customerId } =
    await trpcServerSideClient.financeCoordinator.upsertBillingServiceCustomer({
      billingProfileId,
    })

  if (!customerId) {
    return <ErrorMessage message={t('setup-failed')} />
  }

  await Promise.all([
    trpcServerSideClient.organizations.getOrganization.prefetch({
      organizationId,
    }),

    trpcServerSideClient.financeCoordinator.getBillingProfile.prefetch({
      billingProfileId,
    }),

    trpcServerSideClient.financeCoordinator.getBillingServiceCustomer.prefetch({
      billingServiceCustomerId: customerId,
    }),

    trpcServerSideClient.financeCoordinator.listBillingProfileBillingServiceMethods.prefetch(
      { billingProfileId }
    ),

    trpcServerSideClient.financeCoordinator.getBillingProfileDefaultBillingServiceMethodInfo.prefetch(
      {
        billingProfileId,
      }
    ),
  ])

  return (
    <HydrateClient>
      <BillingMethods billingProfileId={billingProfileId} />
    </HydrateClient>
  )
}
