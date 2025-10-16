import type { ProjectDetailsUpdateFormModel } from '@mntn-dev/app-form-schemas'
import { isCreditProgramKind } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type { PreProductionSelectReviewsForProjectOutput } from '@mntn-dev/review-service'
import { Button } from '@mntn-dev/ui-components'

import { useRefetchProject } from '#components/projects/use-refetch-project.ts'
import { ProjectServiceBladeList } from '#components/services/service-blades/project-service-blade-list.tsx'
import { ProjectAlertBanner } from '#projects/[projectId]/components/project-details/project-alert-banner.tsx'
import { ProjectInfoHeader } from '#projects/[projectId]/components/project-details/project-info-header.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'
import { evaluateStatus } from '~/utils/status-helpers.ts'

import { ProjectBidsTable } from './project-bids-table.tsx'
import { ProjectDescriptionEditor } from './project-description-editor.tsx'
import { ProjectDescriptionReader } from './project-description-reader.tsx'

type ProjectDetailsProps = Readonly<{
  isEditing: boolean
  project: ProjectWithAcl
  projectServices: ProjectServiceWithAcl[]
  preProductionReviews: PreProductionSelectReviewsForProjectOutput
  onRemoveService: (serviceId: string) => void
  onProjectUpdate: (updates: ProjectDetailsUpdateFormModel) => void
}>

export const ProjectDetails = ({
  isEditing,
  project,
  projectServices,
  preProductionReviews,
  onRemoveService,
  onProjectUpdate,
}: ProjectDetailsProps) => {
  const { allowManualBiddingClose } = useFlags()
  const { principal } = usePrincipal()
  const { hasPermission } = usePermissions()
  const refetchProject = useRefetchProject()
  const closeProjectBiddingWindow =
    trpcReactClient.projects.closeProjectBiddingWindow.useMutation()

  const handleCloseBiddingWindow = async () => {
    await closeProjectBiddingWindow.mutateAsync({
      projectId: project.projectId,
    })
    await refetchProject(project)
  }

  const { isBiddingOpen } = evaluateStatus(project.status)

  const canCloseBidding = () => {
    if (!isBiddingOpen) {
      return false
    }

    if (hasPermission('project:administer')) {
      return true
    }

    if (
      allowManualBiddingClose &&
      principal.authz.teamIds.includes(project.brandTeamId)
    ) {
      return true
    }

    return false
  }

  return (
    <>
      {canCloseBidding() && (
        <Button
          variant="destructive"
          onClick={handleCloseBiddingWindow}
          loading={closeProjectBiddingWindow.isPending}
        >
          End Bidding
        </Button>
      )}

      <ProjectAlertBanner project={project} />

      {project.acl.canViewProjectBidList && (
        <ProjectBidsTable
          project={project}
          hideBrandBidAmount={isCreditProgramKind(project.chosenBillingMethod)}
        />
      )}

      <ProjectInfoHeader
        isEditing={isEditing}
        project={project}
        projectServices={projectServices}
        onProjectUpdate={onProjectUpdate}
      />

      {isEditing ? (
        <ProjectDescriptionEditor
          project={project}
          onProjectUpdate={onProjectUpdate}
        />
      ) : (
        <ProjectDescriptionReader project={project} />
      )}

      <ProjectServiceBladeList
        project={project}
        projectServices={projectServices}
        preProductionReviews={preProductionReviews}
        onRemoveService={onRemoveService}
      />
    </>
  )
}
