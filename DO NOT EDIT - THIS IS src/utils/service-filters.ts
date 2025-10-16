import {
  getServiceDeliverableDetails,
  type ServiceWithDeliverables,
} from '@mntn-dev/domain-types'
import type { ProjectServiceWithAcl } from '@mntn-dev/project-service'

export const serviceHasVideoDeliverable = (
  service: ServiceWithDeliverables<ProjectServiceWithAcl>
) => {
  return service.deliverables.some((deliverable) => {
    const { category } = getServiceDeliverableDetails(deliverable)
    return category === 'video'
  })
}

export const serviceHasFileOrOtherDeliverable = (
  service: ServiceWithDeliverables<ProjectServiceWithAcl>
) => {
  return service.deliverables.some((deliverable) => {
    const { category } = getServiceDeliverableDetails(deliverable)
    return ['file', 'other'].includes(category)
  })
}
