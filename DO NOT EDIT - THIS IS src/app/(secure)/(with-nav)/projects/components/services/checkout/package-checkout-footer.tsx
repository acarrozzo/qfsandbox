import { isCustomService } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  CurrencyCreditContainer,
  Heading,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'

import { usePackageBrowserContext } from '#projects/hooks/use-package-browser.ts'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'
import { useServicePricing } from '~/utils/pricing/use-service-pricing.ts'

export const PackageCheckoutFooter = () => {
  const {
    pendingPackageServices,
    loading,
    handleCancel,
    onSubmitPendingServices,
    showCredits,
    packageSource,
    costMarginPercent,
  } = usePackageBrowserContext()

  const { t } = useTranslation(['generic', 'pricing', 'service-checkout'])
  const { getPriceValue, getCurrencyLabel } = usePricingUtilities()
  const { creditCosts } = useServicePricing(
    pendingPackageServices,
    showCredits,
    packageSource,
    costMarginPercent
  )

  const { creditCosts: dollarCosts } = useServicePricing(
    pendingPackageServices,
    false,
    packageSource,
    costMarginPercent
  )

  const customServices = pendingPackageServices.filter(isCustomService)
  const hasCustomServices = customServices.length > 0
  const total = getPriceValue('brand', dollarCosts) ?? 0
  const creditTotal = (showCredits && getPriceValue('brand', creditCosts)) ?? 0

  return (
    <Surface.Footer className="flex flex-col gap-4 p-8">
      <Stack direction="col" gap="2">
        <span className="flex justify-end">
          <Stack direction="col" gap="2" alignItems="end">
            <Stack gap="4" justifyContent="center" alignItems="center">
              {creditTotal ? (
                <CurrencyCreditContainer
                  currency={creditTotal}
                  currencyUnitLabel={getCurrencyLabel(
                    'brand',
                    showCredits,
                    packageSource
                  )}
                />
              ) : (
                ''
              )}

              {creditTotal && total ? (
                <Heading fontSize="xl" textColor="brand">
                  OR
                </Heading>
              ) : (
                ''
              )}
              {total ? (
                <CurrencyCreditContainer
                  currency={total}
                  currencyUnitLabel={getCurrencyLabel(
                    'brand',
                    false,
                    packageSource
                  )}
                  dataTestId="services-total-cost"
                />
              ) : (
                ''
              )}
            </Stack>
            {hasCustomServices && (
              <Heading fontSize="xl">
                {t('pricing:custom-priced-services-count', {
                  count: customServices.length,
                })}
              </Heading>
            )}
          </Stack>
        </span>

        {hasCustomServices && (
          <span className="flex justify-end">
            <Text textColor="caution" fontSize="sm" className="flex text-right">
              {t('pricing.custom-services-disclaimer', {
                ns: 'service-checkout',
              })}
            </Text>
          </span>
        )}
      </Stack>

      <span className="flex flex-col gap-2">
        <Button
          className="capitalize"
          width="full"
          disabled={!pendingPackageServices.length || loading}
          onClick={onSubmitPendingServices}
          type="button"
        >
          {t('services.add-services', { ns: 'service-checkout' })}
        </Button>
        <Button
          width="full"
          disabled={loading}
          onClick={handleCancel}
          type="button"
          variant="text"
        >
          {t('cancel', { ns: 'generic' })}
        </Button>
      </span>
    </Surface.Footer>
  )
}
