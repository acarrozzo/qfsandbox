import { useMemo } from 'react'

import type { PackageSource } from '@mntn-dev/domain-types'
import { env } from '@mntn-dev/env'
import type { CostLike } from '@mntn-dev/finance'
import { calculateCostPlusMargin } from '@mntn-dev/finance'

import { getCreditProgramKindByPackageSource } from '#utils/pricing/use-pricing.ts'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'
import { useCurrency } from '~/utils/use-currency.ts'

export const usePackageServicePricing = (
  cost = 0,
  margin?: number,
  showCredits?: boolean,
  packageSource?: PackageSource
) => {
  const { creditCurrency } = useCurrency()
  const { getPriceContextWithFields, getFormattedPrice } = usePricingUtilities()

  const creditProgramKind = useMemo(
    () => getCreditProgramKindByPackageSource(packageSource),
    [packageSource]
  )

  const creditCosts = useMemo(() => {
    const fields = getPriceContextWithFields()

    return fields.reduce<CostLike>((costLike, { context, priceField }) => {
      const contextCost =
        context === 'brand'
          ? calculateCostPlusMargin(
              cost,
              margin ?? env.MNTN_COST_MARGIN_PERCENT ?? 50
            )
          : cost

      if (contextCost === undefined) {
        return costLike
      }

      costLike[priceField] = creditCurrency(
        showCredits && creditProgramKind ? creditProgramKind : 'USD',
        contextCost
      )

      return costLike
    }, {})
  }, [
    cost,
    creditCurrency,
    creditProgramKind,
    getPriceContextWithFields,
    showCredits,
    margin,
  ])

  return {
    creditCosts,
    creditProgramKind,
    getFormattedPrice,
  }
}
