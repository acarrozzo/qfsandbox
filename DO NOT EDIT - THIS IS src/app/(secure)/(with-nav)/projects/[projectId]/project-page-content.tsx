import type { ProjectDetailsUpdateFormModel } from '@mntn-dev/app-form-schemas'
import { useRouter } from '@mntn-dev/app-navigation'
import { type ProjectPageTab, route } from '@mntn-dev/app-routing'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type { PreProductionSelectReviewsForProjectOutput } from '@mntn-dev/review-service'

import { ProjectDetails } from '#projects/[projectId]/components/project-details/project-details.tsx'
import { ProjectSetProductionModal } from '#projects/[projectId]/components/project-set-production-modal.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefetchProject } from '~/components/projects/use-refetch-project.ts'
import { useRefetchProjectServices } from '~/components/services/use-refetch-project-services.ts'

import { ProjectActivity } from './components/project-activity.tsx'

export type ProjectPageContentProps = {
  currentTab: ProjectPageTab
  isEditing: boolean
  project: ProjectWithAcl
  services: ProjectServiceWithAcl[]
  preProductionReviews: PreProductionSelectReviewsForProjectOutput
}

export const ProjectPageContent = ({
  currentTab,
  isEditing,
  project,
  project: { projectId },
  services,
  preProductionReviews,
}: ProjectPageContentProps) => {
  const router = useRouter()
  const refetchProject = useRefetchProject()
  const refetchProjectServices = useRefetchProjectServices({ projectId })

  const removeServiceFromProject =
    trpcReactClient.projects.removeServiceFromProject.useMutation()

  const handleRemoveService = async (serviceId: string) => {
    await removeServiceFromProject.mutateAsync(serviceId)
    await refetchProjectServices()
    await refetchProject(project)
  }

  const update = trpcReactClient.projects.update.useMutation()

  const handleProjectUpdate = async (
    updates: ProjectDetailsUpdateFormModel
  ) => {
    const updatedProject = await update.mutateAsync({
      projectId: project.projectId,
      updates,
    })
    await refetchProject(updatedProject)
  }

  const setProductionStatus =
    trpcReactClient.projects.setProjectProduction.useMutation()
  const handleMoveToProduction = async () => {
    const updatedProject = await setProductionStatus.mutateAsync({
      projectId: project.projectId,
    })
    await refetchProject(updatedProject)
  }

  const getActiveTab = () => {
    switch (currentTab) {
      case 'details':
        return (
          <ProjectDetails
            isEditing={isEditing}
            project={project}
            projectServices={services}
            preProductionReviews={preProductionReviews}
            onRemoveService={handleRemoveService}
            onProjectUpdate={handleProjectUpdate}
          />
        )
      case 'activity':
        return <ProjectActivity project={project} />
      default:
        router.push(route('/projects'))
    }
  }

  return (
    <>
      {getActiveTab()}
      {project.acl.canSetProjectProduction && (
        <ProjectSetProductionModal
          onClose={handleMoveToProduction}
          isLoading={setProductionStatus.isPending}
        />
      )}
    </>
  )
}
