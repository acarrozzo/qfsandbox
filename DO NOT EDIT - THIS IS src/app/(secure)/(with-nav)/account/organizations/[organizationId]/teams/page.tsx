import type { OrganizationId } from '@mntn-dev/domain-types'

import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { TeamListPage } from './team-list-page.tsx'

export default async function Page({
  params: { organizationId },
}: Readonly<{ params: { organizationId: OrganizationId } }>) {
  await Promise.all([
    trpcServerSideClient.teams.listTeams.prefetch({
      organizationId,
    }),
    trpcServerSideClient.organizations.getOrganization.prefetch({
      organizationId,
    }),
    trpcServerSideClient.organizations.listCompactOrganizations.prefetch({}),
  ])

  return (
    <HydrateClient>
      <TeamListPage organizationId={organizationId} />
    </HydrateClient>
  )
}
