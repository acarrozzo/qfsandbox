'use client'

import { motion } from 'motion/react'
import { useState } from 'react'

import type { EditTeamProfileExampleDetailsFormModel } from '@mntn-dev/app-form-schemas'
import { VideoSpotlightCard } from '@mntn-dev/app-ui-components/video-spotlight-card'
import { TeamUrn } from '@mntn-dev/domain-types'
import type { FileListItem } from '@mntn-dev/file-service'
import { clientAllowedFormatsMap } from '@mntn-dev/files-shared'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useUploadWidget } from '~/app/file-tools.ts'
import { getTagIdsFromCategorizedList } from '~/lib/tags/tag-helpers.ts'

import { useTeamProfileEditorContext } from '../../../hooks/use-team-profile-editor.ts'

export const VideoListItem = ({ video }: { video: FileListItem }) => {
  const {
    allTags,
    editFileDetails,
    onFileDeleteClick,
    onFileDetailsUpdateSuccess,
    onFileUploadSuccess,
    savingVideo,
    teamId,
    updateExampleTagList,
  } = useTeamProfileEditorContext()

  const { fileId } = video

  const {
    data: videoUrl,
    isPending: videoLoading,
    refetch: refetchVideoUrl,
  } = trpcReactClient.files.getVideoUrl.useQuery({ fileId, options: {} })

  const { open } = useUploadWidget({
    replaceFileId: fileId,
    fileArea: 'teams.profiles.examples',
    category: 'video',
    folderUrn: TeamUrn(teamId),
    options: {
      clientAllowedFormats: clientAllowedFormatsMap.video,
      resourceType: 'video',
      sources: ['local', 'camera', 'dropbox', 'google_drive'],
      multiple: false,
    },
    onAfterUpload: () => {
      refetchVideoUrl()
      onFileUploadSuccess()
    },
  })

  const [editing, setEditing] = useState(false)

  const testId = `team-profile-video-${fileId}`

  const handleEditClick = () => {
    setEditing(true)
  }
  const handleCancelClick = () => setEditing(false)

  const saveFileDetails = async ({
    title,
    description,
    tags,
  }: EditTeamProfileExampleDetailsFormModel) => {
    const tagIds = getTagIdsFromCategorizedList(tags)

    await Promise.all([
      editFileDetails.mutateAsync({
        fileId,
        updates: { title, description },
      }),
      updateExampleTagList.mutateAsync({ tagListId: fileId, tagIds }),
    ])

    onFileDetailsUpdateSuccess()
    setEditing(false)
  }

  const handleAddVideoClick = () => {
    open()
  }

  const handleFileDeleteClick = () => {
    onFileDeleteClick(fileId)
  }

  return (
    <motion.li
      layout
      transition={{
        duration: 0.3,
        type: 'spring',
        ease: 'easeInOut',
      }}
    >
      <VideoSpotlightCard
        allTags={allTags}
        canDelete={video.acl.canArchiveFile}
        dataTestId={testId}
        dataTrackingId={testId}
        editing={editing}
        file={video}
        onAddVideo={handleAddVideoClick}
        onCancel={handleCancelClick}
        onDelete={handleFileDeleteClick}
        onEdit={handleEditClick}
        onSaveFileDetails={saveFileDetails}
        saving={savingVideo}
        videoLoading={videoLoading}
        videoUrl={videoUrl}
      />
    </motion.li>
  )
}
