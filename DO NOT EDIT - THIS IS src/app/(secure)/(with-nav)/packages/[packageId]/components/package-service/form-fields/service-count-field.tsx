'use client'

import type { PackageServiceDomainSelectModel } from '@mntn-dev/domain-types'
import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField, Input } from '@mntn-dev/ui-components'

import { isPositiveNumber } from '~/utils/form/index.ts'

import { isSystemService } from '../../../../services/helpers/service-helper.ts'
import type { ServiceFieldProps } from './types.ts'

export const ServiceCountField = ({ disabled, service }: ServiceFieldProps) => {
  const { t } = useTranslation(['package-service-details', 'validation'])

  const {
    formState: { errors },
    register,
  } =
    useFormContext<
      Pick<PackageServiceDomainSelectModel, 'count' | 'serviceType'>
    >()

  const show = isSystemService(service)

  return show ? (
    <FormField columnSpan={6} hasError={!!errors.count} className="w-full">
      <FormField.Label>
        {t('package-service-details:field.count')}
      </FormField.Label>
      <FormField.Control>
        <Input
          type="number"
          {...register('count', {
            required: t('validation:field.required', {
              field: t('package-service-details:field.count'),
            }),
            validate: {
              positive: isPositiveNumber(
                t('validation:field.positive-integer', {
                  field: t('package-service-details:field.count'),
                })
              ),
            },
            valueAsNumber: true,
          })}
          disabled={disabled}
        />
      </FormField.Control>
      <FormField.Error>{errors.count?.message}</FormField.Error>
    </FormField>
  ) : null
}
