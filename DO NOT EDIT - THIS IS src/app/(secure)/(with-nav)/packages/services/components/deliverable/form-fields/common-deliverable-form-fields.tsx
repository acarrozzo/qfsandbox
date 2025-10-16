import { DeliverableReviewLevels } from '@mntn-dev/domain-types'
import { Controller } from '@mntn-dev/forms'
import { FormField, Input, Select } from '@mntn-dev/ui-components'

import type { DeliverableFormFieldProps } from '../types.ts'

export const CommonDeliverableFields = ({
  deliverableIndex,
  control,
  errors,
  isTriggered,
  isDisabled,
  t,
}: DeliverableFormFieldProps) => (
  <>
    <FormField
      columnSpan={6}
      className="w-full"
      hasError={
        isTriggered &&
        errors.deliverables &&
        !!errors.deliverables[deliverableIndex]?.name
      }
    >
      <FormField.Label>{t('deliverable-details:field.name')}</FormField.Label>
      <FormField.Control>
        <Controller
          name={`deliverables.${deliverableIndex}.name`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Input {...field} value={field.value ?? ''} disabled={isDisabled} />
          )}
        />
      </FormField.Control>
    </FormField>

    <FormField
      columnSpan={6}
      className="w-full"
      hasError={
        isTriggered &&
        errors.deliverables &&
        !!errors.deliverables[deliverableIndex]?.reviewLevel
      }
    >
      <FormField.Label>
        {t('deliverable-details:field.review-level')}
      </FormField.Label>
      <FormField.Control>
        <Controller
          name={`deliverables.${deliverableIndex}.reviewLevel`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              {...field}
              options={DeliverableReviewLevels.map((level) => ({
                value: level,
                label: t(`deliverable:review-level.${level}`),
              }))}
              searchable={false}
              deselectable={false}
              disabled={isDisabled}
            />
          )}
        />
      </FormField.Control>
    </FormField>
  </>
)
