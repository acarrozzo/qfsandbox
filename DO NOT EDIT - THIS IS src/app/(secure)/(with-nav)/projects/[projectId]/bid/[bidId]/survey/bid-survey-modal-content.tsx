import type {
  BidSurveyType,
  MakerBidAcceptedByBrandReason,
  MakerBidAcceptedByBrandResponses,
} from '@mntn-dev/domain-types'
import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormModal, Text } from '@mntn-dev/ui-components'

import { SurveyFeedbackField } from '~/components/surveys/survey-feedback-field.tsx'
import { SurveyFooter } from '~/components/surveys/survey-footer.tsx'
import { SurveyReasonField } from '~/components/surveys/survey-reason-field.tsx'
import { useMyOrganization } from '~/hooks/secure/use-my-organization.ts'

import { BidSurveyHeader } from './bid-survey-header.tsx'
import { BidSurveySubHeader } from './bid-survey-sub-header.tsx'

type Props = {
  submitted: boolean
  error: boolean
  surveyType: BidSurveyType
  reasons: { value: MakerBidAcceptedByBrandReason; label: string }[]
  onClose: () => void
  onSubmit: () => void
}

export const BidSurveyModalContent = ({
  submitted,
  error,
  surveyType,
  reasons,
  onClose,
  onSubmit,
}: Props) => {
  const { t } = useTranslation(['survey', 'validation'])
  const { organizationType } = useMyOrganization()

  const {
    control,
    formState: { errors },
    register,
    watch,
  } = useFormContext<MakerBidAcceptedByBrandResponses>()

  const reason = watch('reason')

  return (
    <>
      <BidSurveyHeader surveyType={surveyType} />
      <FormModal.Body>
        <div className="flex flex-col gap-6">
          <BidSurveySubHeader surveyType={surveyType} />

          <div className="flex flex-col gap-4">
            <SurveyReasonField
              name="reason"
              control={control}
              surveyType={surveyType}
              disabled={submitted}
              label={t(`survey:${surveyType}.reason.label`)}
              field={t(`survey:${surveyType}.reason.field`)}
              placeholder={t(`survey:${surveyType}.reason.placeholder`)}
              reasons={reasons}
            />

            <SurveyFeedbackField
              name="feedback"
              surveyType={surveyType}
              disabled={submitted}
              required={reason === 'other'}
              error={errors.feedback}
              register={register}
            />
          </div>

          <Text fontWeight="medium" textColor="secondary">
            {t(`survey:shared.matching-message.${organizationType}`)}
          </Text>
        </div>
      </FormModal.Body>
      <FormModal.Footer>
        <SurveyFooter
          surveyType={surveyType}
          loading={submitted}
          error={error}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </FormModal.Footer>
    </>
  )
}
