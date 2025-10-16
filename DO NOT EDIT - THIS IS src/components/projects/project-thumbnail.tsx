'use client'

import type { SetRequired } from 'type-fest'

import {
  type FileId,
  type ProjectDomainQueryModel,
  ProjectUrn,
} from '@mntn-dev/domain-types'
import type { UseUploadWidgetProps } from '@mntn-dev/files-adapter-client'
import { useTranslation } from '@mntn-dev/i18n'

import { FileThumbnail } from '../files/thumbnail/file-thumbnail.tsx'
import type {
  FileThumbnailCanUploadProps,
  FileThumbnailFile,
  FileThumbnailProps,
} from '../files/thumbnail/types.ts'

type Project = Pick<ProjectDomainQueryModel, 'projectId' | 'thumbnailFileId'>

export type ProjectThumbnailProps = SetRequired<
  Pick<FileThumbnailProps, 'canUpload' | 'size'>,
  'canUpload'
> & {
  project: Project
  onAfterUpload?: UseUploadWidgetProps['onAfterUpload']
}

const getFile = (
  projectThumbnailFileId?: FileId
): FileThumbnailFile | undefined => {
  if (!projectThumbnailFileId) {
    return undefined
  }

  return {
    fileId: projectThumbnailFileId,
    category: 'image',
    name: 'Project',
  }
}

export const ProjectThumbnail = ({
  project,
  onAfterUpload,
  canUpload,
  ...fileThumbnailProps
}: ProjectThumbnailProps) => {
  const { t } = useTranslation('files')
  const uploadWidgetProps: UseUploadWidgetProps = {
    fileArea: 'projects.thumbnails',
    category: 'image',
    folderUrn: ProjectUrn(project.projectId),
    onAfterUpload: onAfterUpload,
    options: {
      cropping: true,
      sources: ['local', 'camera', 'url', 'dropbox', 'google_drive'],
      croppingAspectRatio: 1,
      multiple: false,
    },
  }

  const canUploadProps: FileThumbnailCanUploadProps = canUpload
    ? {
        canUpload: true,
        uploadWidgetProps,
      }
    : { canUpload: false }

  return (
    <FileThumbnail
      {...fileThumbnailProps}
      {...canUploadProps}
      file={getFile(project.thumbnailFileId)}
      uploadText={t('add-project-thumbnail')}
    />
  )
}
