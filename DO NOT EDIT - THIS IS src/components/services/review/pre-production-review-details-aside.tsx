'use client'

import { Surface } from '@mntn-dev/ui-components'

import { AsideTabActivity } from '#components/services/review/aside-tabs/aside-tab-activity.tsx'
import { AsideTabFiles } from '#components/services/review/aside-tabs/aside-tab-files.tsx'
import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'

import { PreProductionReviewDetailsAsideHeader } from './pre-production-review-details-aside-header.tsx'

const PreProductionReviewDetailsAside = () => {
  const { currentAsideTab } = usePreProductionReviewContext()
  return (
    <Surface className="p-0 gap-0 w-full h-full overflow-hidden">
      <Surface.Header className="flex flex-col px-8 pt-4">
        <PreProductionReviewDetailsAsideHeader />
      </Surface.Header>
      <Surface.Body className="size-full overflow-auto break-all">
        {currentAsideTab === 'files' ? <AsideTabFiles /> : <AsideTabActivity />}
      </Surface.Body>
    </Surface>
  )
}

export { PreProductionReviewDetailsAside }
