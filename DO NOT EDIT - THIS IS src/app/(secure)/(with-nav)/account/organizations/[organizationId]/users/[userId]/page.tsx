import { notFound } from '@mntn-dev/app-navigation'
import type { OrganizationId, UserId } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'

import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { UserDetailsPage } from './user-details-page.tsx'

export default async function Page({
  params: { organizationId, userId },
}: Readonly<{ params: { organizationId: OrganizationId; userId: UserId } }>) {
  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session, organizationId)) {
    logger.error(
      `Not allowed to view user details for user ${userId} in organization ${organizationId}`
    )
    notFound()
  }

  await Promise.all([
    trpcServerSideClient.users.getUser.prefetch({
      userId,
    }),
    trpcServerSideClient.organizations.getOrganization.prefetch({
      organizationId,
    }),
    trpcServerSideClient.teams.listCompactTeams.prefetch({
      organizationId,
    }),
  ])

  return (
    <HydrateClient>
      <UserDetailsPage organizationId={organizationId} userId={userId} />
    </HydrateClient>
  )
}
