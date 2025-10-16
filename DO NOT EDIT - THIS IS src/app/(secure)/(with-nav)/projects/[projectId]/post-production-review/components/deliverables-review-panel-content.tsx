import { DeliverablesFinalAssetsContent } from '#projects/[projectId]/post-production-review/components/final-assets/deliverables-final-assets-content.tsx'
import { DeliverablesReviewRoundBrand } from '#projects/[projectId]/post-production-review/components/rounds/deliverables-review-round-brand.tsx'
import { DeliverablesReviewRoundMaker } from '#projects/[projectId]/post-production-review/components/rounds/deliverables-review-round-maker.tsx'
import { VersionHistory } from '#projects/[projectId]/post-production-review/components/version-history/version-history.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import {
  canUploadInitialFinalAssets,
  isLeavingFeedback,
  isLeavingProposal,
  isWaitingForFeedback,
  isWaitingForProposal,
} from '#utils/project/review-helpers.ts'

export const DeliverablesReviewPanelContent = () => {
  const { project, review, selectedTab } = usePostProductionReviewContext()

  switch (selectedTab) {
    case 'main': {
      if (
        ['processing_final_files', 'complete'].includes(project.status) ||
        canUploadInitialFinalAssets(project, review)
      ) {
        return <DeliverablesFinalAssetsContent />
      }

      if (isLeavingProposal(review) || isWaitingForFeedback(review)) {
        return <DeliverablesReviewRoundMaker />
      }

      if (
        isLeavingFeedback(review) ||
        isWaitingForProposal(review) ||
        review.status === 'resolved'
      ) {
        return <DeliverablesReviewRoundBrand />
      }

      return null
    }
    case 'history':
      return <VersionHistory />
    default:
      return null
  }
}
