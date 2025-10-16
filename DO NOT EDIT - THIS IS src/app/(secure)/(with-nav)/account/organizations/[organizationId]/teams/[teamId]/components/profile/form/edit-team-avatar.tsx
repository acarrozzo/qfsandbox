'use client'

import { TeamUrn } from '@mntn-dev/domain-types'
import type {
  AfterUploadEvent,
  AfterUploadHandler,
} from '@mntn-dev/files-adapter-client'
import { useController } from '@mntn-dev/forms'
import { logger } from '@mntn-dev/logger'
import { getChildTestIds } from '@mntn-dev/ui-components'
import { cn } from '@mntn-dev/ui-utilities'

import { useUploadWidget } from '~/app/file-tools.ts'
import { TeamAvatar } from '~/components/avatar/team-avatar.tsx'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { useTeamProfileEditorContext } from '../../../hooks/use-team-profile-editor.ts'

const EditTeamAvatar = () => {
  const {
    dataTestId,
    dataTrackingId,
    team,
    avatarLoading,
    editing,
    form: { control },
    setAvatarLoading,
  } = useTeamProfileEditorContext()

  const { hasPermission } = usePermissions()

  const { teamId } = team

  const { field } = useController({
    control,
    name: 'avatarFileId',
  })

  const handleFileUploadStart = () => {
    setAvatarLoading(true)
  }

  const handleFileUploadSuccess: AfterUploadHandler = (e: AfterUploadEvent) => {
    logger.debug('File uploaded successfully', { e })
    setAvatarLoading(false)
    field.onChange(e.file.fileId)
  }

  const { open } = useUploadWidget({
    fileArea: 'teams.avatars',
    category: 'image',
    folderUrn: TeamUrn(teamId),
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

  const handleLogoClick = () => {
    open()
  }

  const showOrganizationTypeIndicator = hasPermission(
    'customer-organization:administer'
  )

  return (
    <div
      className={cn(
        'relative inline-block',
        avatarLoading && 'cursor-not-allowed opacity-70'
      )}
    >
      <div className="flex flex-col">
        <TeamAvatar
          decoratorType={editing ? 'add' : undefined}
          size="2xl"
          onClick={editing ? handleLogoClick : undefined}
          showOrganizationTypeIndicator={showOrganizationTypeIndicator}
          {...getChildTestIds({ dataTestId, dataTrackingId }, 'logo')}
          team={team}
        />
      </div>
    </div>
  )
}

export { EditTeamAvatar }
