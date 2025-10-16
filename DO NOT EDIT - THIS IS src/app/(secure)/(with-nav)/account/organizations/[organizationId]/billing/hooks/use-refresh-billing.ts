'use client'

import type { OrganizationId } from '@mntn-dev/domain-types'

import { useQueryPlan } from '~/hooks/use-query-plan'

export const useRefreshBilling = () => {
  const queryPlan = useQueryPlan()

  return ({ organizationId }: { organizationId: OrganizationId }) =>
    queryPlan

      // Refresh the organization containing billing profiles
      .include(({ organizations }) =>
        organizations.getOrganization.invalidate({ organizationId })
      )

      .apply()
}
