import { ProjectServiceUrn } from '@mntn-dev/domain-types'
import { clientAllowedFormatsMap } from '@mntn-dev/files-shared'
import { useTranslation } from '@mntn-dev/i18n'

import { FileUploadButton } from '#components/projects/file-upload-button.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
export const DeliverableFileUploadButton = ({
  showReuploadButton = false,
  isFinalAsset = false,
}: {
  showReuploadButton?: boolean
  isFinalAsset?: boolean
}) => {
  const { t } = useTranslation(['post-production-review'])
  const {
    handleProofAfterUpload,
    handleFinalAssetAfterUpload,
    review,
    selectedDeliverable,
  } = usePostProductionReviewContext()

  const folderUrn = review
    ? review.reviewUrn
    : ProjectServiceUrn(selectedDeliverable.projectServiceId)
  const fileArea = isFinalAsset
    ? 'projects.services.assets.final'
    : 'projects.services.assets.deliverables'
  const onAfterUpload = isFinalAsset
    ? handleFinalAssetAfterUpload
    : handleProofAfterUpload

  const getTestDataIds = (
    isFinalAsset: boolean,
    showReuploadButton: boolean
  ) => {
    const deliverableId = selectedDeliverable.deliverableId
    const finalAssetText = isFinalAsset ? 'final-' : ''
    const uploadText = showReuploadButton ? 'reupload-button' : 'upload-button'
    return {
      dataTestId: `deliverable-${deliverableId}-${finalAssetText}${uploadText}`,
      dataTrackingId: `deliverable-${deliverableId}-${finalAssetText}${uploadText}`,
    }
  }

  return (
    <FileUploadButton
      fileArea={fileArea}
      folderUrn={folderUrn}
      onAfterUpload={onAfterUpload}
      options={{
        resourceType:
          selectedDeliverable.details.category === 'video' ? 'video' : 'auto',
        maxFiles: 1,
        showUploadMoreButton: false,
        singleUploadAutoClose: true,
        clientAllowedFormats:
          clientAllowedFormatsMap[selectedDeliverable.details.category],
      }}
      className="capitalize"
      variant={showReuploadButton ? 'secondary' : 'primary'}
      size={showReuploadButton ? 'sm' : 'md'}
      iconRight={showReuploadButton ? 'upload' : 'add'}
      iconColor={showReuploadButton ? 'primary' : undefined}
      {...getTestDataIds(isFinalAsset, showReuploadButton)}
    >
      {t(
        showReuploadButton
          ? 'post-production-review:reupload-button-text'
          : 'post-production-review:upload-button-text',
        {
          name: t(
            `post-production-review:category.${selectedDeliverable.details.category}`
          ),
        }
      )}
    </FileUploadButton>
  )
}
