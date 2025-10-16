import type { CropMode, VideoPlayerOptions } from '@mntn-dev/files-shared'

const crop: CropMode = 'limit'
const width = 1000
const height = 1000

export const getViewerImageDefaults = () => ({ crop, width, height })

const playerOptions: VideoPlayerOptions = {
  fluid: true,
  controls: true,
  aiHighlightsGraph: true,
  showJumpControls: true,
  floatingWhenNotVisible: 'right',
  pictureInPictureToggle: true,
  showLogo: false,
}

export const getPlayerOptionDefaults = () => playerOptions
