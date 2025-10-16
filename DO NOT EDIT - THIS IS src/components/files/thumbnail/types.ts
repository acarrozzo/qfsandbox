import type { SetOptional } from 'type-fest'

import type { FileListItem } from '@mntn-dev/file-service/client'
import type { UseUploadWidgetProps } from '@mntn-dev/files-adapter-client'
import type { ThumbnailProps } from '@mntn-dev/ui-components'

export type FileThumbnailEditableProps = {
  canUpload: true
  uploadWidgetProps: Pick<
    UseUploadWidgetProps,
    | 'fileArea'
    | 'category'
    | 'folderUrn'
    | 'onAfterUpload'
    | 'onQueuesStart'
    | 'options'
  >
}

export type FileThumbnailReadonlyProps = {
  canUpload: false
  uploadWidgetProps?: never
}

export type FileThumbnailCanUploadProps =
  | FileThumbnailEditableProps
  | FileThumbnailReadonlyProps

export type FileThumbnailFile = Partial<
  Pick<FileListItem, 'fileId' | 'name' | 'category'>
>

export type FileThumbnailBaseProps = SetOptional<
  Omit<ThumbnailProps, 'src' | 'image'>,
  'alt'
> & {
  file?: FileThumbnailFile
}

export type FileThumbnailEditorProps = Omit<
  FileThumbnailBaseProps,
  'canUpload'
> &
  FileThumbnailEditableProps & {
    waiting?: boolean
  }

export type FileThumbnailProps = Omit<FileThumbnailBaseProps, 'canUpload'> &
  FileThumbnailCanUploadProps
