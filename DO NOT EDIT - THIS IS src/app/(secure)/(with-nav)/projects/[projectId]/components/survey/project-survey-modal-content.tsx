import type {
  ProjectCompletedBrandReviewsMakerRatingField,
  ProjectCompletedBrandReviewsMakerResponses,
  ProjectCompletedMakerReviewsBrandRatingField,
  ProjectCompletedMakerReviewsBrandResponses,
  ProjectSurveyType,
  UserDomainQueryModel,
} from '@mntn-dev/domain-types'
import { useFormContext } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormModal, Heading, Stack, Text } from '@mntn-dev/ui-components'

import { SurveyAvatar } from '~/components/surveys/survey-avatar.tsx'
import { SurveyFeedbackField } from '~/components/surveys/survey-feedback-field.tsx'
import { SurveyFooter } from '~/components/surveys/survey-footer.tsx'
import { SurveyRatingField } from '~/components/surveys/survey-rating-field.tsx'

type Props = {
  submitted: boolean
  error: boolean
  surveyType: ProjectSurveyType
  userBeingReviewed: UserDomainQueryModel | undefined
  ratingFields: {
    name:
      | ProjectCompletedBrandReviewsMakerRatingField
      | ProjectCompletedMakerReviewsBrandRatingField
    label: string
    field: string
  }[]
  onClose: () => void
  onSubmit: () => void
}

export const ProjectSurveyModalContent = ({
  submitted,
  error,
  surveyType,
  userBeingReviewed,
  ratingFields,
  onClose,
  onSubmit,
}: Props) => {
  const { t } = useTranslation(['survey', 'validation'])

  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<
    | ProjectCompletedBrandReviewsMakerResponses
    | ProjectCompletedMakerReviewsBrandResponses
  >()

  return (
    <>
      <FormModal.Body>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-8">
            <div className="flex gap-8 items-center">
              <Stack direction="col" gap="6" className="pt-4">
                <Heading fontSize="4xl">
                  {t(`survey:${surveyType}.heading`)}
                </Heading>

                {ratingFields.map(({ name, label, field }) => (
                  <SurveyRatingField
                    key={name}
                    name={name}
                    control={control}
                    surveyType={surveyType}
                    disabled={submitted}
                    label={label}
                    field={field}
                  />
                ))}
              </Stack>

              {userBeingReviewed && (
                <SurveyAvatar
                  user={userBeingReviewed}
                  surveyType={surveyType}
                />
              )}
            </div>

            <SurveyFeedbackField
              name="feedback"
              surveyType={surveyType}
              disabled={submitted}
              label={t(`survey:${surveyType}.feedback.label`)}
              error={errors.feedback}
              register={register}
            />
          </div>

          <Text fontWeight="medium" textColor="secondary">
            {t(`survey:${surveyType}.anon-message`)}
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
