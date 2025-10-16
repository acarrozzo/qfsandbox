import type { DeliverableDomainQueryModel } from '@mntn-dev/domain-types'
import { Blade } from '@mntn-dev/ui-components'

import { ProjectMediaBladeInfo } from '#components/deliverables/project-media-blade-info.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'

export const DeliverableReviewBlade = ({
  deliverable,
  serviceName,
  isSelected,
  onClick,
}: {
  deliverable: DeliverableDomainQueryModel
  serviceName: string
  isSelected: boolean
  onClick?: () => void
}) => {
  const { project, review } = usePostProductionReviewContext()
  return (
    <div key={deliverable.deliverableId} className="relative">
      <Blade
        type="media"
        isSelectable={!!onClick}
        isSelected={isSelected}
        onClick={onClick}
        disabled={!onClick}
        dataTestId={`deliverable-${deliverable.deliverableId}-blade`}
        dataTrackingId={`deliverable-${deliverable.deliverableId}-blade`}
      >
        <ProjectMediaBladeInfo
          review={review}
          project={project}
          serviceName={serviceName}
          deliverable={deliverable}
        />
      </Blade>
    </div>
  )
}
