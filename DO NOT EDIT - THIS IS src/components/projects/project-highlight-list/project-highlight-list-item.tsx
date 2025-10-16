import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import {
  ProjectHighlightCard,
  type ProjectHighlightCardProps,
} from '@mntn-dev/app-ui-components/project-highlight-card'
import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'
import type { TestIds } from '@mntn-dev/ui-components'

import { useMe } from '~/hooks/secure/use-me.ts'
import { getFileImageProxyUrl } from '~/utils/client/file-utilities.ts'

export type ProjectHighlightListItemProps = Pick<
  ProjectHighlightCardProps,
  'actions'
> &
  TestIds & {
    project: ProjectListItemServiceModel
    onClick?: () => void
  }

export const ProjectHighlightListItem = ({
  actions,
  dataTestId,
  dataTrackingId,
  onClick,
  project,
}: ProjectHighlightListItemProps) => {
  const { me } = useMe()

  const projectThumbnailUrl = project.thumbnailFileId
    ? getFileImageProxyUrl({
        fileId: project.thumbnailFileId,
        options: { width: 256, height: 256, gravity: 'custom', crop: 'thumb' },
      })
    : undefined

  const brandTeamThumbnailUrl = project.brandTeam?.avatarFileId
    ? getFileImageProxyUrl({
        fileId: project.brandTeam.avatarFileId,
        options: { width: 48, height: 48, gravity: 'custom', crop: 'thumb' },
      })
    : undefined

  return (
    <ProjectHighlightCard
      dataTestId={dataTestId}
      dataTrackingId={dataTrackingId}
      project={project}
      currentUser={me}
      thumbnails={{
        brandTeamThumbnailUrl,
        projectThumbnailUrl,
      }}
      onClick={onClick}
      actions={actions}
      image={NextImage({ unoptimized: true })}
    />
  )
}
