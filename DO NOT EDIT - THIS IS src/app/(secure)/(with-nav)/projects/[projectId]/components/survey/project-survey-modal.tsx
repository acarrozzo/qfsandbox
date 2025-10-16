import type { ReactNode } from 'react'

import type {
  ProjectDomainQueryModel,
  ProjectSurveyType,
} from '@mntn-dev/domain-types'
import { FormModal } from '@mntn-dev/ui-components'

import { BrandProjectSurveyModal } from './brand-project-survey-modal.tsx'
import { MakerProjectSurveyModal } from './maker-project-survey-modal.tsx'

type Props = {
  project: ProjectDomainQueryModel
  surveyType: ProjectSurveyType
  onClose: () => void
}

type ProjectSurveyComponent = (props: Props) => ReactNode

const getSurveyComponent = (surveyType: ProjectSurveyType) =>
  (
    ({
      'project-completed-brand-reviews-maker': BrandProjectSurveyModal,
      'project-completed-maker-reviews-brand': MakerProjectSurveyModal,
    }) satisfies Record<ProjectSurveyType, ProjectSurveyComponent>
  )[surveyType]

export const ProjectSurveyModal = (props: Props) => {
  const { surveyType, onClose } = props

  const SurveyComponent = getSurveyComponent(surveyType)

  return (
    <FormModal open onClose={onClose} className="w-176">
      <SurveyComponent {...props} />
    </FormModal>
  )
}
