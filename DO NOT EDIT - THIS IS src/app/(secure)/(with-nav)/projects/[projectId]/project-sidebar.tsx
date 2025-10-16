import type { ServiceWithDeliverables } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'

import { ProjectMediaBladeList } from '#components/deliverables/project-media-blade-list.tsx'
import { ProjectCompleteBanner } from '#projects/[projectId]/components/project-complete-banner.tsx'
import { ProjectPostProductionBanner } from '#projects/[projectId]/components/project-post-production-banner.tsx'
import { ProjectProductionBanner } from '#projects/[projectId]/components/project-production-banner.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { MakerProjectErrorProcessingFinalFilesBanner } from '~/app/(secure)/(with-nav)/projects/[projectId]/components/maker-project-error-processing-final-files-banner'
import { ProjectProcessingFinalFilesBanner } from '~/app/(secure)/(with-nav)/projects/[projectId]/components/project-processing-final-files.banner'
import { getProjectSidebarBanner } from '~/app/(secure)/(with-nav)/projects/[projectId]/get-project-sidebar-banner'

export const ProjectSidebar = ({
  project: initialProject,
  deliverableServices,
}: {
  project: ProjectWithAcl
  deliverableServices: ServiceWithDeliverables<ProjectServiceWithAcl>[]
}) => {
  const { t } = useTranslation(['project-deliverables'])

  const {
    data: { project },
  } = trpcReactClient.projects.get.useQuery(initialProject.projectId, {
    initialData: { project: initialProject },
  })

  const hasFileErrors = project.deliverables?.some(
    (deliverable) => deliverable.file?.taggingStatus === 'error'
  )

  const { data: v2 } =
    trpcReactClient.reviews.postProduction.selectReview.useQuery({
      projectId: project.projectId,
    })
  const banner = getProjectSidebarBanner(
    project.status,
    !!project.acl.canAttachFinalAssetToDeliverable,
    hasFileErrors
  )

  return (
    <>
      {banner === 'post-production' && v2?.review && (
        <ProjectPostProductionBanner
          project={project}
          deliverableServices={deliverableServices}
          review={v2.review}
        />
      )}
      {banner === 'production' && (
        <ProjectProductionBanner
          projectId={project.projectId}
          canSetProjectPostProduction={project.acl.canSetProjectPostProduction}
        />
      )}

      {banner === 'processingFinalFiles' && (
        <ProjectProcessingFinalFilesBanner />
      )}
      {banner === 'fileErrors' && (
        <MakerProjectErrorProcessingFinalFilesBanner
          project={project}
          deliverableServices={deliverableServices}
        />
      )}
      {banner === 'complete' && (
        <ProjectCompleteBanner
          project={project}
          deliverableServices={deliverableServices}
        />
      )}

      <ProjectMediaBladeList
        project={project}
        review={v2?.review}
        services={deliverableServices}
        finalCutsDescription={t('final-cuts-description')}
      />
    </>
  )
}
