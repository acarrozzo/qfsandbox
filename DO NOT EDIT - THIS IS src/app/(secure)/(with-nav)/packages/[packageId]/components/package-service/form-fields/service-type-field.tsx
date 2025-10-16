'use client'

import type { TFunction } from 'i18next'
import { useMemo } from 'react'

import { type ServiceType, ServiceTypes } from '@mntn-dev/domain-types'
import { Controller, useFormContext } from '@mntn-dev/forms'
import { NarrowTFunction, useTranslation } from '@mntn-dev/i18n'
import { FormField, Select } from '@mntn-dev/ui-components'

import type { CorePackageServiceInput } from '../../types.ts'
import type { ServiceFieldProps } from './types.ts'

const getServiceTypeOptions = (t: TFunction<['service-types']>) =>
  ServiceTypes.map((serviceType) => ({
    label: t(`service-types:serviceType.${serviceType}`),
    value: serviceType,
  }))

export const ServiceTypeField = ({ disabled }: ServiceFieldProps) => {
  const { t } = useTranslation([
    'package-service-details',
    'validation',
    'service-types',
  ])

  const {
    formState: { errors },
    control,
    setValue,
  } = useFormContext<CorePackageServiceInput>()

  const handleServiceTypeChange =
    (onChange: (value: ServiceType) => void) => (serviceType: ServiceType) => {
      onChange(serviceType)

      setValue('count', 1)

      switch (serviceType) {
        case 'standard':
        case 'custom':
          setValue('cost', null)
          break
        case 'included':
          setValue('cost', 0)
          break
        default:
      }
    }

  const serviceTypeOptions = useMemo(
    () => getServiceTypeOptions(NarrowTFunction<['service-types']>(t)),
    [t]
  )

  return (
    <FormField
      columnSpan={6}
      hasError={!!errors.serviceType}
      className="w-full"
    >
      <FormField.Label>
        {t('package-service-details:field.serviceType')}
      </FormField.Label>
      <FormField.Control>
        <Controller
          name="serviceType"
          control={control}
          rules={{
            required: t('validation:field.required', {
              field: t('package-service-details:field.serviceType'),
            }),
          }}
          render={({ field }) => (
            <Select
              deselectable={false}
              searchable={false}
              options={serviceTypeOptions}
              value={field.value}
              disabled={disabled}
              onChange={handleServiceTypeChange(field.onChange)}
            />
          )}
        />
        <FormField.Error>{errors.serviceType?.message}</FormField.Error>
      </FormField.Control>
    </FormField>
  )
}
