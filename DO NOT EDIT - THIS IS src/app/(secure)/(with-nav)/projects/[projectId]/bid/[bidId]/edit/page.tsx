import { notFound, redirect } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { BidId, ProjectId } from '@mntn-dev/domain-types'
import { s } from '@mntn-dev/session'

import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { canEditBid } from '../utils/utils.ts'
import { BidEditPage } from './bid-edit-page.tsx'

export default async function Page({
  params: { projectId, bidId },
}: {
  params: { projectId: ProjectId; bidId: BidId }
}) {
  const session = await s.getAuthorizedSessionOrLogout()

  const { bid } = await trpcServerSideClient.bids.selectBid({ bidId })

  if (!bid || projectId !== bid.projectId) {
    notFound()
  }

  if (!canEditBid(session, bid.project, bid)) {
    redirect(
      route('/projects/:projectId/bid/:bidId')
        .params({
          projectId,
          bidId: bid.bidId,
        })
        .toRelativeUrl()
    )
  }

  await Promise.all([
    trpcServerSideClient.teams.listCompactTeams.prefetch({
      organizationId: session.authz.organizationId,
    }),

    trpcServerSideClient.projects.getProjectDetailsPayloadById.prefetch({
      projectId,
    }),

    trpcServerSideClient.projects.getProjectServicesByProjectId.prefetch(
      projectId
    ),
  ])

  return (
    <HydrateClient>
      <BidEditPage initialBid={bid} />
    </HydrateClient>
  )
}
