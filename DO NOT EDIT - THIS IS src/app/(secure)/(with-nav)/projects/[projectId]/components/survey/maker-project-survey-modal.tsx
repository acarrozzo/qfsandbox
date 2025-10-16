import {
  ProjectCompletedMakerReviewsBrandRatingFieldsSchema,
  type ProjectCompletedMakerReviewsBrandResponses,
  type ProjectDomainQueryModel,
  SurveyTypeEnum,
} from '@mntn-dev/domain-types'
import { FormProvider, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'

import { useSubmitSurveyHandler } from '~/components/surveys/use-submit-survey-handler.ts'

import { ProjectSurveyModalContent } from './project-survey-modal-content.tsx'

const surveyType = SurveyTypeEnum['project-completed-maker-reviews-brand']

type Props = {
  project: ProjectDomainQueryModel
  onClose: () => void
}

export const MakerProjectSurveyModal = ({
  project: { projectId, owner },
  onClose,
}: Props) => {
  const { t } = useTranslation(['survey'])

  const form = useForm({
    defaultValues: {
      brandRating: null,
      feedback: '',
    },
  })

  const { handleSubmit } = form

  const { submit, submitted, error } = useSubmitSurveyHandler({
    surveyType,
    subjectId: projectId,
    onSuccess: onClose,
  })

  const onSubmit = (responses: ProjectCompletedMakerReviewsBrandResponses) =>
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
        userBeingReviewed={owner}
        ratingFields={ProjectCompletedMakerReviewsBrandRatingFieldsSchema.options.map(
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
