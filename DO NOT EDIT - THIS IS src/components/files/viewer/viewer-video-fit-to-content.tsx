import type { VideoPlayerOptions } from '@mntn-dev/files-shared'
import { Stack } from '@mntn-dev/ui-components'

import type { ComponentProps } from '~/types/props.ts'

import type { ViewableFile } from './types.ts'
import { useVideoStatus } from './use-video-status.tsx'
import { ViewerVideo } from './viewer-video.tsx'

type Props = ComponentProps<{
  file: ViewableFile
  videoPlayerOptions?: VideoPlayerOptions
}>

export const ViewerVideoFitToContent = ({
  file,
  videoPlayerOptions,
}: Props) => {
  const { handleVideoSuccess } = useVideoStatus()

  return (
    <Stack
      className="relative"
      alignItems="center"
      justifyContent="center"
      width="full"
      height="fit"
      dataTestId={`viewer-${file.fileId}`}
      dataTrackingId={`viewer-${file.fileId}`}
    >
      <ViewerVideo
        file={file}
        videoPlayerOptions={videoPlayerOptions}
        onSuccess={handleVideoSuccess}
      />
    </Stack>
  )
}
