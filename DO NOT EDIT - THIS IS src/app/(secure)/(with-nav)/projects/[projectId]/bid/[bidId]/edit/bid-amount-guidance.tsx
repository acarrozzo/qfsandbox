import { useTranslation } from '@mntn-dev/i18n'
import { Stack, Text } from '@mntn-dev/ui-components'

import { useCurrency } from '~/utils/use-currency.ts'

type Props = {
  customServiceCount: number
  isCapped: boolean
  value?: number
}

export const BidAmountGuidance = ({
  customServiceCount,
  isCapped,
  value,
}: Props) => {
  const { currency } = useCurrency()
  const { t } = useTranslation(['bids'])

  if (value === undefined) {
    return null
  }

  return (
    <Stack gap="1" alignItems="center" marginTop="4">
      <Text fontSize="sm" textColor="secondary">
        {t(isCapped ? 'bids:bid-cap.label' : 'bids:bid-recommendation.label')}
      </Text>
      <Text fontSize="sm" fontWeight="bold" textColor="primary">
        {currency(value)}
        {t('bids:bid-cap.custom-services', {
          count: customServiceCount,
        })}
      </Text>
    </Stack>
  )
}
