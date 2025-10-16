import type { ProjectDomainQueryModel } from '@mntn-dev/domain-types'
import type { PriceContext } from '@mntn-dev/finance'
import { useTranslation } from '@mntn-dev/i18n'
import {
  CurrencyCreditContainer,
  Heading,
  Icon,
  LoadingSpinner,
  Stack,
} from '@mntn-dev/ui-components'

import { useProjectPricing } from '~/utils/pricing/use-project-pricing.ts'

type Props = {
  project: ProjectDomainQueryModel
  priceContext: PriceContext
  customServiceCount?: number
}

export const ProjectMinimumPriceWithToggle = ({
  project,
  priceContext,
  customServiceCount = 0,
}: Props) => {
  const { t } = useTranslation(['pricing'])

  const { loading, creditCosts, showCredits, getProjectCurrencyLabel } =
    useProjectPricing(project)

  const { costPlusMargin: dollars, costPlusMarginCredits: credits } =
    creditCosts

  return (
    <Stack
      direction="col"
      gap="3"
      width="full"
      minWidth="96"
      height="full"
      alignItems="end"
    >
      <Stack
        direction="row"
        gap="6"
        width="full"
        minWidth="96"
        height="full"
        alignItems="start"
        justifyContent="end"
      >
        {loading ? (
          <LoadingSpinner className="text-brand h-12 w-12 m-auto" />
        ) : (
          <Stack justifyContent="center" alignItems="center" gap="4">
            {showCredits && credits ? (
              <CurrencyCreditContainer
                currency={credits}
                currencyUnitLabel={getProjectCurrencyLabel(priceContext)}
                label={{
                  text: t('pricing:cost'),
                }}
                dataTestId="project-minimum-price-currency-credit-container"
                dataTrackingId="project-minimum-price-currency-credit-container"
              />
            ) : null}
            {dollars && showCredits && credits ? (
              <Icon name="add" size="lg" />
            ) : null}
            {dollars ? (
              <CurrencyCreditContainer
                currency={dollars}
                currencyUnitLabel="$"
                label={
                  credits
                    ? undefined
                    : {
                        text: t('pricing:minimum'),
                      }
                }
                dataTestId="project-minimum-price-currency-credit-container"
                dataTrackingId="project-minimum-price-currency-credit-container"
              />
            ) : null}
          </Stack>
        )}
      </Stack>
      {customServiceCount > 0 && (
        <Heading fontSize="xl">
          {t('pricing:custom-priced-services-count', {
            count: customServiceCount,
          })}
        </Heading>
      )}
    </Stack>
  )
}
