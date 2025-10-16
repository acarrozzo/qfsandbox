import type { SurveySubjectId, SurveyType } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export function useRefetchSurvey(
  surveyType: SurveyType,
  subjectId: SurveySubjectId
) {
  const utils = trpcReactClient.useUtils()

  const refetch = async () => {
    await Promise.all([
      utils.surveys.getMySurvey.refetch({ surveyType, subjectId }),
      utils.surveys.shouldSubmitSurvey.refetch({ surveyType, subjectId }),
    ])
  }

  return refetch
}
