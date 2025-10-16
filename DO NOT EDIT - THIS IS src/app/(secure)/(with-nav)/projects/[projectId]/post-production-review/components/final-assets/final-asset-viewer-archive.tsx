import { Heading, Icon, Stack, Text } from '@mntn-dev/ui-components'

import { FinalAssetDownload } from '#projects/[projectId]/post-production-review/components/final-assets/final-asset-download.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { formatBytes } from '#utils/format-bytes.ts'
import { canUploadInitialFinalAssets } from '#utils/project/review-helpers.ts'

export const FinalAssetViewerArchive = () => {
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

  return (
    <Stack
      direction="col"
      alignItems="center"
      width="full"
      gap="2"
      padding="32"
      dataTestId="final-asset-archive-file-info"
      dataTrackingId="final-asset-archive-file-info"
    >
      <Stack
        direction="col"
        gap="1"
        alignItems="center"
        justifyContent="center"
      >
        {canUploadInitialFinalAssets(project, review) && (
          <Icon name="check" size="xl" color="positive" />
        )}
        <Text textColor="brand" fontSize="base">
          {t('post-production-review:final-text', {
            name: t('post-production-review:category.final-assets.archive'),
            upload: t('post-production-review:upload'),
          })}
        </Text>
        <Heading fontSize="2xl">{selectedDeliverableName}</Heading>

        <Text
          textColor={
            project.acl.canAttachFinalAssetToDeliverable ? 'positive' : 'info'
          }
          fontSize="base"
          className="text-center"
        >
          <Stack gap="1" justifyContent="center" alignItems="center">
            {selectedDeliverableFile.name}
          </Stack>
        </Text>
        <Text fontSize="sm" textColor="tertiary">
          {formatBytes(selectedDeliverableFile.size)}
        </Text>
      </Stack>
      {!canUploadInitialFinalAssets(project, review) && <FinalAssetDownload />}
    </Stack>
  )
}
