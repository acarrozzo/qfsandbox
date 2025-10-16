import React from 'react'

import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import type { Note, UserDomainQueryModel } from '@mntn-dev/domain-types'
import { Collapsible, Stack, Surface } from '@mntn-dev/ui-components'

import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { isLeavingProposal } from '#utils/project/review-helpers.ts'

export const RoundPreviousComment = React.memo(
  ({ comment, actor }: { comment: Note; actor: UserDomainQueryModel }) => {
    const { review, t } = usePostProductionReviewContext()

    return (
      <Surface.Body>
        <Stack
          direction="col"
          paddingX="8"
          paddingY="4"
          justifyContent="start"
          alignItems="start"
          height="full"
          className="whitespace-pre-line overflow-auto"
        >
          <Collapsible
            isOpen={isLeavingProposal(review)}
            className="whitespace-pre-line overflow-auto"
            dataTestId="previous-round-displayed-comment-container"
            dataTrackingId="previous-round-displayed-comment-container"
          >
            <Collapsible.Comment
              comment={comment}
              title={
                isLeavingProposal(review) && review.previousRound
                  ? t('post-production-review:round-feedback', {
                      round: review.previousRound.roundNumber,
                    })
                  : undefined
              }
              user={actor}
              image={NextImage({ unoptimized: true })}
            />
          </Collapsible>
        </Stack>
      </Surface.Body>
    )
  }
)
