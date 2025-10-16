import { Heading, Stack, Text } from '@mntn-dev/ui-components'

import { FinalAssetDownload } from '#projects/[projectId]/post-production-review/components/final-assets/final-asset-download.tsx'
import { ViewerContainer } from '#projects/[projectId]/post-production-review/components/viewer-container.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { canUploadInitialFinalAssets } from '#utils/project/review-helpers.ts'
import { fileProcessingFailed } from '~/lib/files/file-helpers.ts'

export const FinalAssetViewerVideo = () => {
  const {
    project,
    review,
    selectedDeliverableFile,
    selectedDeliverableName,
    t,
  } = usePostProductionReviewContext()

  if (!selectedDeliverableFile) {
    return
  }

  const processingFailed = fileProcessingFailed(selectedDeliverableFile)

  return (
    <>
      <Stack
        direction="col"
        gap={processingFailed ? '4' : '6'}
        alignItems="center"
        dataTestId="final-asset-video-file-info"
        dataTrackingId="final-asset-video-file-info"
      >
        <Stack
          direction="col"
          alignItems="center"
          width="full"
          gap="1"
          paddingTop="10"
        >
          <Text textColor="brand" fontSize="base">
            {t('post-production-review:final-text', {
              name: t('post-production-review:category.final-assets.video'),
              upload: t('post-production-review:upload'),
            })}
          </Text>
          <Heading fontSize="2xl">{selectedDeliverableName}</Heading>
        </Stack>
        {!canUploadInitialFinalAssets(project, review) && (
          <FinalAssetDownload />
        )}
      </Stack>

      {!processingFailed && (
        <ViewerContainer upload={selectedDeliverableFile} />
      )}
    </>
  )
}
