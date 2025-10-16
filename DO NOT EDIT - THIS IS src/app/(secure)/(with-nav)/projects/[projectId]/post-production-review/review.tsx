'use client'

import { redirect } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import {
  type DeliverableId,
  type ServiceWithDeliverables,
  servicesWithDeliverables,
} from '@mntn-dev/domain-types'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service/client'
import { SidebarLayoutContent } from '@mntn-dev/ui-components'

import { DeliverablesSidebar } from '#projects/[projectId]/post-production-review/components/deliverable-sidebar.tsx'
import { DeliverablesReviewPanel } from '#projects/[projectId]/post-production-review/components/deliverables-review-panel.tsx'
import { ReviewHeader } from '#projects/[projectId]/post-production-review/components/review-header.tsx'
import { ReviewResponsiveLayout } from '#projects/[projectId]/post-production-review/components/review-responsive-layout.tsx'
import {
  PostProductionReviewProvider,
  usePostProductionReview,
} from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const Review = ({
  initialProject,
  initialReview,
  initialServicesWithDeliverables,
  selectedDeliverableId,
}: {
  initialProject: ProjectWithAcl
  initialReview?: PostProductionSelectReviewOutput
  initialServicesWithDeliverables: ServiceWithDeliverables<ProjectServiceWithAcl>[]
  selectedDeliverableId?: DeliverableId
}) => {
  const projectId = initialProject.projectId
  const {
    data: { project },
  } = trpcReactClient.projects.get.useQuery(projectId, {
    initialData: { project: initialProject },
  })

  const { data: services } =
    trpcReactClient.projects.getProjectServicesByProjectId.useQuery(projectId, {
      initialData: initialServicesWithDeliverables,
    })

  const {
    data: { review },
  } = trpcReactClient.reviews.postProduction.selectReview.useQuery(
    { projectId: projectId },
    { initialData: { review: initialReview } }
  )

  if (!review) {
    redirect(
      route('/projects/:projectId').params({ projectId }).toRelativeUrl()
    )
  }

  const context = usePostProductionReview({
    project,
    review,
    services: servicesWithDeliverables(services),
    selectedDeliverableId,
  })

  return (
    <PostProductionReviewProvider value={context}>
      <SidebarLayoutContent>
        <ReviewHeader />

        <ReviewResponsiveLayout
          main={<DeliverablesReviewPanel />}
          sidebar={<DeliverablesSidebar />}
        />
      </SidebarLayoutContent>
    </PostProductionReviewProvider>
  )
}
