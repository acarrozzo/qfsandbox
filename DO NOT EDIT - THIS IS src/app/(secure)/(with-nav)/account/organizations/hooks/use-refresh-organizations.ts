'use client'

import type { OrganizationId } from '@mntn-dev/domain-types'

import { useQueryPlan } from '~/hooks/use-query-plan'

export const useRefreshOrganizations = () => {
  const queryPlan = useQueryPlan()

  return ({ organizationId }: { organizationId: OrganizationId }) =>
    queryPlan
      // Refresh the user principal organization
      .include(({ users }) => users.getMe.invalidate())

      // Refresh specific organization
      .include(({ organizations }) =>
        organizations.getOrganization.invalidate({ organizationId })
      )

      // Refresh Organization List Organizations
      .include(({ organizations }) =>
        organizations.listOrganizations.invalidate({})
      )

      // Refresh Organization Dropdowns (For Internal Users)
      .include(({ organizations }) =>
        organizations.listCompactOrganizations.invalidate({})
      )

      // Refresh the billing methods for the current user's organization
      .include(({ organizations }) =>
        // We refetch here instead of invalidate to avoid flickering old cache data on mount
        organizations.getOrganizationBillingMethods.refetch({
          organizationId,
        })
      )

      .apply()
}
