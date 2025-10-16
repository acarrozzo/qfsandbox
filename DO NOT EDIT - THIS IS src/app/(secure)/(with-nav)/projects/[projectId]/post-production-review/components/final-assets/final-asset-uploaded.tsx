import { Icon, Stack, Surface, Text } from '@mntn-dev/ui-components'

import { DeliverableFileUploadButton } from '#projects/[projectId]/post-production-review/components/deliverable-file-upload-button.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'

export const FinalAssetUploaded = () => {
  const { t, selectedDeliverable } = usePostProductionReviewContext()

  return (
    <Surface.Body className="overflow-y-auto w-full">
      <Stack
        direction="col"
        gap="4"
        paddingX="8"
        paddingY="4"
        justifyContent="start"
        alignItems="start"
        height="full"
        width="full"
        className="whitespace-pre-line overflow-auto"
        dataTestId="final-asset-uploaded-info-container"
        dataTrackingId="final-asset-uploaded-info-container"
      >
        <Stack width="full" gap="8" alignItems="center" justifyContent="center">
          <Stack
            alignItems="center"
            justifyContent="end"
            direction="row"
            width="full"
            gap="1"
          >
            <Icon name="check" size="md" color="positive" />
            <Text textColor="positive" fontSize="base">
              {`${t(`post-production-review:category.final-assets.${selectedDeliverable.details.category}`)} ${t('post-production-review:uploaded')}`}
            </Text>
          </Stack>

          <div className="w-full">
            <DeliverableFileUploadButton isFinalAsset showReuploadButton />
          </div>
        </Stack>
      </Stack>
    </Surface.Body>
  )
}
