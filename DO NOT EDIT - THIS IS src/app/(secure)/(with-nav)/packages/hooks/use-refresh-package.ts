'use client'

import { type PackageId, PublicTagCategories } from '@mntn-dev/domain-types'

import { useQueryPlan } from '~/hooks/use-query-plan'

export const useRefreshPackage = () => {
  const queryPlan = useQueryPlan()

  return ({ packageId }: { packageId?: PackageId }) =>
    queryPlan
      .include(
        ({ packages }) =>
          packageId && packages.getPackageDetails.invalidate({ packageId })
      )
      .include(({ packages }) => packages.getAllPackages.invalidate({}))
      .include(({ tags }) =>
        tags.discover.invalidate({
          category: PublicTagCategories,
        })
      )
      .apply()
}
