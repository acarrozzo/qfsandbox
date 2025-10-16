'use client'

import { Fragment } from 'react'

import { useTranslation } from '@mntn-dev/i18n'

import { ReviewNoteDisplay } from '#components/services/review/common/review-note-display.tsx'
import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'
import { getProposalSectionHeader } from '#components/services/review/utils.ts'

const MainTabHistory = () => {
  const { review, service } = usePreProductionReviewContext()
  const { t } = useTranslation(['edit-service'])

  const sortedRounds = review.rounds.toSorted(
    // Sort most recent round first for display purposes
    (a, b) => b.roundNumber - a.roundNumber
  )

  return (
    <div className="flex-1 overflow-hidden">
      <div className="overflow-y-auto h-full">
        <div className="flex flex-col gap-8 p-8 divide-y divide-subtle">
          <div className="h-full flex flex-col gap-8">
            {sortedRounds?.map((round) => (
              <Fragment key={round.roundNumber}>
                {round.feedback.submitted && round.feedback.notes && (
                  <ReviewNoteDisplay
                    title={t('brand-feedback', { ns: 'edit-service' })}
                    note={round.feedback.notes}
                    timestamp={round.feedback.submitted.timestamp}
                    avatarPerson={round.feedback.submitted.actor}
                  />
                )}
                {round.proposal.submitted && round.proposal.notes && (
                  <ReviewNoteDisplay
                    title={getProposalSectionHeader(t, round, service, review)}
                    note={round.proposal.notes}
                    timestamp={round.proposal.submitted.timestamp}
                    avatarPerson={round.proposal.submitted.actor}
                    displayMode="history"
                  />
                )}
              </Fragment>
            ))}
          </div>
          {service.brandNote && (
            <ReviewNoteDisplay
              title={t('brand-note', { ns: 'edit-service' })}
              note={service.brandNote}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export { MainTabHistory }
