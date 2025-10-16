import { Stack, Surface, Text } from '@mntn-dev/ui-components'

import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { isWaitingForProposal } from '#utils/project/review-helpers.ts'

export const RoundWaitingForProposal = () => {
  const { review, t } = usePostProductionReviewContext()
  return (
    isWaitingForProposal(review) && (
      <Surface.Body>
        <Stack
          width="full"
          height="full"
          justifyContent="center"
          alignItems="center"
          className="text-center"
          padding="32"
          dataTestId="waiting-for-maker-container"
          dataTrackingId="waiting-for-maker-container"
        >
          <Text textColor="notice">
            {t('post-production-review:waiting-for-maker')}
          </Text>
        </Stack>
      </Surface.Body>
    )
  )
}
