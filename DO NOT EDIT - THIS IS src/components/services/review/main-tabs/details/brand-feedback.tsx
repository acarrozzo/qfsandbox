'use client'

import { useMemo } from 'react'

import { useTranslation } from '@mntn-dev/i18n'
import { Button } from '@mntn-dev/ui-components'
import { isEmpty } from '@mntn-dev/utilities'

import { ButtonContainer } from '#components/services/review/common/button-container.tsx'
import { ContentContainer } from '#components/services/review/common/content-container.tsx'
import { ReviewNoteDisplay } from '#components/services/review/common/review-note-display.tsx'
import { ReviewNoteEdit } from '#components/services/review/common/review-note-edit.tsx'
import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'
import { getPreviousNoteForPhase } from '#components/services/review/utils.ts'

const BrandFeedback = () => {
  const { t } = useTranslation(['edit-service', 'generic', 'toast'])

  const {
    feedbackSaving,
    form: { getFieldState, formState, setValue },
    noteUpdateLoading,
    onBack,
    phase,
    preProductionReviewRounds,
    preProductionReviewRoundsUsed,
    projectServiceId,
    remainingPreproductionRounds,
    review,
    service,
    submitForm,
  } = usePreProductionReviewContext()

  const { isDirty } = getFieldState('note', formState)

  const previousNote = useMemo(
    () => getPreviousNoteForPhase(t, phase, service, review),
    [t, phase, service, review]
  )

  const subtitle =
    review.status === 'resolving'
      ? t('brand-no-more-feedback-rounds', {
          name: service.name,
          ns: 'edit-service',
        })
      : t('brand-number-feedback-rounds', {
          count: remainingPreproductionRounds,
          name: service.name,
          ns: 'edit-service',
        })

  const getSecondaryButtonText = () => {
    if (review.acl.canRequestChanges) {
      return t('request-changes', {
        ns: 'edit-service',
        count: (preProductionReviewRoundsUsed || 0) + 1,
        total: preProductionReviewRounds,
      })
    }

    if (review.status === 'resolving' && review.acl.canApproveChanges) {
      return t('no-requests-left', {
        ns: 'edit-service',
      })
    }

    return t('close', { ns: 'generic' })
  }

  const handleApproveClick = () => {
    setValue('isChangeRequest', false)
    submitForm()
  }

  const handleRequestChangesClick = () => {
    if (review.acl.canRequestChanges) {
      setValue('isChangeRequest', true)
      submitForm()
    } else {
      onBack()
    }
  }

  return (
    <>
      <ContentContainer className="overflow-hidden justify-between">
        <ReviewNoteDisplay note={previousNote} title={service.name} />
        {review.acl.canApproveChanges && (
          <ReviewNoteEdit
            title={t('brand-feedback', { ns: 'edit-service' })}
            subtitle={subtitle}
          />
        )}
      </ContentContainer>
      <ButtonContainer>
        <Button
          variant={isDirty ? 'primary' : 'secondary'}
          disabled={
            (!review.acl.canRequestChanges && review.acl.canApproveChanges) ||
            feedbackSaving
          }
          onClick={
            review.acl.canRequestChanges ? handleRequestChangesClick : onBack
          }
          width="full"
          dataTestId={`service-edit-modal-close-${projectServiceId}`}
          dataTrackingId={`service-edit-modal-close-${projectServiceId}`}
        >
          {getSecondaryButtonText()}
        </Button>
        {review.acl.canApproveChanges && (
          <Button
            variant={isDirty ? 'secondary' : 'primary'}
            disabled={
              (remainingPreproductionRounds > 0 &&
                !isEmpty(formState.errors)) ||
              feedbackSaving
            }
            loading={noteUpdateLoading}
            onClick={handleApproveClick}
            width="full"
            dataTestId={`service-edit-modal-approve-${projectServiceId}`}
            dataTrackingId={`service-edit-modal-approve-${projectServiceId}`}
          >
            {t('approve-service', { ns: 'edit-service', name: service.name })}
          </Button>
        )}
      </ButtonContainer>
    </>
  )
}

export { BrandFeedback }
