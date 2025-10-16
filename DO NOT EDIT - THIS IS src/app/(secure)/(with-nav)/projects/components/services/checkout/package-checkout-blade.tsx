import { isCustomService, type PackageSource } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { PackageServiceWithAcl } from '@mntn-dev/project-service'
import { Blade, Icon, IconButton, type TestIds } from '@mntn-dev/ui-components'

import { usePackageBrowserContext } from '#projects/hooks/use-package-browser.ts'
import { usePackageServicePricing } from '#utils/pricing/use-package-service-pricing.ts'

export const PackageCheckoutBlade = ({
  dataTestId,
  dataTrackingId,
  service,
  onRemove,
  showCredits,
  packageSource,
}: {
  service: PackageServiceWithAcl
  onRemove: () => void
  showCredits: boolean
  packageSource?: PackageSource
} & TestIds) => {
  const { costMarginPercent } = usePackageBrowserContext()
  const { t } = useTranslation('service-checkout')

  const { creditCosts, getFormattedPrice } = usePackageServicePricing(
    service.cost,
    costMarginPercent,
    showCredits,
    packageSource
  )

  const servicePriceValue = getFormattedPrice(
    'brand',
    showCredits,
    creditCosts,
    packageSource
  )

  return (
    <Blade
      key={service.serviceId}
      type="checkout"
      dataTestId={dataTestId}
      dataTrackingId={dataTrackingId}
    >
      <Blade.Column
        justifyContent="start"
        alignItems="center"
        direction="row"
        gap="4"
        grow
        shrink
      >
        <Icon fill="solid" name="check" size="sm" color="positive" />
        <Blade.Title>{service.name}</Blade.Title>
      </Blade.Column>
      <Blade.Column
        justifyContent="center"
        alignItems="end"
        direction="row"
        gap="4"
        width="auto"
      >
        <Blade.CheckoutItem
          price={isCustomService(service) ? undefined : servicePriceValue}
          priceText={
            isCustomService(service)
              ? t('pricing.custom-priced', { ns: 'service-checkout' })
              : undefined
          }
        />
      </Blade.Column>
      <Blade.Column
        justifyContent="center"
        alignItems="center"
        direction="row"
        gap="4"
        width="min"
      >
        <span className="flex pb-1 pl-3">
          <IconButton
            dataTestId={`delete-${service.serviceId}-button`}
            fill="solid"
            name="delete-bin"
            size="sm"
            color="disabled"
            hoverColor="negative"
            onClick={onRemove}
          />
        </span>
      </Blade.Column>
    </Blade>
  )
}
