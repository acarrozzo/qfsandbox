'use client'

import { useTranslation } from '@mntn-dev/i18n'
import { Surface, Tabs } from '@mntn-dev/ui-components'

import { MainTabDetails } from '#components/services/review/main-tabs/main-tab-details.tsx'
import { MainTabHistory } from '#components/services/review/main-tabs/main-tab-history.tsx'
import {
  type MainTab,
  usePreProductionReviewContext,
} from '#components/services/review/use-pre-production-review.ts'

const PreProductionReviewDetailsMain = () => {
  const {
    currentMainTab,
    projectServiceId,
    setCurrentMainTab,
    review: { currentRoundNumber },
  } = usePreProductionReviewContext()

  const { t } = useTranslation('edit-service')

  return (
    <Surface className="w-full p-0 gap-0 h-full overflow-hidden">
      <Surface.Header className="flex flex-col px-8 pt-4 pb-0">
        <Tabs<MainTab>
          current={currentMainTab}
          onClick={(id) => setCurrentMainTab(id)}
          dataTestId={`service-review-tabs-${projectServiceId}`}
          dataTrackingId={`service-review-tabs-${projectServiceId}`}
        >
          <Tabs.Tab
            key="details"
            id="details"
            name={t('details', { ns: 'edit-service' })}
            dataTestId={`service-review-tab-details-${projectServiceId}`}
            dataTrackingId={`service-review-tab-details-${projectServiceId}`}
          />
          <Tabs.Tab
            key="history"
            id="history"
            disabled={currentRoundNumber === 1}
            name={t('history', { ns: 'edit-service' })}
            dataTestId={`service-review-tab-history-${projectServiceId}`}
            dataTrackingId={`service-review-tab-history-${projectServiceId}`}
          />
        </Tabs>
      </Surface.Header>

      {currentMainTab === 'details' ? <MainTabDetails /> : <MainTabHistory />}
    </Surface>
  )
}

export { PreProductionReviewDetailsMain }
