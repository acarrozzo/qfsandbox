import type { ProjectPageTab } from '@mntn-dev/app-routing'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type { PreProductionSelectReviewsForProjectOutput } from '@mntn-dev/review-service'
import { Stack } from '@mntn-dev/ui-components'

import { ProjectPageTabs } from '#projects/[projectId]/components/project-page-tabs.tsx'
import { ProjectPageContent } from '#projects/[projectId]/project-page-content.tsx'
import { ProjectFileManagerLauncher } from '~/components/files/project-file-manager-launcher.tsx'

type ProjectMainProps = {
  currentTab: ProjectPageTab
  isEditing: boolean
  project: ProjectWithAcl
  projectServices: ProjectServiceWithAcl[]
  preProductionReviews: PreProductionSelectReviewsForProjectOutput
}

export const ProjectMain = ({
  currentTab,
  isEditing,
  project,
  projectServices,
  preProductionReviews,
}: ProjectMainProps) => {
  const { acl, projectId } = project
  const showFileManagerLauncher = !acl.canEditProject

  return (
    <Stack direction="col" gap="8">
      {project.status !== 'draft' && (
        <Stack alignItems="center" justifyContent="between">
          <ProjectPageTabs currentTab={currentTab} projectId={projectId} />

          {showFileManagerLauncher && (
            <ProjectFileManagerLauncher projectId={projectId} />
          )}
        </Stack>
      )}

      <ProjectPageContent
        isEditing={isEditing}
        currentTab={currentTab}
        project={project}
        services={projectServices}
        preProductionReviews={preProductionReviews}
      />
    </Stack>
  )
}
