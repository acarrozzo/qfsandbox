'use client'

import {
  type PackageServiceDomainSelectModel,
  type ProjectDomainSelectModel,
  ServicePayoutMax,
} from '@mntn-dev/domain-types'
import { calculateCostPlusMargin } from '@mntn-dev/finance'
import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField, Input } from '@mntn-dev/ui-components'
import { TypeOf } from '@mntn-dev/utility-types'

import type { ServiceFieldProps } from '~/app/(secure)/(with-nav)/packages/[packageId]/components/package-service/form-fields/types'
import { useDollarsField } from '~/utils/form/use-dollars-field.ts'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'

export const ChangeOrderCostField = ({
  disabled,
  costMarginPercent,
}: ServiceFieldProps & Pick<ProjectDomainSelectModel, 'costMarginPercent'>) => {
  const { t } = useTranslation(['change-order'])

  const { getPriceLabel } = usePricingUtilities()
  const dollarsField = useDollarsField({
    max: ServicePayoutMax,
    field: getPriceLabel('agency', 'price'),
  })

  const {
    formState: { errors },
    register,
    watch,
  } = useFormContext<
    Pick<PackageServiceDomainSelectModel, 'cost' | 'serviceType'>
  >()

  const { cost } = watch()

  return (
    <>
      <FormField columnSpan={2} hasError={!!errors.cost} className="w-full">
        <FormField.Label>
          {t('change-order:service.fields.cost')}
        </FormField.Label>
        <FormField.Control>
          <Input
            type="number"
            {...register('cost', {
              valueAsNumber: true,
              validate: dollarsField.validate,
            })}
            disabled={disabled}
          />
          <FormField.Error>{errors.cost?.message}</FormField.Error>
        </FormField.Control>
      </FormField>
      <FormField columnSpan={2} className="w-full">
        <FormField.Label>
          {t('change-order:service.fields.costMarginPercent')}
        </FormField.Label>
        <FormField.Control>
          <Input disabled={true} value={`${costMarginPercent}`} />
        </FormField.Control>
      </FormField>
      <FormField columnSpan={2} className="w-full">
        <FormField.Label>
          {t('change-order:service.fields.costPlusMargin')}
        </FormField.Label>
        <FormField.Control>
          <Input
            type="number"
            disabled={true}
            value={`${calculateCostPlusMargin(cost !== undefined && TypeOf(cost) !== 'NaN' ? cost : 0, costMarginPercent)}`}
          />
        </FormField.Control>
      </FormField>
    </>
  )
}
