'use client'

import { PublicTagCategories } from '@mntn-dev/domain-types'

import { useQueryPlan } from '~/hooks/use-query-plan'

export const useRefreshService = () => {
  const queryPlan = useQueryPlan()

  return () =>
    queryPlan
      .include(({ packages }) => packages.getAllServices.invalidate({}))
      .include(({ tags }) =>
        tags.discover.invalidate({
          category: PublicTagCategories,
        })
      )
      .apply()
}
