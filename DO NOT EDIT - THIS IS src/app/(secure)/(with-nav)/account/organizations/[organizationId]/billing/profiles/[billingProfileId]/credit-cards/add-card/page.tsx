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

import AddBillingMethod from './components/add-billing-method.tsx'

type AddCreditCardPageProps =
  PageProps<'/account/organizations/:organizationId/billing/profiles/:billingProfileId/credit-cards/add-card'>

export default async function Page({ params }: AddCreditCardPageProps) {
  const { organizationId, billingProfileId } = params
  const { t } = await getServerTranslation('billing')

  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session, organizationId)) {
    logger.error(
      `Not allowed to add billing methods for organization ${organizationId}`
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

  const { clientSecret } = await trpcServerSideClient.billing.createSetupIntent(
    { customerId }
  )

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
      {
        billingProfileId,
      }
    ),

    trpcServerSideClient.financeCoordinator.getBillingProfileDefaultBillingServiceMethodInfo.prefetch(
      {
        billingProfileId,
      }
    ),
  ])

  return (
    <HydrateClient>
      <AddBillingMethod
        billingProfileId={billingProfileId}
        clientSecret={clientSecret}
      />
    </HydrateClient>
  )
}
