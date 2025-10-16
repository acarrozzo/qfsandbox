import { useCallback } from 'react'

import { type ExchangeUnit, isCreditProgramId } from '@mntn-dev/domain-types'
import { convertExchangeUnits } from '@mntn-dev/finance'
import { useTranslation } from '@mntn-dev/i18n'

type CurrencyConfig = {
  fractionDigits?: number
  trailingZeroDisplay?: 'auto' | 'stripIfInteger'
}

export const useCurrency = (defaults: CurrencyConfig = {}) => {
  const config: Required<CurrencyConfig> = {
    fractionDigits: 2,
    trailingZeroDisplay: 'stripIfInteger',
    ...defaults,
  }
  const { t } = useTranslation('generic')

  const currency = useCallback(
    (val: number) =>
      t('currency', {
        val,
        maximumFractionDigits: config.fractionDigits,
        trailingZeroDisplay: config.trailingZeroDisplay,
      }),
    [t, config.fractionDigits, config.trailingZeroDisplay]
  )

  const creditCurrency = useCallback(
    (exchangeUnit: ExchangeUnit, val?: number) => {
      if (val === undefined) {
        return undefined
      }

      return isCreditProgramId(exchangeUnit)
        ? Math.ceil(convertExchangeUnits(val, 'USD', exchangeUnit))
        : convertExchangeUnits(val, 'USD', exchangeUnit)
    },
    []
  )

  return { creditCurrency, currency }
}
