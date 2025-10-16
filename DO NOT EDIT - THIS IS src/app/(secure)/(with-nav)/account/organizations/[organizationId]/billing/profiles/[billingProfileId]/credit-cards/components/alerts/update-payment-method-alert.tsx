import type { ExternalCharge } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Alert, Button, Text } from '@mntn-dev/ui-components'

import { useCurrency } from '~/utils/use-currency.ts'

export const UpdatePaymentMethodAlert = ({
  charge: { amount },
  onRetry,
  isBusy,
  isDisabled,
}: {
  charge: ExternalCharge
  onRetry: () => void
  isBusy: boolean
  isDisabled: boolean
}) => {
  const { t } = useTranslation(['billing'])
  const { currency } = useCurrency()

  return (
    <Alert type="error">
      <Alert.Main>
        <Alert.Indicator />
        <Alert.Details>
          <Alert.Title>{t('alerts.update-payment-method.title')}</Alert.Title>
          <Alert.Subtitle>
            {t('alerts.update-payment-method.body')}
          </Alert.Subtitle>
          <Text fontSize="sm" textColor="tertiary">
            {t('alerts.update-payment-method.amount', {
              amount: currency(amount),
            })}
          </Text>
        </Alert.Details>
        <Alert.Actions>
          <Button
            onClick={onRetry}
            className="self-center"
            loading={isBusy}
            disabled={isDisabled}
          >
            {t('alerts.update-payment-method.actions.retry')}
          </Button>
        </Alert.Actions>
      </Alert.Main>
    </Alert>
  )
}
