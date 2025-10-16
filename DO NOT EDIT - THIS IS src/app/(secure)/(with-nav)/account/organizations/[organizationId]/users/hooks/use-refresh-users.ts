'use client'

import type { OrganizationId, UserId } from '@mntn-dev/domain-types'

import { useQueryPlan } from '~/hooks/use-query-plan'

export const useRefreshUsers = () => {
  const queryPlan = useQueryPlan()

  return ({
    userId,
    organizationId,
  }: {
    userId: UserId
    organizationId: OrganizationId
  }) =>
    queryPlan

      // Refresh specific user
      .include(({ users }) => users.getUser.invalidate({ userId }))

      // Refresh User List Page Users
      .include(({ users }) => users.listUsers.invalidate({ organizationId }))

      // Refresh the organization that includes this user
      .include(({ organizations }) =>
        organizations.getOrganization.invalidate({ organizationId })
      )

      // Refresh the entire organization list because one of them has an include for this user
      .include(({ organizations }) =>
        organizations.listOrganizations.invalidate({})
      )

      // Refresh all teams because one of them may include this user
      .include(({ teams }) => teams.getTeam.invalidate())

      // Refresh the entire teams list because one of them has an include for this user
      .include(({ teams }) => teams.listTeams.invalidate({}))

      .apply()
}
