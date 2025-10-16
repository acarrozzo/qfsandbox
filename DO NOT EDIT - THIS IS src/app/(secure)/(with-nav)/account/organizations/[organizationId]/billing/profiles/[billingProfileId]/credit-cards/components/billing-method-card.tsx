import { useState } from 'react'

import { getCreditCardUrl } from '@mntn-dev/app-assets'
import type { CreditCardType } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Blade, Button, Stack, Text } from '@mntn-dev/ui-components'

interface PaymentMethodCardProps {
  brand: CreditCardType
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
  loading: boolean
  readonly: boolean
  onDelete: () => void
  onMakeDefault: () => void
}

/**
 * Client component that displays a single payment method
 */
export function BillingMethodCard({
  brand,
  last4,
  expMonth,
  expYear,
  isDefault,
  loading,
  readonly,
  onDelete,
  onMakeDefault,
}: PaymentMethodCardProps) {
  const { t } = useTranslation('billing')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Blade
      type="mini"
      className="py-2 px-4 h-auto w-full"
      dataTestId={`payment-method-banner-${brand}-${last4}`}
      dataTrackingId={`payment-method-banner-${brand}-${last4}`}
    >
      <Blade.Left>
        <Stack
          gap="4"
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          {/** biome-ignore lint/performance/noImgElement: stripe card logo image */}
          <img className="h-8" src={getCreditCardUrl(brand)} alt={brand} />
          <Stack direction="col">
            <Text fontSize="lg" className="capitalize">
              {brand}...{last4}
            </Text>
            <Text textColor="secondary" fontSize="sm">
              {t('expires')} {expMonth}/{expYear}
            </Text>
          </Stack>
        </Stack>
      </Blade.Left>

      <Blade.Right>
        <Stack gap="2" direction="row" alignItems="center" justifyContent="end">
          {isDefault ? (
            <Button
              size="sm"
              iconLeft="checkbox-circle"
              variant="positive"
              readonly
              dataTestId={`payment-method-banner-default-button-${brand}-${last4}`}
              dataTrackingId={`payment-method-banner-default-button-${brand}-${last4}`}
            >
              {t('default-payment')}
            </Button>
          ) : (
            <Button
              loading={loading}
              readonly={readonly}
              size="sm"
              variant="secondary"
              onClick={onMakeDefault}
              dataTestId={`payment-method-banner-make-default-button-${brand}-${last4}`}
              dataTrackingId={`payment-method-banner-make-default-button-${brand}-${last4}`}
            >
              {t('make-default')}
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            disabled={isDefault}
            loading={isLoading}
            readonly={readonly}
            onClick={() => {
              setIsLoading(true)
              onDelete()
            }}
            dataTestId={`payment-method-banner-delete-button-${brand}-${last4}`}
            dataTrackingId={`payment-method-banner-delete-button-${brand}-${last4}`}
          >
            {t('delete')}
          </Button>
        </Stack>
      </Blade.Right>
    </Blade>
  )
}
