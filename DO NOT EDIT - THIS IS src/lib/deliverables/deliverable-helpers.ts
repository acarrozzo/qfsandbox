import type { TFunction } from 'i18next'

import {
  type DeliverableDetails,
  type DeliverableDomainQueryModel,
  getServiceDeliverableDetails,
  isVideoDeliverable,
  isVideoDurationArray,
  isVideoDurationFixed,
  isVideoDurationRange,
  type ServiceWithDeliverables,
  type VideoDuration,
} from '@mntn-dev/domain-types'
import type { ProjectServiceWithAcl } from '@mntn-dev/project-service'

const sortDeliverablesByGroup = (
  deliverables: DeliverableDomainQueryModel[],
  services: ServiceWithDeliverables<ProjectServiceWithAcl>[],
  includeNonPostProdReview = true
) => {
  const [includedVideos, addOnVideos, files] = deliverables.reduce<
    [
      DeliverableDomainQueryModel[],
      DeliverableDomainQueryModel[],
      DeliverableDomainQueryModel[],
    ]
  >(
    ([includedVideos, addOnVideos, files], deliverable) => {
      const details = getServiceDeliverableDetails(deliverable)
      const service = getDeliverableService(deliverable, services)
      if (
        !includeNonPostProdReview &&
        deliverable.details.reviewLevel === 'none'
      ) {
        return [includedVideos, addOnVideos, files]
      }

      if (details?.category === 'video') {
        if (service?.serviceType === 'included') {
          return [[...includedVideos, deliverable], addOnVideos, files]
        }
        return [includedVideos, [...addOnVideos, deliverable], files]
      }

      return [includedVideos, addOnVideos, [...files, deliverable]]
    },
    [[], [], []]
  )

  return { videos: [...includedVideos, ...addOnVideos], files }
}

const sortDeliverablesForDisplay = (
  deliverables: DeliverableDomainQueryModel[],
  services: ServiceWithDeliverables<ProjectServiceWithAcl>[]
) => {
  return deliverables.toSorted((a, b) => {
    if (isVideoDeliverable(a.details) && a.details.cut === 'concept') {
      return -1
    }
    if (isVideoDeliverable(b.details) && b.details.cut === 'concept') {
      return 1
    }

    const aService = getDeliverableService(a, services)
    const bService = getDeliverableService(b, services)
    return getDeliverableName(a.details, aService?.name).localeCompare(
      getDeliverableName(b.details, bService?.name)
    )
  })
}

const getDeliverableName = (
  deliverable: DeliverableDetails,
  serviceName?: string
) => {
  if (deliverable.name) {
    return deliverable.name
  }

  if (deliverable.category === 'video' && deliverable.aspectRatio) {
    return deliverable.aspectRatio
  }

  return serviceName ?? 'Service'
}

const getDeliverableService = (
  deliverable: DeliverableDomainQueryModel,
  services: ServiceWithDeliverables<ProjectServiceWithAcl>[]
) => {
  if (deliverable.service) {
    return deliverable.service
  }

  return services.find((service) => {
    return service.deliverables.some(
      (d) => d.deliverableId === deliverable.deliverableId
    )
  })
}

const getVideoDuration = ({
  duration,
  t,
}: {
  duration: VideoDuration
  t: TFunction<['deliverable']>
}) => {
  if (isVideoDurationRange(duration)) {
    return `${duration.min}-${duration.max} ${t('deliverable:video.duration.seconds')}`
  }

  if (isVideoDurationFixed(duration)) {
    return `${duration} ${t('deliverable:video.duration.seconds')}`
  }
}

const getVideoDurations = ({
  duration,
  t,
}: {
  duration: VideoDuration
  t: TFunction<'deliverable'>
}) => {
  return (isVideoDurationArray(duration) ? duration : [duration])
    .map((duration) => getVideoDuration({ duration, t }))
    .filter((token) => token !== undefined)
}

const deriveDeliverablesNames = ({
  deliverables,
  t,
}: {
  deliverables: Array<DeliverableDetails> | undefined
  t: TFunction<'deliverable'>
}) =>
  deliverables
    ? deliverables.map((deliverable) =>
        deriveDeliverableName({ deliverable, t })
      )
    : []

const deriveDeliverableName = ({
  deliverable,
  t,
}: {
  deliverable: DeliverableDetails
  t: TFunction<'deliverable'>
}) => deriveTokenizedDeliverableName({ deliverable, t }).join(', ')

const deriveTokenizedDeliverableName: ({
  deliverable,
  t,
}: {
  deliverable: DeliverableDetails
  t: TFunction<['deliverable', 'generic']>
}) => string[] = ({ deliverable, t }) => {
  const { category } = deliverable

  switch (category) {
    case 'video': {
      const { aspectRatio, duration, cut } = deliverable
      const durations = getVideoDurations({ duration, t })

      return [
        t(`deliverable:video.cut.${cut}`),
        durations.length > 0
          ? durations.join(` ${t('generic:or').toLowerCase()} `)
          : undefined,
        aspectRatio ? aspectRatio : undefined,
      ].filter((token) => token !== undefined)
    }
    default:
      return [t(`deliverable:category.${category}`)]
  }
}

export {
  sortDeliverablesByGroup,
  sortDeliverablesForDisplay,
  getDeliverableName,
  getDeliverableService,
  deriveDeliverableName,
  deriveDeliverablesNames,
  deriveTokenizedDeliverableName,
}
