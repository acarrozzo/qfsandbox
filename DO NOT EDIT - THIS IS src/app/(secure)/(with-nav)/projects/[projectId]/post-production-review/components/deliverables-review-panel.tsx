import { PostProductionCompleteProjectStatuses } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Surface, Tabs } from '@mntn-dev/ui-components'

import { DeliverablesReviewPanelContent } from '#projects/[projectId]/post-production-review/components/deliverables-review-panel-content.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { hasVersionHistory } from '#utils/project/rounds-helpers.ts'
import {
  getDeliverableName,
  getDeliverableService,
} from '~/lib/deliverables/deliverable-helpers.ts'

export const DeliverablesReviewPanel = () => {
  const { t } = useTranslation(['generic', 'post-production-review'])

  const {
    project,
    review,
    selectedDeliverable,
    selectedTab,
    services,
    setSelectedTab,
  } = usePostProductionReviewContext()

  const hasNoVersionHistory = !(
    hasVersionHistory(review, selectedDeliverable.deliverableId) ||
    PostProductionCompleteProjectStatuses.includes(project.status)
  )

  const service = getDeliverableService(selectedDeliverable, services)
  const deliverableName = getDeliverableName(
    selectedDeliverable.details,
    service?.name
  )

  return (
    <Surface
      height="full"
      width="full"
      gap="0"
      dataTestId={`review-${review.reviewId}-main-panel-content`}
      dataTrackingId={`review-${review.reviewId}-main-panel-content`}
    >
      <Surface.Header
        className="px-8"
        dataTestId="main-panel-header"
        dataTrackingId="main-panel-header"
      >
        <Tabs
          current={selectedTab}
          onClick={setSelectedTab}
          dataTestId="main-panel-tabs"
          dataTrackingId="main-panel-tabs"
        >
          <Tabs.Tab
            id="main"
            name={deliverableName}
            dataTestId="main-panel-tab-main"
            dataTrackingId="main-panel-tab-main"
          />
          <Tabs.Tab
            id="history"
            name={t('post-production-review:tabs.version-history')}
            disabled={hasNoVersionHistory}
            dataTestId="main-panel-tab-history"
            dataTrackingId="main-panel-tab-history"
          />
        </Tabs>
      </Surface.Header>

      <DeliverablesReviewPanelContent />
    </Surface>
  )
}
