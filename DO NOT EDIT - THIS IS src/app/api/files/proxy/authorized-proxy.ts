import type { NextRequest } from 'next/server'

import { FileIdSchema } from '@mntn-dev/domain-types'
import { FileService } from '@mntn-dev/file-service'
import type { GetImageDownloadUrlInput } from '@mntn-dev/files-shared'
import { PermissionService } from '@mntn-dev/permission-service'
import type { AuthorizedSession } from '@mntn-dev/session-types'
import { assertOk, FilteredSchema } from '@mntn-dev/utilities'
import { getFilesApiBaseUrl } from '@mntn-dev/utilities-next-server'

import { ApiRouteLogger } from '~/app/api/api-route-logger.ts'

import { InputSchema } from './types.ts'

export const authorizedFileProxy = async (
  request: NextRequest,
  session: AuthorizedSession
) => {
  try {
    const paramObject = Object.fromEntries(request.nextUrl.searchParams)

    const params = FilteredSchema(InputSchema).parse(paramObject)
    const { fileId: fileIdParam, ...options } = params
    const fileId = FileIdSchema.parse(fileIdParam)

    const permissionService = PermissionService(session)
    const fileAcl = await permissionService.getFileAcl(fileId)
    if (!fileAcl.canViewFile) {
      ApiRouteLogger.warn(
        'authorized files proxy - attempt to view file not allowed',
        {
          userId: session.profile.userId,
          fileId,
          options,
        }
      )

      return null
    }

    const fileService = FileService(session, {
      filesApiBaseUrl: getFilesApiBaseUrl(),
    })

    // `attachment` flag is used to return a asset download URL
    if (options.flags === 'attachment') {
      const downloadUrl = assertOk(
        await fileService.getAssetDownloadUrl({
          fileId,
          options: { format: options.format },
        })
      )
      ApiRouteLogger.debug(
        'authorized files proxy - asset download url result',
        {
          fileId,
          downloadUrl,
        }
      )

      return downloadUrl
    }

    const input: GetImageDownloadUrlInput = { fileId, options }

    return assertOk(await fileService.getImageDownloadUrl(input))
  } catch (error) {
    ApiRouteLogger.error('authorized proxy error', { error })
    throw error
  }
}
