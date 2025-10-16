'use client'

import { useMemo } from 'react'

import { useTranslation } from '@mntn-dev/i18n'

import { ContentContainer } from '#components/services/review/common/content-container.tsx'
import { ReviewNoteDisplay } from '#components/services/review/common/review-note-display.tsx'
import { ReviewNoteEdit } from '#components/services/review/common/review-note-edit.tsx'
import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'
import { getPreviousNoteForPhase } from '#components/services/review/utils.ts'

const MakerProposal = () => {
  const { t } = useTranslation(['edit-service', 'generic', 'toast'])

  const { phase, review, service } = usePreProductionReviewContext()

  const previousNote = useMemo(
    () => getPreviousNoteForPhase(t, phase, service, review),
    [t, phase, service, review]
  )

  return (
    <ContentContainer className="overflow-hidden justify-between">
      <ReviewNoteDisplay
        note={previousNote}
        title={
          review.currentRoundNumber === 1
            ? t('brand-note', { ns: 'edit-service' })
            : t('brand-feedback', { ns: 'edit-service' })
        }
      />
      {review.acl.canUpdateProposal && (
        <ReviewNoteEdit title={service.name} displayMode="main" />
      )}
    </ContentContainer>
  )
}

export { MakerProposal }
