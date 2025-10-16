import { Icon, Stack, Text } from '@mntn-dev/ui-components'

import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import {
  getTotalDeliverablesNeedingAction,
  getTotalExtraUploads,
  getTotalRequiredDeliverables,
  isLeavingFeedback,
  isLeavingProposal,
} from '#utils/project/review-helpers.ts'

export const ReviewActionCounter = () => {
  const { deliverables, project, review, t } = usePostProductionReviewContext()
  const isMakerActive =
    isLeavingProposal(review) || project.acl.canAttachFinalAssetToDeliverable
  const isBrandActive = isLeavingFeedback(review)

  if (!(isMakerActive || isBrandActive)) {
    return
  }

  const totalRequired = getTotalRequiredDeliverables(
    review,
    project,
    deliverables
  )

  const totalNeedingAction = getTotalDeliverablesNeedingAction(
    review,
    project,
    deliverables
  )
  const totalCompletedCount = totalRequired - totalNeedingAction

  const additionalUploadedCount = getTotalExtraUploads(review, deliverables)

  const text = isMakerActive
    ? 'post-production-review:x/y-uploaded'
    : 'post-production-review:x/y-reviewed'

  return (
    <Stack
      gap="4"
      justifyContent="end"
      dataTestId={`review-${review.reviewId}-action-counter`}
      dataTrackingId={`review-${review.reviewId}-action-counter`}
    >
      <Stack gap="1" alignItems="center">
        {totalRequired === totalCompletedCount && (
          <Icon name="check" size="sm" color="brand" />
        )}
        <Text
          textColor={
            totalRequired === totalCompletedCount ? 'brand' : 'tertiary'
          }
        >
          {t(text, {
            count: totalCompletedCount,
            total: totalRequired,
          })}
        </Text>
      </Stack>
      {additionalUploadedCount > 0 && (
        <Stack gap="1" alignItems="center">
          <Icon name="check" size="sm" color="tertiary" />
          <Text textColor="tertiary">
            {t('post-production-review:additional-uploads', {
              count: additionalUploadedCount,
            })}
          </Text>
        </Stack>
      )}
    </Stack>
  )
}
