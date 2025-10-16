import { MakerConceptingStatuses } from '@mntn-dev/domain-types'

import { RoundCurrentComment } from '#projects/[projectId]/post-production-review/components/rounds/round-current-comment.tsx'
import { RoundPreviousComment } from '#projects/[projectId]/post-production-review/components/rounds/round-previous-comment.tsx'
import { RoundViewer } from '#projects/[projectId]/post-production-review/components/rounds/round-viewer.tsx'
import { RoundWaitingForProposal } from '#projects/[projectId]/post-production-review/components/rounds/round-waiting-for-proposal.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { isLeavingFeedback } from '#utils/project/review-helpers.ts'
import {
  getMostRecentComment,
  getViewableFile,
} from '#utils/project/rounds-helpers.ts'

export const DeliverablesReviewRoundBrand = () => {
  const { review, selectedDeliverable } = usePostProductionReviewContext()

  const displayableComment = getMostRecentComment(
    review,
    selectedDeliverable.deliverableId
  )
  const upload = getViewableFile(review, selectedDeliverable.deliverableId)

  return (
    <>
      {review.currentRoundNumber === 1 &&
        MakerConceptingStatuses.includes(review.status) && (
          <RoundWaitingForProposal />
        )}

      {upload && <RoundViewer upload={upload} />}

      {!!displayableComment?.comment && (
        <RoundPreviousComment
          comment={displayableComment.comment}
          actor={displayableComment.actor}
        />
      )}

      {isLeavingFeedback(review) && (
        <RoundCurrentComment key={selectedDeliverable.deliverableId} />
      )}
    </>
  )
}
