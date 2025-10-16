import type { PageProps } from '@mntn-dev/app-routing'
import { PublicTagCategories, TeamUrn } from '@mntn-dev/domain-types'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

import { TeamDetailsPage } from './team-details-page.tsx'

type TeamPageProps =
  PageProps<'/account/organizations/:organizationId/teams/:teamId'>

export default async function Page({
  params: { organizationId, teamId },
}: TeamPageProps) {
  const team = await trpcServerSideClient.teams.getTeam({
    teamId,
  })

  if (team.billingProfileId) {
    await Promise.all([
      trpcServerSideClient.financeCoordinator.getBillingProfile.prefetch({
        billingProfileId: team.billingProfileId,
      }),
      trpcServerSideClient.financeCoordinator.findBillingProfile.prefetch({
        billingProfileId: team.billingProfileId,
      }),
    ])
  }

  await Promise.all([
    trpcServerSideClient.organizations.getOrganization.prefetch({
      organizationId,
    }),
    trpcServerSideClient.files.list.prefetch({
      where: { folderUrn: TeamUrn(teamId), area: 'teams.profiles.examples' },
    }),
    trpcServerSideClient.tags.discover.prefetch({
      category: PublicTagCategories,
    }),
    trpcServerSideClient.teams.getTeamWithBillingProfile.prefetch({
      teamId,
    }),
    trpcServerSideClient.teams.getTeamWithProfile.prefetch({
      teamId,
    }),
    trpcServerSideClient.teams.listCompactTeams.prefetch({
      organizationId,
    }),
  ])

  return <TeamDetailsPage organizationId={organizationId} teamId={teamId} />
}

// display name is used in react devtools
Page.displayName = 'TeamPage'
