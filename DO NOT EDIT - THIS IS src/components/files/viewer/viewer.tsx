import type { VideoPlayerOptions } from '@mntn-dev/files-shared'

import type { ComponentProps } from '~/types/props.ts'

import type { ViewableFile } from './types.ts'
import { ViewerAudioPlayer } from './viewer-audio-player.tsx'
import { ViewerImage } from './viewer-image.tsx'
import { ViewerOtherFile } from './viewer-other-file.tsx'
import { ViewerVideoFitToContent } from './viewer-video-fit-to-content.tsx'
import { ViewerVideoResizedToParent } from './viewer-video-resized-to-parent.tsx'

type Props = ComponentProps<{
  file: ViewableFile
  videoOptions?: {
    resizeWidthToFitParent?: boolean
  }
  videoPlayerOptions?: VideoPlayerOptions
  onDownload?: () => void
}>

export const ViewerComponent = ({
  file,
  videoOptions,
  videoPlayerOptions,
  onDownload,
}: Props) => {
  switch (file.category) {
    case 'video': {
      return videoOptions?.resizeWidthToFitParent ? (
        <ViewerVideoResizedToParent
          file={file}
          videoPlayerOptions={videoPlayerOptions}
        />
      ) : (
        <ViewerVideoFitToContent
          file={file}
          videoPlayerOptions={videoPlayerOptions}
        />
      )
    }
    case 'image_document':
    case 'image': {
      return <ViewerImage file={file} />
    }
    case 'audio': {
      return <ViewerAudioPlayer file={file} />
    }
    default: {
      return <ViewerOtherFile file={file} onDownload={onDownload} />
    }
  }
}

export const Viewer = (props: Props) => (
  // Force a key to make sure the viewer fully unmounts if React tries to render a different file
  <ViewerComponent key={props.file.fileId} {...props} />
)
