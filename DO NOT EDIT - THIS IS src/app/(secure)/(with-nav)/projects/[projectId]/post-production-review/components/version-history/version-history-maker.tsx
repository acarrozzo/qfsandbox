import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service/client'
import { Heading, RichText, Stack, Text } from '@mntn-dev/ui-components'

import { ActivityTimestamp } from '#components/activity/activity-timestamp.tsx'
import { Viewer } from '#components/files/viewer/viewer.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import {
  getProofByDeliverableId,
  getUploadByRound,
} from '#utils/project/rounds-helpers.ts'

export const VersionHistoryMaker = ({
  round,
}: {
  round: PostProductionSelectReviewOutput['rounds'][number]
}) => {
  const { t, selectedDeliverable, selectedDeliverableName } =
    usePostProductionReviewContext()
  const { notes } =
    getProofByDeliverableId(round, selectedDeliverable.deliverableId)
      ?.proposal || {}
  const file = getUploadByRound(round, selectedDeliverable.deliverableId)

  return (
    <Stack columnGap="8" width="full" padding="8" alignItems="start">
      <Stack
        width="2/5"
        minWidth="52"
        height="full"
        alignItems="center"
        justifyContent="center"
        className="text-center"
      >
        {file && (
          <Viewer
            file={file}
            videoPlayerOptions={{
              pictureInPictureToggle: false,
              showJumpControls: false,
            }}
          />
        )}
      </Stack>
      <Stack width="3/5" direction="col" shrink gap="4">
        <Stack direction="col">
          {round.proposal.submitted && (
            <Text fontSize="sm" textColor="brand">
              {round.proposal.submitted.actor?.displayName}
            </Text>
          )}
          <Heading fontSize="xl">
            {t('post-production-review:version-proposal', {
              round: round.roundNumber,
              name: selectedDeliverableName,
            })}
          </Heading>
          {round.proposal.submitted && (
            <ActivityTimestamp timestamp={round.proposal.submitted.timestamp} />
          )}
        </Stack>
        {notes && <RichText bounded className="text-secondary" value={notes} />}
      </Stack>
    </Stack>
  )
}
