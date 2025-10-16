import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import { ProjectListCard } from '@mntn-dev/app-ui-components/project-list-card'
import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'
import type { TestIds } from '@mntn-dev/ui-components'

import { useMe } from '~/hooks/secure/use-me.ts'
import { getFileImageProxyUrl } from '~/utils/client/file-utilities.ts'

export type ProjectListItemProps = TestIds & {
  index?: number
  project: ProjectListItemServiceModel
  onClick?: () => void
  onArchive?: () => void
  onProjectClose?: () => void
}

export const ProjectListItem = ({
  dataTestId,
  dataTrackingId,
  project,
  onClick,
  onArchive,
  onProjectClose,
}: ProjectListItemProps) => {
  const { me } = useMe()

  const projectThumbnailUrl = project.thumbnailFileId
    ? getFileImageProxyUrl({
        fileId: project.thumbnailFileId,
        options: { width: 72, height: 72, gravity: 'custom', crop: 'thumb' },
      })
    : undefined

  const brandTeamThumbnailUrl = project.brandTeam?.avatarFileId
    ? getFileImageProxyUrl({
        fileId: project.brandTeam.avatarFileId,
        options: { width: 24, height: 24, gravity: 'custom', crop: 'thumb' },
      })
    : undefined

  return (
    <ProjectListCard
      currentUser={me}
      dataTestId={dataTestId}
      dataTrackingId={dataTrackingId}
      project={project}
      thumbnails={{
        brandTeamThumbnailUrl: brandTeamThumbnailUrl,
        projectThumbnailUrl: projectThumbnailUrl,
      }}
      onClick={onClick}
      onArchive={onArchive}
      onProjectClose={onProjectClose}
      image={NextImage({ unoptimized: true })}
    />
  )
}
