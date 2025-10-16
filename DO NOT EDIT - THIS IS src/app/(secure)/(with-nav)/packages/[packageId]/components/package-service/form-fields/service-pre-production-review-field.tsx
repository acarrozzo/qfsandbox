'use client'

import type { ServiceDomainSelectModel } from '@mntn-dev/domain-types'
import { Controller, useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { Checkbox, FormField, Text } from '@mntn-dev/ui-components'

import { isSystemService } from '../../../../services/helpers/service-helper.ts'
import type { ServiceFieldProps } from './types.ts'

export const ServicePreProductionReviewField = ({
  hide,
  disabled,
  service,
}: ServiceFieldProps) => {
  const { t } = useTranslation(['service-details'])
  const show = !(isSystemService(service) || hide)

  const { control } =
    useFormContext<Pick<ServiceDomainSelectModel, 'preProductionReview'>>()

  return show ? (
    <FormField columnSpan={6} className="w-full">
      <FormField.Control>
        <Controller
          name="preProductionReview"
          control={control}
          render={({ field }) => (
            <Checkbox
              value={field.value}
              onChange={field.onChange}
              disabled={disabled}
            >
              <Text fontSize="sm" textColor="secondary" fontWeight="medium">
                {t('service-details:field.preProductionReview')}
              </Text>
            </Checkbox>
          )}
        />
      </FormField.Control>
    </FormField>
  ) : null
}
