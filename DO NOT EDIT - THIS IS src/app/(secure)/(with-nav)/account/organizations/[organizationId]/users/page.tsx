import { notFound } from '@mntn-dev/app-navigation'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'

import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { UserListPage } from './user-list-page.tsx'

export default async function Page({
  params: { organizationId },
}: Readonly<{ params: { organizationId: OrganizationId } }>) {
  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session, organizationId)) {
    logger.error(
      `Not allowed to view user list for organization ${organizationId}`
    )
    notFound()
  }

  await Promise.all([
    trpcServerSideClient.users.listUsers.prefetch({
      organizationId,
    }),
    trpcServerSideClient.organizations.getOrganization.prefetch({
      organizationId,
    }),
    trpcServerSideClient.organizations.listCompactOrganizations.prefetch({}),
    trpcServerSideClient.teams.listCompactTeams.prefetch({
      organizationId,
    }),
  ])

  return (
    <HydrateClient>
      <UserListPage organizationId={organizationId} />
    </HydrateClient>
  )
}
