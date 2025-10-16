import { useMemo } from 'react'

import { RoundCurrentComment } from '#projects/[projectId]/post-production-review/components/rounds/round-current-comment.tsx'
import { RoundPreviousComment } from '#projects/[projectId]/post-production-review/components/rounds/round-previous-comment.tsx'
import { RoundUpload } from '#projects/[projectId]/post-production-review/components/rounds/round-upload.tsx'
import { RoundUploaded } from '#projects/[projectId]/post-production-review/components/rounds/round-uploaded.tsx'
import { RoundViewer } from '#projects/[projectId]/post-production-review/components/rounds/round-viewer.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import {
  isLeavingProposal,
  isWaitingForFeedback,
} from '#utils/project/review-helpers.ts'
import {
  getMostRecentComment,
  getViewableFile,
} from '#utils/project/rounds-helpers.ts'

export const DeliverablesReviewRoundMaker = () => {
  const { review, selectedDeliverable } = usePostProductionReviewContext()

  const displayableComment = useMemo(
    () => getMostRecentComment(review, selectedDeliverable.deliverableId),
    [review, selectedDeliverable.deliverableId]
  )

  const upload = useMemo(
    () => getViewableFile(review, selectedDeliverable.deliverableId),
    [review, selectedDeliverable.deliverableId]
  )

  return (
    <>
      {isLeavingProposal(review) && !!displayableComment?.comment && (
        <RoundPreviousComment
          comment={displayableComment.comment}
          actor={displayableComment.actor}
        />
      )}

      {upload && <RoundViewer upload={upload} />}

      {isWaitingForFeedback(review) && !!displayableComment?.comment && (
        <RoundPreviousComment
          comment={displayableComment.comment}
          actor={displayableComment.actor}
        />
      )}

      {isLeavingProposal(review) && (
        <>
          {upload ? <RoundUploaded /> : <RoundUpload />}
          <RoundCurrentComment key={selectedDeliverable.deliverableId} />
        </>
      )}
    </>
  )
}
