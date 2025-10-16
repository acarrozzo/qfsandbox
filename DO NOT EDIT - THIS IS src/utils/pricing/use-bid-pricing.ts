import { useMemo } from 'react'

import type { PackageSource } from '@mntn-dev/domain-types'
import type { BidLike, ProjectLikeWithPricingFields } from '@mntn-dev/finance'

import { useProjectPricing } from '#utils/pricing/use-project-pricing.ts'

import { usePricing } from './use-pricing.ts'

export function useBidPricing(
  { amount: bidCost, amountPlusMargin: bidCostPlusMargin }: BidLike,
  project: ProjectLikeWithPricingFields,
  packageSource?: PackageSource
) {
  const {
    creditCosts: { costPlusMargin },
  } = useProjectPricing(project)

  const costLike = useMemo(
    () => ({
      cost: bidCost,
      costPlusMargin: Math.max(bidCostPlusMargin ?? 0, costPlusMargin ?? 0),
    }),
    [bidCost, bidCostPlusMargin, costPlusMargin]
  )
  const { creditCosts, creditProgramKind } = usePricing(
    costLike,
    false,
    packageSource
  )

  return { creditCosts, creditProgramKind }
}
