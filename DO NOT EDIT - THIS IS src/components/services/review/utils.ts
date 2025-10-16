'use client'

import type { TFunction } from 'i18next'

import {
  BrandFeedbackFormModelSchema,
  MakerProposalUpdateFormModelSchema,
} from '@mntn-dev/app-form-schemas'
import {
  BrandReviewStatuses,
  MakerConceptingStatuses,
  type ProjectServiceDomainQueryModel,
  type ProjectStatus,
  type RoundDomainQueryModel,
} from '@mntn-dev/domain-types'
import type { PreProductionSelectReviewOutput } from '@mntn-dev/review-service'
import { isDefined } from '@mntn-dev/utilities'

import type { EditingPhase } from './types.ts'

export const getServiceSecondaryTitle = ({
  t,
  projectStatus,
  totalRounds,
  review,
}: {
  t: TFunction<'edit-service'>
  projectStatus: ProjectStatus
  totalRounds: number
  review: PreProductionSelectReviewOutput
}) => {
  if (projectStatus === 'pre_production') {
    const { currentRoundNumber } = review

    if (currentRoundNumber > totalRounds || review.status === 'resolved') {
      if (review.acl.canUpdateProposal) {
        return t('final-edit', { ns: 'edit-service' })
      }

      return t('final', { ns: 'edit-service' })
    }

    return t('round-x-of-y', {
      ns: 'edit-service',
      count: currentRoundNumber,
      total: totalRounds,
    })
  }
}

export const getProposalSectionHeader = (
  t: TFunction<'edit-service'>,
  round: RoundDomainQueryModel,
  service: ProjectServiceDomainQueryModel,
  review: PreProductionSelectReviewOutput
) => {
  const isFinalConcept =
    review.status === 'resolved' &&
    round.roundNumber === review.currentRoundNumber

  const versionText = isFinalConcept
    ? t('final')
    : t('versionX', {
        version: round.roundNumber,
      })

  return `${service.name} ${versionText}`
}

export const getPhase = (
  review: PreProductionSelectReviewOutput
): EditingPhase => {
  return MakerConceptingStatuses.includes(review.status)
    ? 'maker-proposal'
    : 'brand-feedback'
}

export const getNoteDataTestIdPrefix = (readonly: boolean) =>
  `review-note-${readonly ? 'display' : 'edit'}`

export const isMakerUpdate = (review: PreProductionSelectReviewOutput) =>
  review.acl.canUpdateProposal && review.currentRoundNumber > 0

export const isReadyForReview = (review: PreProductionSelectReviewOutput) => {
  return (
    review.acl.canApproveChanges && BrandReviewStatuses.includes(review.status)
  )
}

export const getPreviousNoteForPhase = (
  t: TFunction<'edit-service'>,
  phase: EditingPhase,
  service: ProjectServiceDomainQueryModel,
  review: PreProductionSelectReviewOutput
) => {
  switch (phase) {
    case 'brand-feedback':
      return (
        review.currentRound.proposal.notes ||
        t('no-brand-note', { ns: 'edit-service' })
      )
    case 'maker-proposal':
      return (
        (isDefined(review.previousRound)
          ? review.previousRound?.feedback.notes
          : service.brandNote) || t('no-brand-note', { ns: 'edit-service' })
      )

    default:
      return t('no-brand-note', { ns: 'edit-service' })
  }
}

export const getNoteForPhase = (
  phase: EditingPhase,
  review: PreProductionSelectReviewOutput
) => {
  switch (phase) {
    case 'brand-feedback':
      return review.currentRound.feedback.notes || ''

    case 'maker-proposal':
      return review.currentRound.proposal.notes || ''

    default:
      return ''
  }
}

export const getNoteUpdateSchemaForPhase = (
  phase: EditingPhase,
  t: TFunction<'validation'>
) => {
  switch (phase) {
    case 'brand-feedback':
      return BrandFeedbackFormModelSchema(t)
    case 'maker-proposal':
      return MakerProposalUpdateFormModelSchema(t)
    default:
      throw new Error('Invalid phase')
  }
}
