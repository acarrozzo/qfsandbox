import { Button, Icon, Stack, Text } from '@mntn-dev/ui-components'

import { DeliverableFileUploadButton } from '#projects/[projectId]/post-production-review/components/deliverable-file-upload-button.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import {
  fileProcessingAwaitingCompletion,
  fileProcessingFailed,
  handleFileDownload,
} from '~/lib/files/file-helpers.ts'

export const FinalAssetDownload = () => {
  const { selectedDeliverableFile, t, project } =
    usePostProductionReviewContext()

  const handleFinalAssetDownload = async () => {
    if (
      selectedDeliverableFile &&
      !fileProcessingAwaitingCompletion(selectedDeliverableFile)
    ) {
      await handleFileDownload(selectedDeliverableFile)
    }
  }

  if (!selectedDeliverableFile) {
    return
  }

  if (fileProcessingFailed(selectedDeliverableFile)) {
    return (
      <Stack
        direction="col"
        gap="4"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          gap="2"
          justifyContent="center"
          alignItems="center"
          dataTestId="final-asset-processing-failed"
          dataTrackingId="final-asset-processing-failed"
        >
          <Icon name="error-warning" size="sm" color="negative" fill="solid" />
          <Text>
            {project.acl.canAttachFinalAssetToDeliverable
              ? t('post-production-review:file-processing-reupload')
              : t('post-production-review:file-processing-failed')}
          </Text>
        </Stack>
        {project.acl.canAttachFinalAssetToDeliverable && (
          <DeliverableFileUploadButton isFinalAsset />
        )}
      </Stack>
    )
  }

  if (fileProcessingAwaitingCompletion(selectedDeliverableFile)) {
    return (
      <Stack
        gap="2"
        justifyContent="center"
        alignItems="center"
        dataTestId="final-asset-processing-in-progress"
        dataTrackingId="final-asset-processing-in-progress"
      >
        <Icon name="information" size="sm" color="notice" fill="solid" />
        <Text>{t('post-production-review:file-processing')}</Text>
      </Stack>
    )
  }

  return (
    <Button
      iconRight="download"
      size="lg"
      width="fit"
      onClick={handleFinalAssetDownload}
      dataTestId="download-final-asset-button"
      dataTrackingId="download-final-asset-button"
    >
      {t('post-production-review:download-button-text')}
    </Button>
  )
}
