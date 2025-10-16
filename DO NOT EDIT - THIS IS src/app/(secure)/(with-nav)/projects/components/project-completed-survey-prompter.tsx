import { useEffect, useState } from 'react'

import type {
  CustomerOrganizationType,
  ProjectSurveyType,
} from '@mntn-dev/domain-types'
import type { ProjectWithAcl } from '@mntn-dev/project-service'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { ProjectSurveyModal } from '../[projectId]/components/survey/project-survey-modal.tsx'

type Props = {
  project: ProjectWithAcl & { status: 'complete' }
  organizationType: CustomerOrganizationType
}

export const getSurveyType = (organizationType: CustomerOrganizationType) =>
  (
    ({
      brand: 'project-completed-brand-reviews-maker',
      agency: 'project-completed-maker-reviews-brand',
    }) satisfies Record<CustomerOrganizationType, ProjectSurveyType>
  )[organizationType]

export const ProjectCompletedSurveyPrompter = ({
  project,
  organizationType,
}: Props) => {
  const { projectId: subjectId } = project
  const [shownSurveyType, setShownSurveyType] = useState<
    ProjectSurveyType | undefined
  >()

  const [prompted, setPrompted] = useState(false)

  const expectedSurveyType = getSurveyType(organizationType)

  const shouldSubmitSurveyQuery =
    trpcReactClient.surveys.shouldSubmitSurvey.useQuery({
      subjectId,
      surveyType: expectedSurveyType,
    })

  const shouldSubmitSurvey = !!shouldSubmitSurveyQuery.data?.shouldSubmitSurvey

  useEffect(() => {
    if (prompted || !shouldSubmitSurvey) {
      return
    }

    setPrompted(true)
    setShownSurveyType(expectedSurveyType)
  }, [expectedSurveyType, shouldSubmitSurvey, prompted])

  const handleSurveyClose = () => setShownSurveyType(undefined)

  return (
    shownSurveyType && (
      <ProjectSurveyModal
        surveyType={shownSurveyType}
        project={project}
        onClose={handleSurveyClose}
      />
    )
  )
}
