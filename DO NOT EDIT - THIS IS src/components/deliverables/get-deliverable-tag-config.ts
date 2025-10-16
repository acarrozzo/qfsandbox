import {
  type DeliverableDomainQueryModel,
  isFileTaggingFailedStatus,
} from '@mntn-dev/domain-types'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service'
import type { IconName, TagType } from '@mntn-dev/ui-components'

import {
  canUploadInitialFinalAssets,
  isProofPreviouslyApproved,
  isWaitingForFeedback,
  isWaitingForProposal,
} from '#utils/project/review-helpers.ts'
import {
  deliverableChangesRequestedMissingFeedback,
  deliverableChangesRequestedReady,
  deliverableHasBeenUploaded,
  deliverableIsApproved,
  deliverableNeedsReview,
  deliverableNeedsUpload,
  getCurrentRoundUpload,
  hasVersionHistory,
  isFinalFeedbackRound,
  noMoreFeedbackRounds,
} from '#utils/project/rounds-helpers.ts'

export type DeliverableTagConfig = {
  type: TagType
  textKey: `post-production-review:tags.${string}`
  textParams?: Record<string, unknown>
  iconName?: IconName
}

type DeliverableTagProps = {
  review?: PostProductionSelectReviewOutput
  project: ProjectWithAcl
  deliverable: DeliverableDomainQueryModel
}

/**
 * todo: add spec file back with new functions / conditions
 */

const brandRequestedChanges = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return (
    !!review &&
    isWaitingForProposal(review) &&
    hasVersionHistory(review, deliverable.deliverableId)
  )
}

const deliverableHasBeenSentForReview = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return (
    !!review &&
    isWaitingForFeedback(review) &&
    !!getCurrentRoundUpload(review, deliverable.deliverableId)
  )
}

const deliverableIsPending = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return (
    !!review &&
    isWaitingForProposal(review) &&
    review.currentRoundNumber === 1 &&
    (deliverable.details.reviewLevel === 'primary' ||
      isFinalFeedbackRound(review) ||
      noMoreFeedbackRounds(review))
  )
}

const deliverableIsUploaded = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return !!review && deliverableHasBeenUploaded(review, deliverable)
}

const deliverableMissingUpload = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return !!review && deliverableNeedsUpload(review, deliverable)
}

const deliverableNeedsToBeReviewed = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return !!review && deliverableNeedsReview(review, deliverable)
}

const deliverableWasPreviouslyApproved = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return (
    !!review && isProofPreviouslyApproved(review, deliverable.deliverableId)
  )
}

const doesNotNeedReview = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return !!review && deliverable.details.reviewLevel === 'none'
}

const finalAssetHasProcessingError = (props: DeliverableTagProps) => {
  const { deliverable, project, review } = props
  return (
    !project.acl.canAttachFinalAssetToDeliverable &&
    review?.status === 'resolved' &&
    isFileTaggingFailedStatus(deliverable.file?.taggingStatus)
  )
}

const finalAssetIsCompleted = (props: DeliverableTagProps) => {
  const { deliverable, project, review } = props
  return (
    !!review &&
    review.status === 'resolved' &&
    project.status !== 'post_production_complete' &&
    !!deliverable.fileId
  )
}

const finalAssetIsUploaded = (props: DeliverableTagProps) => {
  const { deliverable, project, review } = props
  return (
    !!review &&
    review.status === 'resolved' &&
    canUploadInitialFinalAssets(project, review) &&
    !!deliverable.fileId
  )
}

const finalAssetNeedsReupload = (props: DeliverableTagProps) => {
  const { deliverable, project, review } = props
  return (
    !!project.acl.canAttachFinalAssetToDeliverable &&
    review?.status === 'resolved' &&
    isFileTaggingFailedStatus(deliverable.file?.taggingStatus)
  )
}

const finalAssetNeedsUploading = (props: DeliverableTagProps) => {
  const { deliverable, project, review } = props
  return (
    !!review &&
    review.status === 'resolved' &&
    !!project.acl.canAttachFinalAssetToDeliverable &&
    !deliverable.fileId
  )
}

const missingFeedback = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return (
    !!review && deliverableChangesRequestedMissingFeedback(review, deliverable)
  )
}

const readyToSubmitApproval = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return !!review && deliverableIsApproved(review, deliverable)
}

const readyToSubmitChanges = (props: DeliverableTagProps) => {
  const { review, deliverable } = props
  return !!review && deliverableChangesRequestedReady(review, deliverable)
}

const reviewResolved = (props: DeliverableTagProps) => {
  const { review } = props
  return review?.status === 'resolved'
}

const reviewResolvedWithProcessingTaggingStatus = (
  props: DeliverableTagProps
) => {
  const { review, deliverable } = props
  return (
    review?.status === 'resolved' &&
    deliverable.file?.taggingStatus === 'processing'
  )
}

export const getDeliverableTagConfig = (
  props: DeliverableTagProps
): DeliverableTagConfig => {
  const { deliverable } = props

  type ConfigMap = [
    condition: (props: DeliverableTagProps) => boolean,
    config: DeliverableTagConfig,
  ]

  const conditions: ConfigMap[] = [
    [
      finalAssetNeedsReupload,
      {
        type: 'error',
        textKey: 'post-production-review:tags.re-upload-file',
      },
    ],
    [
      finalAssetHasProcessingError,
      {
        type: 'notice',
        textKey: 'post-production-review:tags.error-pending-reupload',
      },
    ],
    [
      reviewResolvedWithProcessingTaggingStatus,
      {
        type: 'notice',
        textKey: 'post-production-review:tags.processing',
      },
    ],
    [
      finalAssetIsUploaded,
      {
        type: 'success',
        textKey: 'post-production-review:tags.uploaded',
        iconName: 'check',
      },
    ],
    [
      finalAssetIsCompleted,
      {
        type: 'success',
        textKey: 'post-production-review:tags.completed',
        iconName: 'check',
      },
    ],
    [
      finalAssetNeedsUploading,
      {
        type: 'error',
        textKey: 'post-production-review:tags.upload-final',
      },
    ],
    [
      doesNotNeedReview,
      {
        type: 'default',
        textKey: 'post-production-review:tags.no-action-needed',
      },
    ],
    [
      reviewResolved,
      {
        type: 'success',
        textKey: 'post-production-review:tags.approved',
      },
    ],
    [
      deliverableWasPreviouslyApproved,
      {
        type: 'success',
        textKey: 'post-production-review:tags.approved',
      },
    ],
    [
      deliverableIsUploaded,
      {
        type: 'success',
        textKey: 'post-production-review:tags.ready-to-submit',
      },
    ],
    [
      deliverableMissingUpload,
      {
        type: 'error',
        textKey: 'post-production-review:tags.upload-type',
        textParams: {
          type: `post-production-review:category.${deliverable.details.category}`,
        },
      },
    ],
    [
      readyToSubmitApproval,
      {
        type: 'success',
        textKey: 'post-production-review:tags.ready-to-submit-approval',
      },
    ],
    [
      readyToSubmitChanges,
      {
        type: 'notice',
        textKey: 'post-production-review:tags.ready-to-submit-changes',
      },
    ],
    [
      missingFeedback,
      {
        type: 'error',
        textKey:
          'post-production-review:tags.changes-requested-feedback-required',
      },
    ],
    [
      deliverableNeedsToBeReviewed,
      {
        type: 'error',
        textKey: 'post-production-review:tags.ready-for-review',
      },
    ],
    [
      deliverableIsPending,
      {
        type: 'notice',
        textKey: 'post-production-review:tags.pending',
      },
    ],
    [
      brandRequestedChanges,
      {
        type: 'notice',
        textKey: 'post-production-review:tags.changes-sent',
      },
    ],
    [
      deliverableHasBeenSentForReview,
      {
        type: 'notice',
        textKey: 'post-production-review:tags.sent-for-review',
      },
    ],
  ]

  const defaultConfig: DeliverableTagConfig = {
    type: 'default',
    textKey: 'post-production-review:tags.not-started',
  }

  const foundConfigMap = conditions.find(([condition]) => condition(props))

  return foundConfigMap ? foundConfigMap[1] : defaultConfig
}
