import { useTranslation } from '@mntn-dev/i18n'
import { Heading, Stack, Surface, Text } from '@mntn-dev/ui-components'

export const PackageCheckoutHeader = () => {
  const { t } = useTranslation(['service-checkout'])
  return (
    <Surface.Header className="p-8">
      <Stack direction="col" gap="1" shrink>
        <Heading
          level="h2"
          dataTestId="service-browser-checkout-header"
          dataTrackingId="service-browser-checkout-header"
        >
          {t('service-checkout:services.additional-services')}
        </Heading>
        <Text
          fontSize="sm"
          textColor="secondary"
          className="shrink"
          dataTestId="service-browser-checkout-subheading"
          dataTrackingId="service-browser-checkout-subheading"
        >
          {t('service-checkout:services.added-services-here')}
        </Text>
      </Stack>
    </Surface.Header>
  )
}
