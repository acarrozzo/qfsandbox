'use client'

import type { ServiceDomainSelectModel } from '@mntn-dev/domain-types'
import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField } from '@mntn-dev/ui-components'

import { InlineInput } from '~/components/form/inline-input.tsx'

import type { ServiceFieldProps } from './types.ts'

export const ServiceNameField = ({ disabled, readonly }: ServiceFieldProps) => {
  const { t } = useTranslation(['service-details', 'validation'])

  const {
    formState: { errors },
    register,
  } = useFormContext<Pick<ServiceDomainSelectModel, 'name'>>()

  return (
    <FormField columnSpan={6} className="w-full" hasError={!!errors.name}>
      <FormField.Control>
        <InlineInput
          {...register('name', {
            required: t('validation:field.required', {
              field: t('service-details:field.name'),
            }),
          })}
          disabled={disabled}
          readonly={readonly}
        />
      </FormField.Control>
      <FormField.Error>{errors.name?.message}</FormField.Error>
    </FormField>
  )
}
