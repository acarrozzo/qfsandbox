import {
  SurveyFeedbackMaxLength,
  type SurveyType,
} from '@mntn-dev/domain-types'
import type {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField, Textarea } from '@mntn-dev/ui-components'

type Props<FormState extends FieldValues> = {
  name: Path<FormState>
  surveyType: SurveyType
  disabled: boolean
  label?: string
  required?: boolean
  error?: FieldError
  register: UseFormRegister<FormState>
}

export const SurveyFeedbackField = <FormState extends FieldValues>({
  name,
  disabled,
  surveyType,
  label,
  required,
  error,
  register,
}: Props<FormState>) => {
  const { t } = useTranslation(['survey', 'validation'])

  return (
    <FormField disabled={disabled} hasError={!!error}>
      <FormField.Label>
        {label || t('survey:shared.feedback.label')}
      </FormField.Label>

      <Textarea
        className="h-auto resize-none text-base font-normal"
        rows={5}
        placeholder={t('survey:shared.feedback.placeholder')}
        {...register(name, {
          required:
            required &&
            t('validation:field.required', {
              field: t('survey:shared.feedback.field'),
            }),
          maxLength: {
            value: SurveyFeedbackMaxLength,
            message: t('validation:text.max', {
              field: t('survey:shared.feedback.field'),
              count: SurveyFeedbackMaxLength,
            }),
          },
          setValueAs: (value) => value || undefined,
        })}
        dataTestId={`${surveyType}-survey-feedback`}
        dataTrackingId={`${surveyType}-survey-feedback`}
      />

      <FormField.Error>{error?.message}</FormField.Error>
    </FormField>
  )
}
