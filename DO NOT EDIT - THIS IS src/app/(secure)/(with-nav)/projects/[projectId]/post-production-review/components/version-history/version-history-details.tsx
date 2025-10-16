import type { ReviewId } from '@mntn-dev/domain-types'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service/client'
import { Stack } from '@mntn-dev/ui-components'
import { themeDivideColorMap } from '@mntn-dev/ui-theme'

import { VersionHistoryBrand } from '#projects/[projectId]/post-production-review/components/version-history/version-history-brand.tsx'
import { VersionHistoryMaker } from '#projects/[projectId]/post-production-review/components/version-history/version-history-maker.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'

export const VersionHistoryDetails = ({
  round,
}: {
  round: PostProductionSelectReviewOutput['rounds'][number]
}) => {
  const { review } = usePostProductionReviewContext()

  const getTestDataIds = (reviewId: ReviewId, roundNumber: number) => {
    return {
      dataTestId: `review-${reviewId}-round-${roundNumber}-details`,
      dataTrackingId: `review-${reviewId}-round-${roundNumber}-details`,
    }
  }

  return (
    <Stack
      direction="col"
      width="full"
      className={`divide-y ${themeDivideColorMap.muted}`}
      {...getTestDataIds(review.reviewId, round.roundNumber)}
    >
      <VersionHistoryBrand round={round} />
      <VersionHistoryMaker round={round} />
    </Stack>
  )
}
