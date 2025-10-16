import { useState } from 'react'

import { userToPerson } from '@mntn-dev/app-common'
import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import type { FileId, UserDomainSelectModel } from '@mntn-dev/domain-types'
import type {
  AfterUploadEvent,
  AfterUploadHandler,
} from '@mntn-dev/files-adapter-client'
import { useTranslation } from '@mntn-dev/i18n'
import { logger } from '@mntn-dev/logger'
import { Avatar, Button, Stack, useToast } from '@mntn-dev/ui-components'
import { cn } from '@mntn-dev/ui-utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client'
import { useUploadWidget } from '~/app/file-tools.ts'
import { getAvatarUrl } from '~/components/avatar/helper.ts'

type UserEditAvatarProps = {
  user: UserDomainSelectModel
  onChanged: () => void
}

export const UserEditAvatar = ({ user, onChanged }: UserEditAvatarProps) => {
  const [avatarFileId, setAvatarFileId] = useState<string>(
    user.avatarFileId ?? ''
  )
  const patchUser = trpcReactClient.users.patchUser.useMutation()
  const { t } = useTranslation(['profile', 'toast'])
  const { showToast } = useToast()

  const updateAvatar = (updatedFileId: FileId | null | undefined) => {
    patchUser
      .mutateAsync({
        ...user,
        avatarFileId: updatedFileId,
      })
      .then((user) => {
        setAvatarFileId(user.avatarFileId ?? '')
        onChanged()
      })

    if (updatedFileId) {
      showToast.info({
        title: t('toast:file.added.title'),
        body: t('toast:file.added.body'),
        dataTestId: 'file-added-info-toast',
        dataTrackingId: 'file-added-info-toast',
      })
    } else {
      showToast.info({
        title: t('toast:file.removed.title'),
        body: t('toast:file.removed.body'),
        dataTestId: 'file-removed-info-toast',
        dataTrackingId: 'file-removed-info-toast',
      })
    }
  }

  const [isUploading, setIsUploading] = useState(false)

  const handleFileUploadSuccess: AfterUploadHandler = (e: AfterUploadEvent) => {
    logger.debug('File uploaded successfully', { e })
    setIsUploading(false)
    updateAvatar(e.file.fileId)
  }

  const handleFileUploadStart = () => {
    setIsUploading(true)
  }

  const { open } = useUploadWidget({
    fileArea: 'users.avatars',
    category: 'image',
    folderUrn: user.userUrn,
    options: {
      showUploadMoreButton: false,
      sources: ['local', 'camera', 'url', 'dropbox', 'google_drive'],
      cropping: true,
      croppingAspectRatio: 1,
      multiple: false,
    },
    onQueuesStart: handleFileUploadStart,
    onAfterUpload: handleFileUploadSuccess,
  })

  const handleRemoveAvatarClick = () => {
    updateAvatar(null)
  }

  const handleAvatarClick = () => {
    open()
  }

  return (
    <div
      className={cn(
        'relative inline-block',
        isUploading && 'cursor-not-allowed opacity-70'
      )}
    >
      <Stack direction="col">
        <Avatar
          size="2xl"
          onClick={handleAvatarClick}
          dataTestId="edit-avatar-button"
          dataTrackingId="edit-avatar-button"
        >
          <Avatar.Person
            person={userToPerson(user, getAvatarUrl)}
            image={NextImage({ unoptimized: true })}
          />
        </Avatar>
        {avatarFileId && (
          <Button
            variant="text"
            onClick={handleRemoveAvatarClick}
            dataTestId="remove-avatar-button"
            dataTrackingId="remove-avatar-button"
          >
            {t('profile:remove-avatar')}
          </Button>
        )}
      </Stack>
    </div>
  )
}
