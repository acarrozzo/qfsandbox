import type { ViewableFile } from '#components/files/viewer/types.ts'
import { Viewer } from '#components/files/viewer/viewer.tsx'

export const ViewerContainer = ({ upload }: { upload: ViewableFile }) => {
  return (
    <div className="flex h-[50vh] p-8 mx-auto">
      {upload && (
        <Viewer
          file={upload}
          videoPlayerOptions={{
            pictureInPictureToggle: false,
            showJumpControls: false,
          }}
          videoOptions={{ resizeWidthToFitParent: true }}
        />
      )}
    </div>
  )
}
