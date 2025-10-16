import {
  type BidId,
  MakerBidAcceptedByBrandReasons,
  type MakerBidAcceptedByBrandResponses,
  SurveyTypeEnum,
} from '@mntn-dev/domain-types'
import { FormProvider, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormModal, useToast } from '@mntn-dev/ui-components'

import { useSubmitSurveyHandler } from '~/components/surveys/use-submit-survey-handler.ts'

import { BidSurveyModalContent } from './bid-survey-modal-content.tsx'

const surveyType = SurveyTypeEnum['maker-bid-accepted-by-brand']

type Props = {
  open: boolean
  bidId: BidId
  onClose: () => void
}

export const MakerBidAcceptedByBrandSurveyModal = ({
  open,
  bidId,
  onClose,
}: Props) => {
  const form = useForm({ defaultValues: { reason: '', feedback: '' } })
  const { showToast } = useToast()
  const { t } = useTranslation(['survey', 'toast'])

  const { handleSubmit } = form

  const { submit, submitted, error } = useSubmitSurveyHandler({
    surveyType,
    subjectId: bidId,
    onSuccess: () => {
      showToast.success({
        title: t('toast:survey.submitted.title'),
        dataTestId: `${surveyType}-submitted-toast`,
        dataTrackingId: `${surveyType}-submitted-toast`,
      })
      onClose()
    },
  })

  const onSubmit = (responses: MakerBidAcceptedByBrandResponses) =>
    submit({
      surveyType,
      bidId,
      responses,
    })

  return (
    <FormModal open={open} onClose={onClose} className="w-5/12">
      <FormProvider {...form}>
        <BidSurveyModalContent
          error={error}
          submitted={submitted}
          surveyType={surveyType}
          reasons={MakerBidAcceptedByBrandReasons.map((reason) => ({
            value: reason,
            label: t(`survey:${surveyType}.reason.options.${reason}`),
          }))}
          onClose={onClose}
          onSubmit={handleSubmit(onSubmit)}
        />
      </FormProvider>
    </FormModal>
  )
}
