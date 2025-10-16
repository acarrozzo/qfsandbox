import { Suspense } from 'react'

import { notFound } from '@mntn-dev/app-navigation'
import type { PageProps } from '@mntn-dev/app-routing'
import { CreditProgramKindSchema } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'

import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'
import { CenteredLoadingSpinner } from '~/components/shared/centered-loading-spinner.tsx'

import { BillingProfilePageComponent } from './billing-profile-page-component.tsx'

type BillingProfilePageProps =
  PageProps<'/account/organizations/:organizationId/billing/profiles/:billingProfileId'>

export default async function BillingProfilePage({
  params: { organizationId, billingProfileId },
}: BillingProfilePageProps) {
  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session, organizationId)) {
    logger.error(
      `Not allowed to view details for organization ${organizationId}`
    )
    notFound()
  }

  await Promise.all([
    trpcServerSideClient.financeCoordinator.getBillingProfile.prefetch({
      billingProfileId,
    }),

    trpcServerSideClient.organizations.getOrganization.prefetch({
      organizationId,
    }),

    trpcServerSideClient.organizations.getOrganizationPartnerPrograms.prefetch({
      organizationId,
    }),

    trpcServerSideClient.financeCoordinator.getBillingProfileDefaultBillingServiceMethodInfo.prefetch(
      {
        billingProfileId,
      }
    ),

    trpcServerSideClient.financeCoordinator.getBillingProfileAddress.prefetch({
      billingProfileId,
    }),

    trpcServerSideClient.financeCoordinator.listBillingProfileContacts.prefetch(
      {
        billingProfileId,
      }
    ),
    trpcServerSideClient.financeCoordinator.getBillingProfileTeams.prefetch({
      billingProfileId,
    }),

    ...CreditProgramKindSchema.options.map((program) =>
      trpcServerSideClient.financeCoordinator.getBillingProfileCreditBalance.prefetch(
        {
          billingProfileId,
          creditProgramKind: program,
        }
      )
    ),
  ])

  return (
    <HydrateClient>
      <Suspense fallback={<CenteredLoadingSpinner />}>
        <BillingProfilePageComponent billingProfileId={billingProfileId} />
      </Suspense>
    </HydrateClient>
  )
}
