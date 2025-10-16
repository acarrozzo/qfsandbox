import { notFound } from '@mntn-dev/app-navigation'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'

import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { OrganizationDetailsPage } from './organization-details-page.tsx'

export default async function Page({
  params: { organizationId },
}: Readonly<{ params: { organizationId: OrganizationId } }>) {
  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session, organizationId)) {
    logger.error(
      `Not allowed to view details for organization ${organizationId}`
    )
    notFound()
  }

  const financeEntityId =
    await trpcServerSideClient.organizations.getOrganizationFinanceEntityId({
      organizationId,
    })

  await Promise.all([
    trpcServerSideClient.organizations.getOrganization.prefetch({
      organizationId,
    }),

    trpcServerSideClient.financeCoordinator.listBillingProfiles.prefetch({
      organizationId,
    }),
  ])

  return (
    <HydrateClient>
      <OrganizationDetailsPage
        organizationId={organizationId}
        financeEntityId={financeEntityId}
      />
    </HydrateClient>
  )
}
