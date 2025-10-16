'use client'

import type { ServiceDomainSelectModel } from '@mntn-dev/domain-types'
import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField, Input } from '@mntn-dev/ui-components'

import { isPositiveNumber, valueAs } from '~/utils/form/index.ts'

import type { ServiceFieldProps } from './types.ts'

export const ServiceMaxField = ({ disabled }: ServiceFieldProps) => {
  const { t } = useTranslation(['service-details', 'validation'])

  const {
    formState: { errors },
    register,
  } = useFormContext<Pick<ServiceDomainSelectModel, 'max'>>()

  return (
    <FormField columnSpan={6} className="w-full" hasError={!!errors.max}>
      <FormField.Label>{t('service-details:field.max')}</FormField.Label>
      <FormField.Control>
        <Input
          type="number"
          {...register('max', {
            validate: {
              positive: isPositiveNumber(
                t('validation:field.positive-integer', {}),
                true
              ),
            },
            setValueAs: valueAs.NumberOrNull,
          })}
          disabled={disabled}
        />
      </FormField.Control>
      <FormField.Error>{errors.max?.message}</FormField.Error>
    </FormField>
  )
}
