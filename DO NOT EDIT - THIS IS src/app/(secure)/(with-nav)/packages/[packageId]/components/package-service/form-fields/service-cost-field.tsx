'use client'

import {
  type PackageServiceDomainSelectModel,
  ServicePayoutMax,
} from '@mntn-dev/domain-types'
import { useFormContext } from '@mntn-dev/forms'
import { FormField, Input } from '@mntn-dev/ui-components'

import { useDollarsField } from '~/utils/form/use-dollars-field.ts'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'

import type { ServiceFieldProps } from './types.ts'

export const ServiceCostField = ({ disabled }: ServiceFieldProps) => {
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

  const { serviceType } = watch()
  const show = serviceType === 'standard'

  return show ? (
    <FormField columnSpan={6} hasError={!!errors.cost} className="w-full">
      <FormField.Label>{getPriceLabel('agency', 'price')}</FormField.Label>
      <FormField.Control>
        <Input
          type="number"
          {...register('cost', {
            validate: dollarsField.validate,
            valueAsNumber: true,
          })}
          disabled={disabled}
        />
        <FormField.Error>{errors.cost?.message}</FormField.Error>
      </FormField.Control>
    </FormField>
  ) : null
}
