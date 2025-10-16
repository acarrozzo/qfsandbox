import { AppFileVideoPlayer } from '@mntn-dev/app-ui-components'
import type { VideoPlayerOptions } from '@mntn-dev/files-shared'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import type { ComponentProps } from '~/types/props.ts'

import type { ViewableFile } from './types.ts'
import { getPlayerOptionDefaults } from './viewer-utils.ts'

type Props = ComponentProps<{
  file: ViewableFile
  onSuccess?: () => void
  videoPlayerOptions?: VideoPlayerOptions
}>

export const ViewerVideo = ({ file, videoPlayerOptions, onSuccess }: Props) => {
  return (
    <AppFileVideoPlayer
      id={`video-${file.fileId}`}
      fileId={file.fileId}
      trpcReactClient={trpcReactClient}
      options={{ ...getPlayerOptionDefaults(), ...videoPlayerOptions }}
      onLoadedData={onSuccess}
    />
  )
}
