import type {
  DeliverableDomainQueryModel,
  DeliverableId,
  RoundDomainQueryModel,
} from '@mntn-dev/domain-types'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service/client'

import {
  isLeavingFeedback,
  isLeavingProposal,
  isWaitingForProposal,
} from '#utils/project/review-helpers.ts'

/** Can click on deliverable in review screen to see more details (proof) **/
export const canViewPostProdDeliverableDetails = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel,
  project: ProjectWithAcl
) => {
  return (
    project.acl.canAttachFinalAssetToDeliverable || // maker can upload final asset
    (review.status === 'resolved' && !!deliverable.fileId) || // any user can view existing final asset
    isLeavingProposal(review) || // maker can upload proofs
    getViewableFile(review, deliverable.deliverableId) || // anybody can view uploaded current proof
    hasVersionHistory(review, deliverable.deliverableId) // anybody can view previously uploaded proofs
  )
}

export const deliverableChangesRequestedMissingFeedback = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  const proof = getProofByDeliverableId(
    review.currentRound,
    deliverable.deliverableId
  )

  return (
    isLeavingFeedback(review) &&
    proof?.status === 'changes_requested' &&
    !proof?.feedback.notes
  )
}

export const deliverableChangesRequestedReady = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  const proof = getProofByDeliverableId(
    review.currentRound,
    deliverable.deliverableId
  )

  return (
    isLeavingFeedback(review) &&
    proof?.status === 'changes_requested' &&
    !!proof?.feedback.notes
  )
}

export const deliverableHasBeenUploaded = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  return (
    isLeavingProposal(review) &&
    !!getCurrentRoundUpload(review, deliverable.deliverableId)
  )
}

export const deliverableIsApproved = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  const proof = getProofByDeliverableId(
    review.currentRound,
    deliverable.deliverableId
  )

  return isLeavingFeedback(review) && proof?.status === 'approved'
}

export const deliverableNeedsReview = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  return (
    isLeavingFeedback(review) &&
    !!getCurrentRoundUpload(review, deliverable.deliverableId)
  )
}

export const deliverableNeedsUpload = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  return (
    isLeavingProposal(review) &&
    !getCurrentRoundUpload(review, deliverable.deliverableId) &&
    review.requiredDeliverables.includes(deliverable.details.reviewLevel)
  )
}

/** Comment that user is actively working on for current round. **/
export const getActiveComment = (
  review: PostProductionSelectReviewOutput,
  deliverableId: DeliverableId
) => {
  const currentRoundProof = getProofByDeliverableId(
    review.currentRound,
    deliverableId
  )

  if (isLeavingProposal(review)) {
    return currentRoundProof?.proposal.notes || ''
  }

  if (isLeavingFeedback(review)) {
    return currentRoundProof?.feedback.notes || ''
  }

  return ''
}

/** Current round's uploaded proof file **/
export const getCurrentRoundUpload = (
  review: PostProductionSelectReviewOutput,
  deliverableId: DeliverableId
) => {
  return getUploadByRound(review.currentRound, deliverableId)
}

/** Comment to display to user as information (either from proposal notes or brand's feedback) **/
export const getMostRecentComment = (
  review: PostProductionSelectReviewOutput,
  deliverableId: DeliverableId
) => {
  if (review.currentRound.proposal.submitted?.actor) {
    const currentRoundProof = getProofByDeliverableId(
      review.currentRound,
      deliverableId
    )

    return {
      comment: currentRoundProof?.proposal.notes,
      actor: review.currentRound.proposal.submitted.actor,
    }
  }

  if (review.previousRound?.feedback.submitted?.actor) {
    const previousRoundProof = getProofByDeliverableId(
      review.previousRound,
      deliverableId
    )

    return {
      comment: previousRoundProof?.feedback.notes,
      actor: review.previousRound.feedback.submitted.actor,
    }
  }
}

/** Proof for deliverable in provided round **/
export const getProofByDeliverableId = (
  round: PostProductionSelectReviewOutput['rounds'][number],
  deliverableId: DeliverableId
) => {
  return round.proofs.find((proof) => proof.deliverableId === deliverableId)
}

export const getProofStatus = (
  round: PostProductionSelectReviewOutput['rounds'][number],
  deliverableId: DeliverableId
) => {
  const proof = getProofByDeliverableId(round, deliverableId)

  return proof?.status || null
}

export const getUploadByRound = (
  round: PostProductionSelectReviewOutput['rounds'][number],
  deliverableId: DeliverableId
) => {
  return round.uploads[deliverableId]?.file
}

/** Upload (as ViewableFile type) for deliverable in current round **/
export const getViewableFile = (
  review: PostProductionSelectReviewOutput,
  deliverableId: DeliverableId
) => {
  if (isWaitingForProposal(review)) {
    return review.previousRound?.uploads[deliverableId]?.file
  }

  return review.currentRound.uploads[deliverableId]?.file
}

/** Check if deliverable has version history **/
export const hasVersionHistory = (
  review: PostProductionSelectReviewOutput,
  deliverableId: DeliverableId
) => {
  return !!review.previousRound?.uploads[deliverableId]?.fileId
}

export const isCommentRequired = (
  review: PostProductionSelectReviewOutput,
  deliverableId: DeliverableId
) => {
  const currentProof = getProofByDeliverableId(
    review.currentRound,
    deliverableId
  )
  return currentProof?.status === 'changes_requested'
}

/** Check if current round is the final one for brand to request changes **/
export const isFinalFeedbackRound = (
  review: PostProductionSelectReviewOutput
) => {
  return review.currentRoundNumber === review.maxChangeRequests
}

/** Check if brand has no more rounds to request changes **/
export const noMoreFeedbackRounds = (
  review: PostProductionSelectReviewOutput
) => {
  return review.currentRoundNumber > review.maxChangeRequests
}

/** Sort rounds by most recent first (mainly for version history display)  **/
export const sortRoundsMostRecentFirst = (
  rounds: PostProductionSelectReviewOutput['rounds']
) => {
  return rounds.toSorted(
    (a: RoundDomainQueryModel, b: RoundDomainQueryModel) =>
      b.roundNumber - a.roundNumber
  )
}
