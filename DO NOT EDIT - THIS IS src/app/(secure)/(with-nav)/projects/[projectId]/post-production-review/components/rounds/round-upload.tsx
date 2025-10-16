import { Heading, Stack, Surface, Text } from '@mntn-dev/ui-components'

import { DeliverableFileUploadButton } from '#projects/[projectId]/post-production-review/components/deliverable-file-upload-button.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'

export const RoundUpload = () => {
  const { selectedDeliverable, selectedDeliverableName, t } =
    usePostProductionReviewContext()

  return (
    <Surface.Body className="overflow-y-auto">
      <Stack
        direction="col"
        gap="4"
        padding="32"
        justifyContent="start"
        alignItems="start"
        height="full"
        width="full"
        className="whitespace-pre-line overflow-auto"
        dataTestId="round-upload-container"
        dataTrackingId="round-upload-container"
      >
        <Stack
          width="full"
          gap="2"
          alignItems="center"
          justifyContent="center"
          direction="col"
        >
          <Heading fontSize="2xl">{selectedDeliverableName}</Heading>

          <Text textColor="brand" fontSize="base">
            {t(
              `post-production-review:upload-subtitle.${selectedDeliverable.details.category}`
            )}
          </Text>

          {selectedDeliverable.details.category === 'archive' && (
            <Text textColor="secondary" fontSize="base" className="text-center">
              {t('post-production-review:archive-options')}
            </Text>
          )}
          <DeliverableFileUploadButton />
        </Stack>
      </Stack>
    </Surface.Body>
  )
}
