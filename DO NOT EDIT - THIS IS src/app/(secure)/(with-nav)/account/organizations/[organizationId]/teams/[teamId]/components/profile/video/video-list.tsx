'use client'

import type { FileListItem } from '@mntn-dev/file-service'

import { useTeamProfileEditorContext } from '../../../hooks/use-team-profile-editor.ts'
import { VideoDeleteConfirmationModal } from './video-delete-confirmation-modal.tsx'
import { VideoListItem } from './video-list-item.tsx'

export type VideoListProps = {
  videos: FileListItem[]
}

export const VideoList = ({ videos }: VideoListProps) => {
  const {
    deletingVideo,
    onFileDeleteCancel,
    onFileDeleteConfirm,
    showFileDeleteConfirmationModal,
  } = useTeamProfileEditorContext()
  return (
    <>
      <ul className="flex flex-col gap-8 w-full">
        {videos.map((video) => (
          <VideoListItem key={video.fileId} video={video} />
        ))}
      </ul>

      <VideoDeleteConfirmationModal
        open={showFileDeleteConfirmationModal}
        onClose={onFileDeleteCancel}
        onConfirm={onFileDeleteConfirm}
        confirmIsLoading={deletingVideo}
      />
    </>
  )
}
