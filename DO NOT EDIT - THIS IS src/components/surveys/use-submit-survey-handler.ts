import type {
  SurveyDomainSelectModel,
  SurveySubjectId,
  SurveyType,
} from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefetchSurvey } from '~/components/surveys/use-refetch-survey.ts'

type Props = {
  surveyType: SurveyType
  subjectId: SurveySubjectId
  onSuccess: (survey: SurveyDomainSelectModel) => void
}

export const useSubmitSurveyHandler = ({
  surveyType,
  subjectId,
  onSuccess,
}: Props) => {
  const refetch = useRefetchSurvey(surveyType, subjectId)

  const { mutateAsync, isPending, isSuccess, isError } =
    trpcReactClient.surveys.submitSurvey.useMutation({
      onSuccess: (data) => {
        refetch()
        onSuccess(data.survey)
      },
    })

  return {
    submit: mutateAsync,
    submitted: isPending || isSuccess,
    error: isError,
  }
}
