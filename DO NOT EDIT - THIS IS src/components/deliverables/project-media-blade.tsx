import { useRouter } from '@mntn-dev/app-navigation'
import { projectPostProductionReviewRoute } from '@mntn-dev/app-routing'
import type { DeliverableDomainQueryModel } from '@mntn-dev/domain-types'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service/client'
import { Blade } from '@mntn-dev/ui-components'

import { ProjectMediaBladeInfo } from '#components/deliverables/project-media-blade-info.tsx'
import { canAccessReview } from '#utils/project/review-helpers.ts'

type Props = {
  serviceName: string
  review?: PostProductionSelectReviewOutput
  project: ProjectWithAcl
  deliverable: DeliverableDomainQueryModel
  canAttachFinalAssets?: boolean
}

export const ProjectMediaBlade = ({
  serviceName,
  review,
  project,
  deliverable,
}: Props) => {
  const router = useRouter()
  const canOpen =
    review &&
    canAccessReview(review.project.status, deliverable.details.reviewLevel)

  const handleDeliverableClick = () => {
    if (canOpen && review?.project) {
      router.push(
        projectPostProductionReviewRoute({
          projectId: review.project.projectId,
          deliverableId: deliverable.deliverableId,
        })
      )
    }
  }

  return (
    <Blade
      type="media"
      hasHoverState={canOpen}
      onClick={canOpen ? handleDeliverableClick : undefined}
      dataTestId={`project-media-blade-${deliverable.deliverableId}`}
      dataTrackingId={`project-media-blade-${deliverable.deliverableId}`}
    >
      <ProjectMediaBladeInfo
        review={review}
        project={project}
        serviceName={serviceName}
        deliverable={deliverable}
      />
    </Blade>
  )
}
