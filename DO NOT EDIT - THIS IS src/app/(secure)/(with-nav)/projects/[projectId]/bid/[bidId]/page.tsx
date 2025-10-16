import { notFound } from '@mntn-dev/app-navigation'
import type { BidId, ProjectId } from '@mntn-dev/domain-types'
import { s } from '@mntn-dev/session'

import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { BidViewPage } from './bid-view-page.tsx'
import { canViewBid } from './utils/utils.ts'

export default async function Page({
  params: { projectId, bidId },
}: {
  params: { projectId: ProjectId; bidId: BidId }
}) {
  const session = await s.getAuthorizedSessionOrLogout()

  const bidQuery = await trpcServerSideClient.bids.selectBid({ bidId })
  const billingProfileId =
    await trpcServerSideClient.organizations.getOrganizationFinanceEntityId({
      organizationId: session.authz.organizationId,
    })

  await Promise.all([
    trpcServerSideClient.financeCoordinator.getBillingProfileAddress.prefetch({
      billingProfileId,
    }),
    trpcServerSideClient.financeCoordinator.listBillingProfileContacts.prefetch(
      {
        billingProfileId,
      }
    ),
    await trpcServerSideClient.projects.getProjectDetailsPayloadById.prefetch({
      projectId,
    }),
  ])

  if (!bidQuery.bid) {
    notFound()
  }

  const { bid } = bidQuery

  if (bid.projectId !== projectId || !canViewBid(session, bid.project, bid)) {
    notFound()
  }

  return (
    <HydrateClient>
      <BidViewPage initialBid={bid} />
    </HydrateClient>
  )
}
