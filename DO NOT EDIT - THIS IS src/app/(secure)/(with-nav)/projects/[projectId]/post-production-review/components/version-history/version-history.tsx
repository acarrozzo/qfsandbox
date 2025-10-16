import { Stack } from '@mntn-dev/ui-components'
import { themeDivideColorMap } from '@mntn-dev/ui-theme'

import { VersionHistoryDetails } from '#projects/[projectId]/post-production-review/components/version-history/version-history-details.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { sortRoundsMostRecentFirst } from '#utils/project/rounds-helpers.ts'

export const VersionHistory = () => {
  const { review } = usePostProductionReviewContext()
  const sortedRounds = sortRoundsMostRecentFirst(review.rounds)
  return (
    <Stack
      direction="col"
      justifyContent="start"
      alignItems="start"
      height="full"
      width="full"
      marginBottom="4"
      className={`whitespace-pre-line divide-y ${themeDivideColorMap.muted}`}
      dataTestId={`review-${review.reviewId}-version-history-container`}
      dataTrackingId={`review-${review.reviewId}-version-history-container`}
    >
      {sortedRounds.map((round) => {
        return (
          round.status !== 'in_progress' && (
            <VersionHistoryDetails
              key={`round-${round.roundNumber}`}
              round={round}
            />
          )
        )
      })}
    </Stack>
  )
}
