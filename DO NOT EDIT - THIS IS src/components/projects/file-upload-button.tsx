import 'react'

import type { FileArea, FileCategory, FolderUrn } from '@mntn-dev/domain-types'
import type { AfterUploadHandler } from '@mntn-dev/files-adapter-client'
import type { UploadHookOptions } from '@mntn-dev/files-shared'
import { Button, type ButtonProps } from '@mntn-dev/ui-components'

import { useUploadWidget } from '~/app/file-tools.ts'

type Props = ButtonProps & {
  category?: FileCategory
  fileArea: FileArea
  folderUrn: FolderUrn
  onAfterUpload?: AfterUploadHandler
  options?: Omit<UploadHookOptions, 'cloudName' | 'folder' | 'showPoweredBy'>
}

export const FileUploadButton = ({
  category,
  fileArea,
  folderUrn,
  onAfterUpload,
  options,
  ...rest
}: Props) => {
  const { open, isReady } = useUploadWidget({
    fileArea,
    category,
    folderUrn,
    onAfterUpload,
    options: {
      sources: ['local', 'url', 'dropbox', 'google_drive'],
      ...options,
    },
  })

  const handleAddFileClick = () => {
    open()
  }

  return (
    <div>
      {isReady && (
        <Button
          onClick={handleAddFileClick}
          dataTestId="file-upload-button"
          dataTrackingId="file-upload-button"
          {...rest}
        />
      )}
    </div>
  )
}
