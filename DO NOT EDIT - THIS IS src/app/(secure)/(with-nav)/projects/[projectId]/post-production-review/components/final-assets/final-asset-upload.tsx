import { Heading, Stack, Surface, Text } from '@mntn-dev/ui-components'

import { DeliverableFileUploadButton } from '#projects/[projectId]/post-production-review/components/deliverable-file-upload-button.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'

export const FinalAssetUpload = () => {
  const { t, selectedDeliverable, selectedDeliverableName } =
    usePostProductionReviewContext()

  return (
    <Surface.Body className="overflow-y-auto w-full">
      <Stack
        direction="col"
        gap="4"
        padding="32"
        justifyContent="start"
        alignItems="start"
        height="full"
        width="full"
        className="whitespace-pre-line overflow-auto"
        dataTestId="final-asset-upload-container"
        dataTrackingId="final-asset-upload-container"
      >
        <Stack
          width="full"
          gap="2"
          alignItems="center"
          justifyContent="center"
          direction="col"
        >
          <Text textColor="brand" fontSize="base">
            {t('post-production-review:final-text', {
              name: t(
                `post-production-review:category.final-assets.${selectedDeliverable.details.category}`
              ),
              upload: t('post-production-review:upload'),
            })}
          </Text>

          <Heading fontSize="2xl">{selectedDeliverableName}</Heading>

          {selectedDeliverable.details.category === 'archive' && (
            <Text textColor="secondary" fontSize="base" className="text-center">
              {t('post-production-review:archive-options')}
            </Text>
          )}
          <DeliverableFileUploadButton isFinalAsset />
        </Stack>
      </Stack>
    </Surface.Body>
  )
}
