import type { SurveyType } from '@mntn-dev/domain-types'
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField, Select } from '@mntn-dev/ui-components'

type Props<FormState extends FieldValues> = {
  name: Path<FormState>
  control: Control<FormState>
  surveyType: SurveyType
  disabled: boolean
  label?: string
  field?: string
  placeholder: string
  reasons: { value: string; label: string }[]
}

export const SurveyReasonField = <FormState extends FieldValues>({
  name,
  control,
  disabled,
  surveyType,
  label,
  field: fieldName,
  placeholder,
  reasons,
}: Props<FormState>) => {
  const { t } = useTranslation(['validation'])

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: t('validation:field.required', {
        field: fieldName,
      }),
    },
  })

  return (
    <FormField disabled={disabled} hasError={!!error}>
      <FormField.Label>{label}</FormField.Label>

      <FormField.Control>
        <Select
          {...field}
          dataTestId={`${surveyType}-survey-reason`}
          dataTrackingId={`${surveyType}-survey-reason`}
          placeholder={placeholder}
          deselectable={false}
          searchable={false}
          options={reasons}
        />
      </FormField.Control>

      <FormField.Error>{error?.message}</FormField.Error>
    </FormField>
  )
}
