import { useMemo } from 'react'

import type { CreditProgramKind, PackageSource } from '@mntn-dev/domain-types'
import type { CostLike } from '@mntn-dev/finance'

import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'
import { useCurrency } from '~/utils/use-currency.ts'

export const getCreditProgramKindByPackageSource = (
  source?: PackageSource
): CreditProgramKind | undefined => {
  switch (source) {
    case 'ctv':
      return 'mntn_credits'
    case 'linkedin':
      return 'linkedin'
    case 'meta':
      return 'meta'
    case 'tiktok':
      return 'tiktok'
    default:
      return undefined
  }
}

export const getPackageSourceByCreditProgramKind = (
  source: CreditProgramKind
): PackageSource => {
  switch (source) {
    case 'mntn_credits':
      return 'ctv'
    case 'linkedin':
      return 'linkedin'
    case 'meta':
      return 'meta'
    case 'tiktok':
      return 'tiktok'
    default:
      throw new Error(`Unexpected value: ${source}`)
  }
}

export const usePricing = (
  cost: CostLike,
  showCredits?: boolean,
  packageSource?: PackageSource
) => {
  const { creditCurrency } = useCurrency()
  const { getCurrencyLabel, getPriceContextWithFields, getPriceValue } =
    usePricingUtilities()

  const creditProgramKind = useMemo(
    () => getCreditProgramKindByPackageSource(packageSource),
    [packageSource]
  )

  const creditCosts = useMemo(() => {
    const fields = getPriceContextWithFields()

    return fields.reduce<CostLike>((costLike, { priceField }) => {
      const contextCost = cost[priceField]

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
  ])

  return {
    creditCosts,
    creditProgramKind,
    getPriceValue,
    getCurrencyLabel,
  }
}
