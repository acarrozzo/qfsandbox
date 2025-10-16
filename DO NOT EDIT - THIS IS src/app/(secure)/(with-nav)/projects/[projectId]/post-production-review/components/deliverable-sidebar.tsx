import { useMemo } from 'react'

import type { DeliverableDomainQueryModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Collapsible, Surface } from '@mntn-dev/ui-components'
import { themeDivideColorMap } from '@mntn-dev/ui-theme'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { DeliverableReviewBlade } from '#projects/[projectId]/post-production-review/components/deliverable-review-blade.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { getGroupedDeliverables } from '#utils/project/review-helpers.ts'
import { canViewPostProdDeliverableDetails } from '#utils/project/rounds-helpers.ts'
import { getDeliverableService } from '~/lib/deliverables/deliverable-helpers.ts'
import { getDeliverablesFromServices } from '~/lib/services/service-helpers.ts'

export const DeliverablesSidebar = () => {
  const {
    handleDeliverableSelect,
    project,
    review,
    services,
    selectedDeliverable,
  } = usePostProductionReviewContext()

  const { t } = useTranslation('post-production-review')

  const handleDeliverableClick = (deliverable: DeliverableDomainQueryModel) => {
    handleDeliverableSelect(deliverable)
  }

  const deliverableGroups = useMemo(
    () =>
      getGroupedDeliverables(
        review,
        services,
        getDeliverablesFromServices(services),
        t
      ),
    [review, services, t]
  )

  return (
    <Surface
      width="full"
      gap="0"
      className={`overflow-y-auto divide-y ${themeDivideColorMap.muted}`}
      dataTestId={`review-${review.reviewId}-deliverables-container`}
      dataTrackingId={`review-${review.reviewId}-deliverables-container`}
    >
      {deliverableGroups?.map(
        (deliverableGroup) =>
          isNonEmptyArray(deliverableGroup.deliverables) && (
            <Collapsible
              key={deliverableGroup.title}
              isOpen={
                deliverableGroup.open ||
                deliverableGroup.deliverables.filter(
                  (deliverable) =>
                    deliverable.deliverableId ===
                    selectedDeliverable.deliverableId
                ).length > 0
              }
              dataTestId={`deliverable-group-${deliverableGroup.title}`}
              dataTrackingId={`deliverable-group-${deliverableGroup.title}`}
            >
              <Collapsible.Title title={deliverableGroup.title} />
              <Collapsible.Panel>
                {deliverableGroup.deliverables.map((deliverable) => {
                  const service = getDeliverableService(deliverable, services)

                  return (
                    <DeliverableReviewBlade
                      key={deliverable.deliverableId}
                      deliverable={deliverable}
                      serviceName={service?.name || ''}
                      isSelected={
                        deliverable.deliverableId ===
                        selectedDeliverable?.deliverableId
                      }
                      onClick={
                        canViewPostProdDeliverableDetails(
                          review,
                          deliverable,
                          project
                        )
                          ? () => handleDeliverableClick(deliverable)
                          : undefined
                      }
                    />
                  )
                })}
              </Collapsible.Panel>
            </Collapsible>
          )
      )}
    </Surface>
  )
}
