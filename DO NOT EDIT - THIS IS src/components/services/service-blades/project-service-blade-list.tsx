import { useMemo, useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectServiceDomainQueryModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type { PreProductionSelectReviewsForProjectOutput } from '@mntn-dev/review-service'
import { Collapsible, Surface } from '@mntn-dev/ui-components'
import { themeDivideColorMap } from '@mntn-dev/ui-theme'
import { isEmptyArray } from '@mntn-dev/utilities'

import { ProjectServiceBladeListHeader } from '#components/services/service-blades/project-service-blade-list-header.tsx'
import { ServiceDescriptionModal } from '#components/services/service-details/service-description-modal.tsx'
import { EmptyState } from '#components/shared/empty-state.tsx'
import { getGroupedServices } from '~/lib/services/service-helpers.ts'

import { ProjectServiceBlade } from './project-service-blade.tsx'

type ProjectServiceBladeContainerProps = {
  project: ProjectWithAcl
  projectServices: ProjectServiceWithAcl[]
  preProductionReviews: PreProductionSelectReviewsForProjectOutput
  onRemoveService?: (serviceId: string) => void
}

export const ProjectServiceBladeList = ({
  project,
  projectServices,
  preProductionReviews,
  onRemoveService,
}: ProjectServiceBladeContainerProps) => {
  const router = useRouter()
  const { t } = useTranslation('project-services')
  const { projectId, status } = project
  const [selectedService, setSelectedService] = useState<
    ProjectServiceDomainQueryModel | undefined
  >(undefined)

  const handleServiceClick =
    ({ projectServiceId }: ProjectServiceDomainQueryModel) =>
    (hasReview: boolean) => {
      router.push(
        route(
          `/projects/:projectId/services/:projectServiceId${hasReview ? '/review' : ''}`
        ).params({
          projectId,
          projectServiceId,
        })
      )
    }

  const handleRemoveService =
    (service: ProjectServiceDomainQueryModel) => () => {
      onRemoveService?.(service.projectServiceId)
    }

  const groupedServices = useMemo(
    () => getGroupedServices(projectServices, status, t),
    [projectServices, status, t]
  )

  const reviewsByServiceId = useMemo(
    () =>
      new Map(preProductionReviews.map((r) => [r.service.projectServiceId, r])),
    [preProductionReviews]
  )

  return (
    <>
      <Surface width="full" gap="0" border elevation="xs">
        <ProjectServiceBladeListHeader
          project={project}
          projectServices={projectServices}
        />
        <Surface.Body
          className={`divide-y ${themeDivideColorMap.muted}`}
          dataTestId={`project-service-list-${projectId}`}
          dataTrackingId={`project-service-list-${projectId}`}
        >
          {isEmptyArray(projectServices) && (
            <EmptyState className="p-8" subTitle={t('no-services-yet')} />
          )}

          {groupedServices.map(
            (serviceGroup) =>
              !isEmptyArray(serviceGroup.services) && (
                <Collapsible
                  key={serviceGroup.title}
                  isOpen={serviceGroup.open}
                  dataTestId={`project-${projectId}-service-group-${serviceGroup.title}`}
                  dataTrackingId={`project-${projectId}-service-group-${serviceGroup.title}`}
                >
                  <Collapsible.Title title={serviceGroup.title} />
                  <Collapsible.Panel>
                    {serviceGroup.services.map((service) => (
                      <ProjectServiceBlade
                        key={service.projectServiceId}
                        service={service}
                        review={reviewsByServiceId.get(
                          service.projectServiceId
                        )}
                        projectStatus={status}
                        onRemove={handleRemoveService(service)}
                        onServiceClick={handleServiceClick(service)}
                        showDescriptionClick={() => setSelectedService(service)}
                      />
                    ))}
                  </Collapsible.Panel>
                </Collapsible>
              )
          )}
        </Surface.Body>
      </Surface>
      <ServiceDescriptionModal
        name={selectedService?.name ?? ''}
        onClose={() => setSelectedService(undefined)}
        open={!!selectedService}
        description={selectedService?.description}
      />
    </>
  )
}
