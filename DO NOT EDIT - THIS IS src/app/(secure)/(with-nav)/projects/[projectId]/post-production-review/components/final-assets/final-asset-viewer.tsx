import { Surface } from '@mntn-dev/ui-components'

import { FinalAssetViewerArchive } from '#projects/[projectId]/post-production-review/components/final-assets/final-asset-viewer-archive.tsx'
import { FinalAssetViewerVideo } from '#projects/[projectId]/post-production-review/components/final-assets/final-asset-viewer-video.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'

export const FinalAssetViewer = () => {
  const { selectedDeliverableFile } = usePostProductionReviewContext()

  if (!selectedDeliverableFile) {
    return
  }

  return (
    <Surface.Body
      className="w-full pb-4"
      dataTestId="final-asset-viewer-container"
      dataTrackingId="final-asset-viewer-container"
    >
      {selectedDeliverableFile.category === 'video' && (
        <FinalAssetViewerVideo />
      )}

      {selectedDeliverableFile.category === 'archive' && (
        <FinalAssetViewerArchive />
      )}
    </Surface.Body>
  )
}
