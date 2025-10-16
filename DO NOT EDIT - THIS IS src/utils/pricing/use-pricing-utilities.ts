import { useCallback, useMemo } from 'react'

import {
  type CreditProgramKind,
  CreditProgramKindSchema,
  type PackageSource,
} from '@mntn-dev/domain-types'
import {
  BrandBidPriceField,
  BrandPriceContextWithFields,
  BrandPriceField,
  type CostLike,
  MakerBidPriceField,
  MakerPriceContextWithFields,
  MakerPriceField,
  type PriceContext,
  type PriceContextWithField,
} from '@mntn-dev/finance'
import { useTranslation } from '@mntn-dev/i18n'

import { getCreditProgramKindByPackageSource } from '#utils/pricing/use-pricing.ts'
import { useMe } from '~/hooks/secure/use-me.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

export function usePricingUtilities() {
  const { hasPermission } = usePermissions()
  const { t } = useTranslation('pricing')
  const { me } = useMe()
  const { organizationType } = me

  const canViewMakerPricing = hasPermission('cost:view')
  const canViewBrandPricing = hasPermission('cost-plus-margin:view')

  const getPriceContextWithFields = useCallback((): PriceContextWithField[] => {
    if (hasPermission('project:administer')) {
      return [BrandPriceContextWithFields, MakerPriceContextWithFields]
    }

    if (canViewMakerPricing) {
      return [MakerPriceContextWithFields]
    }

    if (canViewBrandPricing) {
      return [BrandPriceContextWithFields]
    }

    return []
  }, [hasPermission, canViewMakerPricing, canViewBrandPricing])

  const getPriceContexts = useCallback(
    (): PriceContext[] =>
      getPriceContextWithFields().map(({ context }) => context),
    [getPriceContextWithFields]
  )

  const priceFields = useMemo(
    () => getPriceContextWithFields().map(({ priceField }) => priceField),
    [getPriceContextWithFields]
  )

  const getPriceLabel = useCallback(
    (
      context: PriceContext,
      variant: 'price' | 'total-price',
      postAward?: boolean,
      credits?: boolean
    ) => {
      const makerPriceField = postAward ? MakerBidPriceField : MakerPriceField
      const brandPriceField = postAward ? BrandBidPriceField : BrandPriceField
      return {
        agency:
          (organizationType &&
            t(
              `label.${makerPriceField}.${variant}.${organizationType}.${credits ? 'credits' : 'dollars'}`
            )) ||
          '',
        brand:
          (organizationType &&
            t(
              `label.${brandPriceField}.${variant}.${organizationType}.${credits ? 'credits' : 'dollars'}`
            )) ||
          '',
      }[context]
    },
    [organizationType, t]
  )

  const getPriceValue = useCallback(
    (context: PriceContext, cost: CostLike) => {
      const priceContexts = getPriceContextWithFields()
      const contextWithFields = priceContexts.find(
        ({ context: priceContext }) => priceContext === context
      )

      if (!contextWithFields) {
        return 0
      }

      const price = cost[contextWithFields.priceField]

      return price ?? 0
    },
    [getPriceContextWithFields]
  )

  const getCurrencyLabel = useCallback(
    (
      priceContext: PriceContext,
      showCredits?: boolean,
      source?: PackageSource | CreditProgramKind | 'default'
    ) => {
      const label =
        !showCredits || priceContext === 'agency' || !source
          ? 'default'
          : source
      return t(`currency-label.${label}`)
    },
    [t]
  )

  const getFormattedPrice = useCallback(
    (
      priceContext: PriceContext,
      showCredits?: boolean,
      costLike?: CostLike,
      packageSource?: PackageSource
    ) => {
      const source =
        showCredits && packageSource
          ? getCreditProgramKindByPackageSource(packageSource)
          : 'default'
      return t(
        priceContext === 'brand' &&
          CreditProgramKindSchema.safeParse(source).success
          ? 'postfix-currency-format'
          : 'prefix-currency-format',
        {
          amount:
            (priceContext === 'agency'
              ? costLike?.cost
              : costLike?.costPlusMargin) ?? 0,
          unit: getCurrencyLabel(priceContext, showCredits, source),
        }
      )
    },
    [getCurrencyLabel, t]
  )

  return {
    canViewBrandPricing,
    canViewMakerPricing,
    getCurrencyLabel,
    getFormattedPrice,
    getPriceContextWithFields,
    getPriceContexts,
    getPriceLabel,
    getPriceValue,
    priceFields,
  }
}
