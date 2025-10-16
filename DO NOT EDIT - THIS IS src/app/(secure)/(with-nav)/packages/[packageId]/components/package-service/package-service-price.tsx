'use client'

import type { PackageServiceDomainQueryModel } from '@mntn-dev/domain-types'
import { CurrencyContainer, Text } from '@mntn-dev/ui-components'

import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'
import { useCurrency } from '~/utils/use-currency.ts'

export const PackageServicePrice = ({
  packageService,
}: {
  packageService: PackageServiceDomainQueryModel
}) => {
  const { currency } = useCurrency()
  const { getPriceValue } = usePricingUtilities()
  const price = getPriceValue('agency', packageService)

  if (price === undefined) {
    return null
  }

  return price ? (
    <CurrencyContainer
      justifyContent="between"
      currency={currency(price)}
      numeric={{
        fontSize: '2xl',
      }}
      symbol={{ fontSize: 'base' }}
    />
  ) : (
    <Text textColor="primary">-</Text>
  )
}
