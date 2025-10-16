'use client'

import type { ReactNode } from 'react'

import { isCustomService } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { PackageServiceWithAcl } from '@mntn-dev/project-service'
import {
  Blade,
  Button,
  Heading,
  Icon,
  Stack,
  Text,
} from '@mntn-dev/ui-components'

import { ProjectPackageBrowserCustomPriceTooltip } from '#projects/components/services/project-package-browser-custom-price-tooltip.tsx'
import { usePackageBrowserContext } from '#projects/hooks/use-package-browser.ts'
import { usePackageServicePricing } from '#utils/pricing/use-package-service-pricing.ts'
import { findPackageServiceIdsForServiceInPackageServices } from '~/lib/package-services'

type PackageServiceListProps = {
  children: ReactNode
}

type PackageServiceListItemProps = {
  packageService: PackageServiceWithAcl
  onAdd: (service: PackageServiceWithAcl) => void
}

const ListItem = ({ packageService, onAdd }: PackageServiceListItemProps) => {
  const { t } = useTranslation(['service-checkout'])
  const {
    existingPackageServices,
    showCredits,
    packageSource,
    costMarginPercent,
  } = usePackageBrowserContext()

  const { creditCosts, creditProgramKind } = usePackageServicePricing(
    packageService.cost,
    costMarginPercent,
    showCredits,
    packageSource
  )

  const { creditCosts: dollarCosts, getFormattedPrice } =
    usePackageServicePricing(
      packageService.cost,
      costMarginPercent,
      false,
      packageSource
    )

  const packageServiceCreditCurrency =
    showCredits &&
    getFormattedPrice('brand', showCredits, creditCosts, packageSource)

  const packageServiceDollarCurrency = getFormattedPrice(
    'brand',
    false,
    dollarCosts,
    packageSource
  )

  const handleAdd = () => {
    onAdd(packageService)
  }

  const { serviceId, name, serviceType, description } = packageService
  const addedPackageServiceIds =
    findPackageServiceIdsForServiceInPackageServices({
      serviceId: serviceId,
      packageServices: existingPackageServices,
    })
  const max = packageService.max ?? 1
  const remaining = max - addedPackageServiceIds.length
  const isAtLimit = remaining <= 0
  const isIncluded = serviceType === 'included'
  const isDisabled = isAtLimit || isIncluded

  // Credit Program projects cannot have custom services
  if (!!creditProgramKind && serviceType === 'custom') {
    return
  }

  return (
    <Blade
      key={serviceId}
      type="enhancement"
      dataTestId={`service-card-${serviceId}`}
      dataTrackingId={`service-card-${serviceId}`}
    >
      <Blade.Right>
        <Blade.EnhancementInfo
          title={name}
          description={description}
          cost={
            isCustomService(packageService) || isIncluded ? undefined : (
              <Stack gap="2" justifyContent="center" alignItems="center">
                {packageServiceCreditCurrency && (
                  <Heading fontSize="2xl">
                    {packageServiceCreditCurrency}
                  </Heading>
                )}
                {packageServiceCreditCurrency &&
                  packageServiceDollarCurrency && (
                    <Heading fontSize="xl" textColor="brand">
                      OR
                    </Heading>
                  )}
                {packageServiceDollarCurrency && (
                  <Heading fontSize="2xl">
                    {packageServiceDollarCurrency}
                  </Heading>
                )}
              </Stack>
            )
          }
          priceText={
            isCustomService(packageService)
              ? t('pricing.custom-priced', { ns: 'service-checkout' })
              : (packageServiceCreditCurrency ||
                    packageServiceDollarCurrency) &&
                  !isIncluded
                ? t('pricing.each', { ns: 'service-checkout' })
                : undefined
          }
          priceTextTooltip={
            isCustomService(packageService) ? (
              <ProjectPackageBrowserCustomPriceTooltip />
            ) : undefined
          }
          feature={
            isCustomService(packageService) ? (
              <Icon
                fill="solid"
                name="star-s"
                size="sm"
                color="brand"
                title={t('premium')}
              />
            ) : undefined
          }
          actions={
            <Stack gap="4" className="items-center">
              <Text
                fontSize="sm"
                textColor="tertiary"
                dataTestId={
                  isIncluded
                    ? `service-card-${serviceId}-included`
                    : `service-card-${serviceId}-remaining-count`
                }
              >
                {isIncluded
                  ? t('info.included')
                  : t('info.count.display', { max, remaining })}
              </Text>
              <Button
                variant={isAtLimit && !isIncluded ? 'primary' : 'secondary'}
                disabled={isDisabled}
                iconLeft={isDisabled ? 'check' : 'add'}
                onClick={handleAdd}
                dataTestId={`service-card-${serviceId}-add-button`}
                dataTrackingId={`service-card-${serviceId}-add-button`}
              >
                {t(isAtLimit ? 'action.added' : 'action.add')}
              </Button>
            </Stack>
          }
          dataTestId={`service-card-${serviceId}`}
          dataTrackingId={`service-card-${serviceId}`}
        />
      </Blade.Right>
    </Blade>
  )
}

const PackageServiceList = ({ children }: PackageServiceListProps) => {
  return <div className="flex flex-col gap-4">{children}</div>
}

PackageServiceList.Item = ListItem

export { PackageServiceList }
