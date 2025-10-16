import { isFileTaggingFailedStatus } from '@mntn-dev/domain-types'

import type { ViewableFile } from '#components/files/viewer/types.ts'
import {
  getFileDownloadProxyUrl,
  saveFileToClient,
} from '~/utils/client/file-utilities.ts'

export const handleFileDownload = async (file: ViewableFile) => {
  const downloadUrl = getFileDownloadProxyUrl({ fileId: file.fileId })
  await saveFileToClient({
    downloadUrl,
    fileKinds: file?.category && [file.category],
    suggestedName: file?.name ?? file.fileId,
  })
}

export const fileProcessingAwaitingCompletion = (file: ViewableFile) => {
  return file.taggingStatus && file.taggingStatus !== 'complete'
}

export const fileProcessingFailed = (file: ViewableFile) => {
  return isFileTaggingFailedStatus(file.taggingStatus)
}
