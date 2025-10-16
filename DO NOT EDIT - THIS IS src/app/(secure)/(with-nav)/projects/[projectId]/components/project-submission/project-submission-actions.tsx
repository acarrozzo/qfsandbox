import type {
  AgreementDomainSelectModel,
  ProjectDomainQueryModel,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Surface } from '@mntn-dev/ui-components'

import { ProjectMinimumPriceWithToggle } from '#projects/[projectId]/components/project-minimum-price-with-toggle.tsx'

import { ProjectPreSubmitMessage } from './project-pre-submit-message.tsx'

export const ProjectSubmissionActions = ({
  project,
  onSubmitProject,
  isLoading,
  customServiceCount = 0,
}: {
  agreement: AgreementDomainSelectModel
  project: ProjectDomainQueryModel
  onSubmitProject: () => void
  isLoading: boolean
  customServiceCount?: number
}) => {
  const { t } = useTranslation(['project-form', 'pricing'])

  return (
    <Surface border className="w-full flex-initial p-8">
      <div className="flex flex-col gap-8 text-left">
        <ProjectMinimumPriceWithToggle
          project={project}
          priceContext="brand"
          customServiceCount={customServiceCount}
        />

        <ProjectPreSubmitMessage />

        <div>
          <Button
            loading={isLoading}
            width="full"
            variant="primary"
            onClick={onSubmitProject}
          >
            {t('submit-project', { ns: 'project-form' })}
          </Button>
        </div>
      </div>
    </Surface>
  )
}
