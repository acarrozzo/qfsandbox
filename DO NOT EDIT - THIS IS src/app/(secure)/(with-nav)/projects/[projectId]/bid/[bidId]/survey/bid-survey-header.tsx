import type { BidSurveyType } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { FormModal } from '@mntn-dev/ui-components'

type Props = {
  surveyType: BidSurveyType
}

export const BidSurveyHeader = ({ surveyType }: Props) => {
  const { t } = useTranslation('survey')

  return (
    <FormModal.Header
      icon={{
        name:
          surveyType === 'maker-bid-accepted-by-brand'
            ? 'BigCheckIcon'
            : 'BigXIcon',
        size: '7xl',
      }}
      title={t(`${surveyType}.heading`)}
    />
  )
}
