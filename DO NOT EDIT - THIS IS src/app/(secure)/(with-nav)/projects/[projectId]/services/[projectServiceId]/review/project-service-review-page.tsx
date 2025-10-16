'use client'

import type { PreProductionSelectReviewOutput } from '@mntn-dev/review-service'
import { SidebarLayoutContent } from '@mntn-dev/ui-components'

import { PreProductionReviewDetails } from '#components/services/review/pre-production-review-details.tsx'
import type { ComponentProps } from '~/types/props.ts'

type ProjectServicePageProps = ComponentProps<{
  initialReview: PreProductionSelectReviewOutput
}>

export const ProjectServiceReviewPage = ({
  initialReview,
}: ProjectServicePageProps) => {
  return (
    <SidebarLayoutContent>
      <PreProductionReviewDetails initialReview={initialReview} />
    </SidebarLayoutContent>
  )
}
