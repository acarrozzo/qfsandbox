import type { TFunction } from 'i18next'

import {
  BrandFeedbackPostProdFormModelSchema,
  MakerProposalPostProdUpdateFormModelSchema,
} from '@mntn-dev/app-form-schemas'
import {
  BrandReviewStatuses,
  type DeliverableDomainQueryModel,
  type DeliverableId,
  type DeliverableReviewLevel,
  MakerConceptingStatuses,
  MeaningfulNoteSchema,
  type Note,
  type ProjectServiceDomainQueryModel,
  type ProjectStatus,
  type ServiceWithDeliverables,
} from '@mntn-dev/domain-types'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type {
  PostProductionSelectReviewOutput,
  PreProductionSelectReviewOutput,
} from '@mntn-dev/review-service/client'
import { groupBy, isDefined } from '@mntn-dev/utilities'

import {
  deliverableChangesRequestedReady,
  deliverableHasBeenUploaded,
  deliverableIsApproved,
  getCurrentRoundUpload,
  hasVersionHistory,
  isFinalFeedbackRound,
  noMoreFeedbackRounds,
} from '#utils/project/rounds-helpers.ts'
import { sortDeliverablesByGroup } from '~/lib/deliverables/deliverable-helpers.ts'

export const areAllFinalAssetsUploaded = (
  deliverables: DeliverableDomainQueryModel[]
) => {
  return deliverables.every((deliverable) => !!deliverable.fileId)
}

/** Can user access review screen **/
export const canAccessReview = (
  projectStatus: ProjectStatus,
  reviewLevel: DeliverableReviewLevel
) => {
  return reviewLevel !== 'none' || canAccessFinalAssetScreen(projectStatus)
}

export const canAccessFinalAssetScreen = (projectStatus: ProjectStatus) => {
  return [
    'post_production_complete',
    'processing_final_files',
    'complete',
  ].includes(projectStatus)
}

export const canUploadInitialFinalAssets = (
  project: ProjectWithAcl,
  review: PostProductionSelectReviewOutput
) => {
  return (
    review.status === 'resolved' &&
    project.status === 'post_production_complete' &&
    !!project.acl.canAttachFinalAssetToDeliverable
  )
}

/** Get text for review header breadcrumb **/
export const getBreadCrumbText = (
  t: TFunction<['generic', 'post-production-review']>,
  review: PostProductionSelectReviewOutput,
  projectStatus: ProjectStatus
) => {
  if (projectStatus === 'post_production_complete') {
    return t('post-production-review:final-upload')
  }

  if (['complete', 'processing_final_files'].includes(projectStatus)) {
    return t('post-production-review:final-files')
  }

  if (noMoreFeedbackRounds(review)) {
    return MakerConceptingStatuses.includes(review.status)
      ? t('post-production-review:final-edit')
      : t('post-production-review:final-approval')
  }

  if (
    isFinalFeedbackRound(review) &&
    !MakerConceptingStatuses.includes(review.status)
  ) {
    return t('post-production-review:final-review')
  }

  return t('post-production-review:round-x-of-y', {
    round: review.currentRoundNumber,
    total: review.maxChangeRequests,
  })
}

export const getFormSchema = (
  review: PostProductionSelectReviewOutput,
  t: TFunction<'validation'>
) => {
  if (isLeavingProposal(review)) {
    return MakerProposalPostProdUpdateFormModelSchema
  }
  return BrandFeedbackPostProdFormModelSchema(t)
}

export const getPostProductionProjectBanner = (
  review: PostProductionSelectReviewOutput,
  project: ProjectWithAcl,
  deliverables: DeliverableDomainQueryModel[],
  t: TFunction<['projects']>
) => {
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

  if (isLeavingFeedback(review)) {
    return {
      button: t('projects:banners.open-deliverables'),
      header:
        totalRequired === totalCompletedCount
          ? t('projects:banners.submit-your-review')
          : t('projects:banners.reviews-done', {
              count: totalCompletedCount,
              total: totalRequired,
            }),
      subTitle:
        totalRequired === totalCompletedCount
          ? t('projects:banners.review-subtitle')
          : '',
    }
  }

  return {
    button: t('projects:banners.upload-deliverables'),
    header: t('projects:banners.uploads-ready', {
      count: totalCompletedCount,
      total: totalRequired,
    }),
    subTitle:
      totalRequired === totalCompletedCount
        ? t('projects:banners.upload-subtitle')
        : '',
  }
}

export const getSubHeadingText = (
  review: PostProductionSelectReviewOutput,
  project: ProjectWithAcl,
  t: TFunction<['generic', 'post-production-review', 'toast']>
) => {
  if (isLeavingProposal(review)) {
    return t('post-production-review:subheading.upload-deliverables')
  }
  if (isLeavingFeedback(review)) {
    return noMoreFeedbackRounds(review)
      ? t('post-production-review:subheading.brand-final-feedback')
      : t('post-production-review:subheading.brand-feedback')
  }
  if (isWaitingForProposal(review)) {
    return review.currentRoundNumber === 1
      ? t('post-production-review:subheading.waiting-for-maker-files')
      : t('post-production-review:subheading.waiting-for-maker-changes')
  }
  if (isWaitingForFeedback(review)) {
    return t('post-production-review:subheading.waiting-for-brand')
  }

  if (
    review.status === 'resolved' &&
    canUploadInitialFinalAssets(project, review)
  ) {
    return t('post-production-review:subheading.final-assets')
  }
}

/** Group deliverables based on either status (approved, not ready, etc.) or type (video, file)**/
export const getGroupedDeliverables = (
  review: PostProductionSelectReviewOutput,
  services: ServiceWithDeliverables<ProjectServiceWithAcl>[],
  deliverables: DeliverableDomainQueryModel[],
  t: TFunction<['post-production-review']>
) => {
  const { videos, files } = sortDeliverablesByGroup(
    deliverables,
    services,
    review.project.status !== 'post_production'
  )

  const allDeliverables = [...videos, ...files]

  if (isLeavingProposal(review)) {
    const groupedDeliverables = groupBy(allDeliverables, (deliverable) => {
      if (isProofPreviouslyApproved(review, deliverable.deliverableId)) {
        return 'previouslyApproved'
      }

      if (isRequiredProofMissing(review, deliverable)) {
        return 'requiredUploads'
      }
      return 'optionalUploads'
    })

    return [
      {
        title: `${t('post-production-review:collapsible-header.approved')} (${groupedDeliverables.previouslyApproved?.length || 0})`,
        deliverables: groupedDeliverables.previouslyApproved || [],
        open: false,
      },
      {
        title: `${t('post-production-review:collapsible-header.upload-required')} (${groupedDeliverables.requiredUploads?.length || 0})`,
        deliverables: groupedDeliverables.requiredUploads || [],
        open: true,
      },
      {
        title: `${t('post-production-review:collapsible-header.upload-optional')} (${groupedDeliverables.optionalUploads?.length || 0})`,
        deliverables: groupedDeliverables.optionalUploads || [],
        open: false,
      },
    ]
  }

  if (isLeavingFeedback(review)) {
    const groupedDeliverables = groupBy(allDeliverables, (deliverable) => {
      if (isProofPreviouslyApproved(review, deliverable.deliverableId)) {
        return 'previouslyApproved'
      }
      if (isReviewRequired(review, deliverable)) {
        return 'reviewRequired'
      }
      return 'noReviewRequired'
    })

    return [
      {
        title: `${t('post-production-review:collapsible-header.approved')} (${groupedDeliverables.previouslyApproved?.length || 0})`,
        deliverables: groupedDeliverables.previouslyApproved || [],
        open: false,
      },
      {
        title: `${t('post-production-review:collapsible-header.ready-for-review')} (${groupedDeliverables.reviewRequired?.length || 0})`,
        deliverables: groupedDeliverables.reviewRequired || [],
        open: true,
      },
      {
        title: `${t('post-production-review:collapsible-header.not-ready-for-review')} (${groupedDeliverables.noReviewRequired?.length || 0})`,
        deliverables: groupedDeliverables.noReviewRequired || [],
        open: false,
      },
    ]
  }

  return [
    {
      title: `${t('post-production-review:collapsible-header.videos')} (${videos.length})`,
      deliverables: videos,
      open: true,
    },
    {
      title: `${t('post-production-review:collapsible-header.files')} (${files.length})`,
      deliverables: files,
      open: true,
    },
  ]
}

const getMeaningfulNoteLength = () => MeaningfulNoteSchema.minLength ?? 100

export const getTotalDeliverablesNeedingAction = (
  review: PostProductionSelectReviewOutput,
  project: ProjectWithAcl,
  deliverables: DeliverableDomainQueryModel[]
) => {
  if (isLeavingProposal(review)) {
    return deliverables
      .filter(
        (deliverable) =>
          isProofRequired(review, deliverable.details.reviewLevel) &&
          !isProofPreviouslyApproved(review, deliverable.deliverableId)
      )
      .filter((deliverable) => isUploadMissing(review, deliverable)).length
  }

  if (isLeavingFeedback(review)) {
    return deliverables.filter((deliverable) =>
      isReviewMissing(review, deliverable)
    ).length
  }

  if (canUploadInitialFinalAssets(project, review)) {
    return deliverables.filter((deliverable) => !deliverable.file).length
  }

  return 0
}

export const getTotalExtraUploads = (
  review: PostProductionSelectReviewOutput,
  deliverables: DeliverableDomainQueryModel[]
) => {
  if (isLeavingProposal(review)) {
    return deliverables
      .filter(
        (deliverable) =>
          !(
            review.requiredDeliverables.includes(
              deliverable.details.reviewLevel
            ) || isProofPreviouslyApproved(review, deliverable.deliverableId)
          )
      )
      .filter((deliverable) => deliverableHasBeenUploaded(review, deliverable))
      .length
  }

  return 0
}

export const getTotalRequiredDeliverables = (
  review: PostProductionSelectReviewOutput,
  project: ProjectWithAcl,
  deliverables: DeliverableDomainQueryModel[]
) => {
  if (isLeavingProposal(review)) {
    return deliverables.filter(
      (deliverable) =>
        isProofRequired(review, deliverable.details.reviewLevel) &&
        !isProofPreviouslyApproved(review, deliverable.deliverableId)
    ).length
  }

  if (isLeavingFeedback(review)) {
    return deliverables.filter((deliverable) =>
      isReviewRequired(review, deliverable)
    ).length
  }

  if (canUploadInitialFinalAssets(project, review)) {
    return deliverables.length
  }

  return 0
}

export const isCommentOfMeaningfulLength = (comment: Note) =>
  comment.length >= getMeaningfulNoteLength()

/** Brand is logged in and actively leaving feedback **/
export const isLeavingFeedback = (review: PostProductionSelectReviewOutput) => {
  return review.acl.canUpdateFeedback
}

/** Maker is logged in and actively leaving proposal **/
export const isLeavingProposal = (review: PostProductionSelectReviewOutput) => {
  return review.acl.canUpdateProposal
}

export const isProofPreviouslyApproved = (
  review: PostProductionSelectReviewOutput,
  deliverableId: DeliverableId
) => {
  return (
    review.previousRound?.uploads[deliverableId]?.status === 'approved' &&
    review.currentRound?.uploads[deliverableId]?.fileId ===
      review.previousRound?.uploads[deliverableId]?.fileId
  )
}

export const isProofRequired = (
  review: PostProductionSelectReviewOutput,
  reviewLevel: DeliverableReviewLevel
) => {
  return (
    review.project.status === 'post_production' &&
    review.requiredDeliverables.includes(reviewLevel)
  )
}

export const isRequiredProofMissing = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  return (
    (hasVersionHistory(review, deliverable.deliverableId) ||
      isProofRequired(review, deliverable.details.reviewLevel)) &&
    !isProofPreviouslyApproved(review, deliverable.deliverableId) &&
    isLeavingProposal(review)
  )
}

export const isReviewRequired = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  return (
    !isProofPreviouslyApproved(review, deliverable.deliverableId) &&
    getCurrentRoundUpload(review, deliverable.deliverableId) &&
    isLeavingFeedback(review)
  )
}

export const isReviewMissing = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  return (
    isReviewRequired(review, deliverable) &&
    !(
      deliverableChangesRequestedReady(review, deliverable) ||
      deliverableIsApproved(review, deliverable)
    )
  )
}

export const isUploadMissing = (
  review: PostProductionSelectReviewOutput,
  deliverable: DeliverableDomainQueryModel
) => {
  return (
    isLeavingProposal(review) &&
    !isProofPreviouslyApproved(review, deliverable.deliverableId) &&
    !getCurrentRoundUpload(review, deliverable.deliverableId)
  )
}

/** Logged-in user is NOT Brand, but the review is waiting on Brand's feedback **/
export const isWaitingForFeedback = (
  review: PostProductionSelectReviewOutput
) => {
  return (
    BrandReviewStatuses.includes(review.status) && !isLeavingFeedback(review)
  )
}

/** Logged-in user is NOT Maker, but the review is waiting on Maker's proposal **/
export const isWaitingForProposal = (
  review: PostProductionSelectReviewOutput
) => {
  return (
    MakerConceptingStatuses.includes(review.status) &&
    !isLeavingProposal(review)
  )
}

export const getTotalNoteCount = ({
  review,
  service,
}: {
  review?: PreProductionSelectReviewOutput
  service?: ProjectServiceDomainQueryModel
}) => {
  const hasBrandNote =
    isDefined(review?.service.brandNote) || isDefined(service?.brandNote)
  const roundComments =
    review?.rounds?.reduce((total, round) => {
      const proposalNote = round.proposal.notes ? 1 : 0
      const feedbackNote = round.feedback.notes ? 1 : 0
      return total + proposalNote + feedbackNote
    }, 0) ?? 0

  return (hasBrandNote ? 1 : 0) + roundComments
}
