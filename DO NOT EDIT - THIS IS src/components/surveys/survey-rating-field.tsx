import { SurveyRatingMax, type SurveyType } from '@mntn-dev/domain-types'
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField, RatingStars } from '@mntn-dev/ui-components'

type Props<FormState extends FieldValues> = {
  name: Path<FormState>
  control: Control<FormState>
  surveyType: SurveyType
  disabled: boolean
  label: string
  field: string
}

export const SurveyRatingField = <FormState extends FieldValues>({
  name,
  control,
  disabled,
  surveyType,
  label,
  field: fieldName,
}: Props<FormState>) => {
  const { t } = useTranslation(['survey', 'validation'])

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      required: t('validation:field.required', { field: fieldName }),
    },
  })

  return (
    <FormField disabled={disabled} hasError={!!error}>
      <FormField.Label textColor="primary" fontSize="base">
        {label}
      </FormField.Label>

      <RatingStars
        {...field}
        ariaLabel={t('survey:shared.rating.label')}
        total={SurveyRatingMax}
        dataTestId={`${surveyType}-${field}-stars`}
        dataTrackingId={`${surveyType}-${field}-stars`}
      />

      <FormField.Error>{error?.message}</FormField.Error>
    </FormField>
  )
}
