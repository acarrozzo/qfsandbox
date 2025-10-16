'use client'

import type { TFunction } from 'i18next'
import { useEffect, useState } from 'react'

import type {
  QueuesStartEvent,
  UploadWidgetEventHandler,
} from '@mntn-dev/files-shared'
import { useTranslation } from '@mntn-dev/i18n'
import { useToast } from '@mntn-dev/ui-components'

import { useUploadWidget } from '~/app/file-tools.ts'

import { FileThumbnailBase } from './file-thumbnail-base.tsx'
import type { FileThumbnailEditorProps, FileThumbnailFile } from './types.ts'

const getFile = (t: TFunction<'file-thumbnail'>, file?: FileThumbnailFile) => {
  if (!file) {
    return undefined
  }
  return {
    fileId: file.fileId,
    category: file.category ?? 'image',
    name: file.name ?? t('default-file-name'),
  }
}

export const FileThumbnailEditor = ({
  uploadWidgetProps,
  file: fileProp,
  ...props
}: FileThumbnailEditorProps) => {
  const { t } = useTranslation('file-thumbnail')
  const { showToast } = useToast()

  const [file, setFile] = useState<FileThumbnailFile | undefined>(
    getFile(t, fileProp)
  )
  const [waiting, setWaiting] = useState(false)

  const { onQueuesStart, ...restUploadWidgetProps } = uploadWidgetProps

  const handleQueuesStart = (
    info: Parameters<UploadWidgetEventHandler<QueuesStartEvent>>[0]
  ) => {
    setWaiting(true)

    if (onQueuesStart) {
      onQueuesStart(info)
    }
  }

  useEffect(() => {
    if (fileProp?.fileId !== file?.fileId) {
      // file changed, quit waiting.
      setWaiting(false)
      setFile(getFile(t, fileProp))
    }
  }, [fileProp, file, t])

  const { open, isReady } = useUploadWidget({
    ...restUploadWidgetProps,
    onQueuesStart: handleQueuesStart,
  })

  const handleUploadClick = () => {
    if (!isReady) {
      showToast.warning({
        title: t('uploader-not-ready.title'),
        body: t('uploader-not-ready.body'),
        dataTestId: 'uploader-not-ready-toast',
        dataTrackingId: 'uploader-not-read-toast',
      })
      return
    }

    open()
  }

  return (
    <FileThumbnailBase
      {...props}
      file={file}
      waiting={waiting}
      canUpload={true}
      onUploadClick={handleUploadClick}
    />
  )
}
