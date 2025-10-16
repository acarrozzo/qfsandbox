import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service/client'
import { Heading, RichText, Stack, Tag, Text } from '@mntn-dev/ui-components'

import { ActivityTimestamp } from '#components/activity/activity-timestamp.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { getProofByDeliverableId } from '#utils/project/rounds-helpers.ts'

export const VersionHistoryBrand = ({
  round,
}: {
  round: PostProductionSelectReviewOutput['rounds'][number]
}) => {
  const { t, selectedDeliverable } = usePostProductionReviewContext()
  const { feedback: { notes } = {}, status } =
    getProofByDeliverableId(round, selectedDeliverable.deliverableId) || {}

  return (
    <Stack direction="col" gap="2" padding="8">
      <Stack direction="col">
        {round.feedback.submitted && (
          <Text fontSize="sm" textColor="brand">
            {round.feedback.submitted.actor.displayName}
          </Text>
        )}
        <Heading fontSize="xl">
          {t('post-production-review:version-feedback', {
            round: round.roundNumber,
          })}
        </Heading>
        {round.feedback.submitted && (
          <ActivityTimestamp timestamp={round.feedback.submitted.timestamp} />
        )}
        <Stack width="fit" paddingY="2">
          {status === 'approved' ? (
            <Tag type="success" variant="secondary" icon={{ name: 'check' }}>
              {t('post-production-review:tags.approved')}
            </Tag>
          ) : (
            <Tag type="error" variant="secondary">
              {t('post-production-review:tags.changes-requested')}
            </Tag>
          )}
        </Stack>
      </Stack>
      {notes && <RichText bounded className="text-secondary" value={notes} />}
    </Stack>
  )
}
