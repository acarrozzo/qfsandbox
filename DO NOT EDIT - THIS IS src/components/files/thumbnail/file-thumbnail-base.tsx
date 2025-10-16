'use client'

import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import { ThumbnailableFileCategories } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { getThumbnailSizing, Thumbnail } from '@mntn-dev/ui-components'

import { useFileImage } from '../use-file-image.ts'
import { FileIcon } from './file-icon.tsx'
import type { FileThumbnailBaseProps } from './types.ts'
import { getThumbnailFileCategory } from './utils.ts'

export const FileThumbnailBase = ({
  alt,
  canUpload,
  dataTestId,
  dataTrackingId,
  file,
  size = 'md',
  placeholderIcon,
  ...thumbnailProps
}: FileThumbnailBaseProps) => {
  const { t } = useTranslation(['generic', 'file-thumbnail'])

  const isThumbnailableFile = file?.category
    ? ThumbnailableFileCategories.includes(file.category)
    : false

  const fileCategory = file?.category
    ? getThumbnailFileCategory(file.category)
    : 'image'

  const sizing = getThumbnailSizing(size)
  const src = useFileImage({
    fileId: file?.fileId,
    height: sizing.height,
    width: sizing.width,
    crop: 'thumb',
  })

  return (
    <Thumbnail
      src={isThumbnailableFile ? src : undefined}
      size={size}
      canUpload={canUpload}
      placeholderIcon={
        fileCategory ? (
          <FileIcon fileCategory={fileCategory} size={sizing.uploadIconSize} />
        ) : undefined
      }
      alt={t('generic:thumbnail-alt', {
        name: alt ?? file?.name ?? t('generic:file'),
      })}
      image={NextImage({ unoptimized: true })}
      {...thumbnailProps}
    />
  )
}
