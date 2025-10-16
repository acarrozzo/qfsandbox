import type { JSX } from 'react'

import { PartnerProgramLogo } from '@mntn-dev/app-ui-components/partner-program-logo'
import {
  isMNTNCreativeProgram,
  type PackageDomainQueryModel,
  type PackageId,
} from '@mntn-dev/domain-types'
import type { PriceContext } from '@mntn-dev/finance'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  CurrencyCreditContainer,
  Heading,
  RichText,
  Stack,
  Surface,
} from '@mntn-dev/ui-components'

import { usePermissions } from '~/hooks/secure/use-permissions.ts'
import {
  getCreditProgramKindByPackageSource,
  usePricing,
} from '~/utils/pricing/use-pricing.ts'

import { PackageStatusTag } from '../tag/index.ts'
import { PackageVisibilityTag } from '../tag/package-visibility-tag.tsx'

type PackageItemProps = {
  pkg: PackageDomainQueryModel
  onPackageClicked: () => void
  activePackageId: PackageId | null
  actions?: JSX.Element
  priceContext: PriceContext
  hideStatus?: boolean
  showCredits?: boolean
}

export const PackageCard = ({
  pkg,
  onPackageClicked,
  activePackageId,
  actions,
  priceContext,
  hideStatus,
  showCredits,
}: PackageItemProps) => {
  const { packageId, name, description, status, visibility, packageSource } =
    pkg
  const { t } = useTranslation(['package-card', 'pricing'])
  const { hasPermission } = usePermissions()

  const { creditCosts, getCurrencyLabel, getPriceValue } = usePricing(
    pkg,
    showCredits,
    pkg.packageSource
  )

  const price = getPriceValue(priceContext, creditCosts)
  const creditProgramKind = getCreditProgramKindByPackageSource(packageSource)

  const showAsIncluded =
    !hasPermission('project:administer') &&
    priceContext === 'brand' &&
    creditProgramKind &&
    !isMNTNCreativeProgram(creditProgramKind)

  return (
    <Surface
      width="full"
      height="full"
      padding="6"
      gap="6"
      dataTestId={`package-starting-tile-${packageId}`}
      dataTrackingId={`package-starting-tile-${packageId}`}
    >
      <Stack direction="col" gap="1" grow>
        {!hideStatus && (
          <div className="shrink-0 flex gap-2">
            <PackageStatusTag status={status} />
            <PackageVisibilityTag visibility={visibility} />
          </div>
        )}
        <Stack gap="8">
          <Stack direction="col" gap="1" grow>
            <Heading
              fontSize="3xl"
              dataTestId={`package-title-${packageId}`}
              dataTrackingId={`package-title-${packageId}`}
            >
              {name}
            </Heading>
            <div className="h-full">
              <RichText
                value={description}
                dataTestId={`package-description-${packageId}`}
                dataTrackingId={`package-description-${packageId}`}
                className="max-h-50 overflow-y-hidden"
              />
            </div>
          </Stack>
          <PartnerProgramLogo partnerProgram={packageSource} />
        </Stack>
      </Stack>
      <div className="flex items-baseline justify-start">
        {showAsIncluded && (
          <Heading
            fontSize="2xl"
            fontWeight="bold"
            textColor="positive"
            dataTestId={`package-included-heading-${packageId}`}
            dataTrackingId={`package-included-heading-${packageId}`}
          >
            Included
          </Heading>
        )}

        {!showAsIncluded && price !== undefined && (
          <CurrencyCreditContainer
            currency={price}
            currencyUnitLabel={getCurrencyLabel(
              priceContext,
              showCredits,
              pkg.packageSource
            )}
            label={{ text: t('starting-at'), fontSize: 'xs' }}
            numeric={{ fontSize: '4xl' }}
            symbol={{ fontSize: '2xl' }}
            direction="row"
            dataTestId={`package-${pkg.packageId}-currency-credit-container`}
            dataTrackingId={`package-${pkg.packageId}-currency-credit-container`}
          />
        )}
      </div>
      <Button
        disabled={!!activePackageId}
        loading={activePackageId === packageId}
        onClick={onPackageClicked}
        className="p-7"
        iconRight="arrow-right"
        dataTestId={`package-start-button-${packageId}`}
        dataTrackingId={`package-start-button-${packageId}`}
      >
        {t('start-here')}
      </Button>
      {actions && (
        <Stack direction="row">
          <div className="flex-grow" />
          {actions}
        </Stack>
      )}
    </Surface>
  )
}
