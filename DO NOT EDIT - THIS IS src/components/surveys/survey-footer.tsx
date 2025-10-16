import type { SurveyType } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Text } from '@mntn-dev/ui-components'

type Props = {
  surveyType: SurveyType
  loading: boolean
  error: boolean
  onSubmit: () => void
  onClose: () => void
}

export const SurveyFooter = ({
  surveyType,
  loading,
  error,
  onSubmit,
  onClose,
}: Props) => {
  const { t } = useTranslation('survey')

  return (
    <>
      <Button
        disabled={loading}
        loading={loading}
        type="submit"
        variant="primary"
        size="lg"
        width="full"
        onClick={onSubmit}
        dataTestId={`${surveyType}-survey-submit`}
        dataTrackingId={`${surveyType}-survey-submit`}
      >
        {t('shared.submit-feedback')}
      </Button>

      <Button
        disabled={loading}
        variant="text"
        width="full"
        size="sm"
        onClick={onClose}
        dataTestId={`${surveyType}-survey-not-now`}
        dataTrackingId={`${surveyType}-survey-not-now`}
      >
        {t('shared.not-now')}
      </Button>

      {error && (
        <Text fontSize="sm" textColor="negative">
          {t('shared.errors.generic')}
        </Text>
      )}
    </>
  )
}
