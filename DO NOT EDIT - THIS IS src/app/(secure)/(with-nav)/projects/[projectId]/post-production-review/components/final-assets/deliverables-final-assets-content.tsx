import { FinalAssetUpload } from '#projects/[projectId]/post-production-review/components/final-assets/final-asset-upload.tsx'
import { FinalAssetUploaded } from '#projects/[projectId]/post-production-review/components/final-assets/final-asset-uploaded.tsx'
import { FinalAssetViewer } from '#projects/[projectId]/post-production-review/components/final-assets/final-asset-viewer.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { canUploadInitialFinalAssets } from '#utils/project/review-helpers.ts'

export const DeliverablesFinalAssetsContent = () => {
  const { project, review, selectedDeliverableFile } =
    usePostProductionReviewContext()

  return (
    <>
      {selectedDeliverableFile && <FinalAssetViewer />}
      {canUploadInitialFinalAssets(project, review) &&
        (selectedDeliverableFile ? (
          <FinalAssetUploaded />
        ) : (
          <FinalAssetUpload />
        ))}
    </>
  )
}
