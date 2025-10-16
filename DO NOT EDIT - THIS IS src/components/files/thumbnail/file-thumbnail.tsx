'use client'

import { FileThumbnailBase } from './file-thumbnail-base.tsx'
import { FileThumbnailEditor } from './file-thumbnail-editor.tsx'
import type { FileThumbnailProps } from './types.ts'

export const FileThumbnail = (props: FileThumbnailProps) => {
  if (props.canUpload) {
    return <FileThumbnailEditor {...props} />
  }

  return <FileThumbnailBase {...props} />
}
