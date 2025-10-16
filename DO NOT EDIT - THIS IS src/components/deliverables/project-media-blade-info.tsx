import type { DeliverableDomainQueryModel } from '@mntn-dev/domain-types'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service'
import { Blade, Stack } from '@mntn-dev/ui-components'

import { DeliverableInfo } from '#components/deliverables/deliverable-info.tsx'
import { ProjectMediaBladeTag } from '#components/deliverables/project-media-blade-tag.tsx'

export const ProjectMediaBladeInfo = ({
  review,
  project,
  serviceName,
  deliverable,
}: {
  review?: PostProductionSelectReviewOutput
  project: ProjectWithAcl
  serviceName: string
  deliverable: DeliverableDomainQueryModel
}) => {
  return (
    <Stack direction="row" width="full" gap="2">
      <Blade.Column width="auto">
        <Blade.MediaIcon category={deliverable.details.category} />
      </Blade.Column>
      <Blade.Column direction="col" gap="1" grow shrink>
        <DeliverableInfo
          deliverable={deliverable.details}
          serviceName={serviceName}
        />
        <ProjectMediaBladeTag
          review={review}
          project={project}
          deliverable={deliverable}
        />
      </Blade.Column>
    </Stack>
  )
}
