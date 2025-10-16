import type { TFunction } from 'i18next'

import {
  isCustomService,
  type ProjectServiceDomainQueryModel,
  type ProjectStatus,
  type ServiceWithDeliverables,
} from '@mntn-dev/domain-types'
import type { ProjectServiceWithAcl } from '@mntn-dev/project-service'

import { evaluateStatus } from '../../utils/status-helpers.ts'
import { sortDeliverablesForDisplay } from '../deliverables/deliverable-helpers.ts'

export const getDeliverablesFromServices = (
  deliverableServices: ServiceWithDeliverables<ProjectServiceWithAcl>[]
) => {
  return deliverableServices.flatMap((service) =>
    sortDeliverablesForDisplay(service.deliverables, deliverableServices)
  )
}

export const getGroupedServices = (
  services: ProjectServiceWithAcl[],
  status: ProjectStatus,
  t: TFunction<['project-services']>
) => {
  const visibleServices = services
    .filter((service) => !isIncludedRoundOfFeedback(service))
    .sort(
      (a, b) => (a.deliverables?.length ?? 0) - (b.deliverables?.length ?? 0)
    )

  const preProdServices = visibleServices.filter(
    ({ preProductionReview }) => !!preProductionReview
  )
  const postProdServices = visibleServices.filter(({ deliverables }) =>
    deliverables?.some(({ details: { reviewLevel } }) => reviewLevel !== 'none')
  )
  const enhancementServices = visibleServices.filter(
    ({ preProductionReview, deliverables }) =>
      !preProductionReview &&
      deliverables?.every(
        ({ details: { reviewLevel } }) => reviewLevel === 'none'
      )
  )
  const includedServices = visibleServices.filter(
    ({ serviceType }) => serviceType === 'included'
  )
  const addedServices = visibleServices.filter(
    ({ serviceType }) => serviceType !== 'included'
  )

  if (['pre_production', 'pre_production_complete'].includes(status)) {
    const modifiedPostProdServices = postProdServices.filter(
      (service) => !preProdServices.includes(service)
    )
    return [
      {
        title: `${t('collapsible-header.pre-production')} (${preProdServices.length})`,
        services: preProdServices,
        open: true,
      },
      {
        title: `${t('collapsible-header.post-production')} (${modifiedPostProdServices.length})`,
        services: modifiedPostProdServices,
        open: false,
      },
      {
        title: `${t('collapsible-header.enhancements')} (${enhancementServices.length})`,
        services: enhancementServices,
        open: false,
      },
    ]
  }

  if (
    [
      'production',
      'post_production',
      'post_production_complete',
      'complete',
    ].includes(status)
  ) {
    const modifiedPreProdServices = preProdServices.filter(
      (service) => !postProdServices.includes(service)
    )
    return [
      {
        title: `${t('collapsible-header.pre-production')} (${modifiedPreProdServices.length})`,
        services: modifiedPreProdServices,
        open: false,
      },
      {
        title: `${t('collapsible-header.post-production')} (${postProdServices.length})`,
        services: postProdServices,
        open: false,
      },
      {
        title: `${t('collapsible-header.enhancements')} (${enhancementServices.length})`,
        services: enhancementServices,
        open: false,
      },
    ]
  }

  return [
    {
      title: `${t('collapsible-header.included')} (${includedServices.length})`,
      services: includedServices,
      open: true,
    },
    {
      title: `${t('collapsible-header.added')} (${addedServices.length})`,
      services: addedServices,
      open: true,
    },
  ]
}

export const isCustomServiceMissingBrandNote = (
  service: ProjectServiceDomainQueryModel
) => isCustomService(service) && !service.brandNote

export const isNonIncludedService = (service: ProjectServiceDomainQueryModel) =>
  service.serviceType !== 'included'

export const isSendingProjectToBePriced = (
  projectStatus: ProjectStatus,
  services: ProjectServiceDomainQueryModel[]
) => {
  return projectStatus === 'draft' && services.some(isCustomService)
}

export const isIncludedRoundOfFeedback = (
  service: ProjectServiceDomainQueryModel
) => {
  return service.serviceKey !== undefined && service.serviceType === 'included'
}

export const requiresCustomServiceBrandNote = (
  projectStatus: ProjectStatus,
  { serviceType }: ProjectServiceDomainQueryModel
) => {
  const { isCustom } = evaluateStatus(serviceType)
  const { isDraft } = evaluateStatus(projectStatus)
  const requiresNote = !!(isCustom && isDraft)
  return requiresNote
}
