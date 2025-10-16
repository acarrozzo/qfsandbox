import { type RefObject, useRef } from 'react'

import type { VideoPlayerOptions } from '@mntn-dev/files-shared'
import { Stack } from '@mntn-dev/ui-components'

import type { ComponentProps } from '~/types/props.ts'

import type { ViewableFile } from './types.ts'
import { useResizeWidthToFit } from './use-resize-width-to-fit.ts'
import { useVideoStatus } from './use-video-status.tsx'
import { ViewerVideo } from './viewer-video.tsx'

type Props = ComponentProps<{
  file: ViewableFile
  videoPlayerOptions?: VideoPlayerOptions
}>

export const ViewerVideoResizedToParent = ({
  file,
  videoPlayerOptions,
}: Props) => {
  const absoluteContainerRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const { isSuccess, handleVideoSuccess } = useVideoStatus()

  const { isSized, resizedWidth } = useResizeWidthToFit({
    targetRef: videoContainerRef as RefObject<HTMLElement>,
    destinationRef: absoluteContainerRef as RefObject<HTMLElement>,
  })

  return (
    <Stack
      className="relative"
      alignItems="center"
      justifyContent="center"
      width="full"
      height="full"
      dataTestId={`viewer-${file.fileId}`}
      dataTrackingId={`viewer-${file.fileId}`}
    >
      <div
        className="absolute inset-0 flex items-center justify-center h-full w-full"
        ref={absoluteContainerRef}
      >
        <div
          className="w-full h-fit"
          ref={videoContainerRef}
          style={{
            width: resizedWidth,
            visibility: isSuccess && isSized ? 'visible' : 'hidden',
          }}
        >
          <ViewerVideo
            file={file}
            videoPlayerOptions={videoPlayerOptions}
            onSuccess={handleVideoSuccess}
          />
        </div>
      </div>
    </Stack>
  )
}
