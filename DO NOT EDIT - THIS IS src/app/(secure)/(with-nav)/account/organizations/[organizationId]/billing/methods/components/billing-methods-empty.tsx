import { Button, Heading, Stack, Surface, Text } from '@mntn-dev/ui-components'
import { themeBorderColorMap } from '@mntn-dev/ui-theme'

import { AccountBillingContext } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/hooks/use-billing'

export const BillingMethodsEmpty = ({
  onAddBillingMethodClick,
}: {
  onAddBillingMethodClick: () => void
}) => {
  const { t } = AccountBillingContext()
  return (
    <Surface>
      <Surface.Body
        className={`border rounded-lg ${themeBorderColorMap.muted}`}
      >
        <Stack
          direction="col"
          gap="2"
          alignSelf="stretch"
          alignItems="center"
          justifyContent="center"
          padding="8"
          paddingY="24"
          dataTestId="no-payment-methods-message"
          dataTrackingId="no-payment-methods-message"
        >
          <Stack direction="col" alignItems="center" justifyContent="center">
            <Text textColor="brand" fontSize="lg">
              {t('no-payment-methods')}
            </Text>
            <Heading fontSize="3xl">{t('set-up-now')}</Heading>
          </Stack>
          <Button
            iconRight="add"
            onClick={onAddBillingMethodClick}
            dataTestId="no-payment-methods-add-payment-method-button"
            dataTrackingId="no-payment-methods-add-payment-method-button"
          >
            {t('add-payment-method')}
          </Button>
        </Stack>
      </Surface.Body>
    </Surface>
  )
}
