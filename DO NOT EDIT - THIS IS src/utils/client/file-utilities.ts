import { ClientFileUtilities } from '@mntn-dev/files-adapter-client'

import { getClientFilesApiUrl } from './get-url.ts'

export const {
  getAvatarProxyUrl,
  getFileImageProxyUrl,
  getFileDownloadProxyUrl,
  saveFileToClient,
} = ClientFileUtilities(getClientFilesApiUrl())
