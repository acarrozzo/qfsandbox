import {
  ProjectCompletedBrandReviewsMakerRatingFieldsSchema,
  type ProjectCompletedBrandReviewsMakerResponses,
  type ProjectDomainQueryModel,
  SurveyTypeEnum,
} from '@mntn-dev/domain-types'
import { FormProvider, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'

import { useSubmitSurveyHandler } from '~/components/surveys/use-submit-survey-handler.ts'

import { ProjectSurveyModalContent } from './project-survey-modal-content.tsx'

const surveyType = SurveyTypeEnum['project-completed-brand-reviews-maker']

type Props = {
  project: ProjectDomainQueryModel
  onClose: () => void
}

export const BrandProjectSurveyModal = ({
  project: { projectId, acceptor },
  onClose,
}: Props) => {
  const { t } = useTranslation(['survey'])

  const form = useForm({
    defaultValues: {
      makerRating: null,
      finalVideoQualityRating: null,
      feedback: '',
    },
  })

  const { handleSubmit } = form

  const { submit, submitted, error } = useSubmitSurveyHandler({
    surveyType,
    subjectId: projectId,
    onSuccess: onClose,
  })

  const onSubmit = (responses: ProjectCompletedBrandReviewsMakerResponses) =>
    submit({
      surveyType,
      projectId,
      responses,
    })

  return (
    <FormProvider {...form}>
      <ProjectSurveyModalContent
        submitted={submitted}
        error={error}
        surveyType={surveyType}
        userBeingReviewed={acceptor}
        ratingFields={ProjectCompletedBrandReviewsMakerRatingFieldsSchema.options.map(
          (name) => ({
            name,
            label: t(`survey:${surveyType}.${name}.label`),
            field: t(`survey:${surveyType}.${name}.field`),
          })
        )}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}
      />
    </FormProvider>
  )
}
