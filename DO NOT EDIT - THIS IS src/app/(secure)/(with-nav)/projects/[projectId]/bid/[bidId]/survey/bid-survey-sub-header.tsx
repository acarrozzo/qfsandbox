import type { BidSurveyType } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Stack, Text } from '@mntn-dev/ui-components'

type Props = {
  surveyType: BidSurveyType
}

export const BidSurveySubHeader = ({ surveyType }: Props) => {
  const { t } = useTranslation('survey')

  return (
    <Stack direction="col">
      <Text
        fontSize="xs"
        fontWeight="semibold"
        textColor={
          surveyType === 'maker-bid-accepted-by-brand' ? 'positive' : 'negative'
        }
      >
        {t(`${surveyType}.sub-heading.leading`)}
      </Text>

      <Text fontSize="lg" fontWeight="bold" textColor="secondary">
        {t(`${surveyType}.sub-heading.main`)}
      </Text>
    </Stack>
  )
}
