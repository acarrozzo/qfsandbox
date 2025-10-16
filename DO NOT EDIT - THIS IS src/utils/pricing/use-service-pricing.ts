import type { PackageSource } from '@mntn-dev/domain-types'
import type { CostLike, ServiceLikeWithPricingFields } from '@mntn-dev/finance'
import {
  BrandPriceContextWithFields,
  MakerPriceContextWithFields,
  sumPrice,
} from '@mntn-dev/finance'

import { usePricingUtilities } from '#utils/pricing/use-pricing-utilities.ts'
import { env } from '~/env'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { getCreditProgramKindByPackageSource } from './use-pricing.ts'

export const useServicePricing = (
  services: ServiceLikeWithPricingFields[],
  showCredits: boolean,
  packageSource?: PackageSource,
  margin?: number
) => {
  const { hasPermission } = usePermissions()
  const { getPriceContextWithFields } = usePricingUtilities()

  const canViewMakerPricing = hasPermission('cost:view')
  const canViewBrandPricing = hasPermission('cost-plus-margin:view')
  const creditProgram = showCredits
    ? getCreditProgramKindByPackageSource(packageSource)
    : undefined

  const makerCost = canViewMakerPricing ? sumPrice(services) : undefined

  const brandCost = canViewBrandPricing
    ? sumPrice(
        services,
        creditProgram,
        margin ?? env.MNTN_COST_MARGIN_PERCENT ?? 50
      )
    : undefined

  // Build a single CostLike object
  const costAll = {
    [MakerPriceContextWithFields.priceField]: makerCost,
    [BrandPriceContextWithFields.priceField]: brandCost,
  }

  const creditCosts = getPriceContextWithFields().reduce<CostLike>(
    (costLike, { priceField }) => {
      const contextCost = costAll[priceField]
      if (contextCost === undefined) {
        return costLike
      }
      costLike[priceField] = contextCost
      return costLike
    },
    {}
  )

  return {
    creditCosts,
  }
}
