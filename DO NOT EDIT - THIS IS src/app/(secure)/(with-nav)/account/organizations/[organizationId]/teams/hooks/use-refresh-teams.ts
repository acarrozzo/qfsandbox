'use client'

import type { OrganizationId, TeamId } from '@mntn-dev/domain-types'

import { useQueryPlan } from '~/hooks/use-query-plan'

export const useRefreshTeams = () => {
  const queryPlan = useQueryPlan()

  return ({
    teamId,
    organizationId,
  }: {
    teamId: TeamId
    organizationId: OrganizationId
  }) =>
    queryPlan
      // Refresh the user principal teams
      .include(({ users }) => users.getMe.invalidate())

      // Refresh specific team
      .include(({ teams }) => teams.getTeam.invalidate({ teamId }))

      // Refresh specific team with profile
      .include(({ teams }) => teams.getTeamWithProfile.invalidate({ teamId }))

      // Refresh Team List Page Teams
      .include(({ teams }) => teams.listTeams.invalidate({ organizationId }))

      // Refresh Team Checkbox List
      .include(({ teams }) =>
        teams.listCompactTeams.invalidate({ organizationId })
      )

      // Refresh the organization that includes this team
      .include(({ organizations }) =>
        organizations.getOrganization.invalidate({ organizationId })
      )

      // Refresh the entire organization list because one of them has an include for this team
      .include(({ organizations }) =>
        organizations.listOrganizations.invalidate({})
      ) // Refresh
      .apply()
}
