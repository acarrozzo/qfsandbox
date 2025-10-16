import type { NextRequest } from 'next/server'

import { FileId, UserIdSchema } from '@mntn-dev/domain-types'
import { FileService } from '@mntn-dev/file-service'
import { ImageTransformationOptionsSchema } from '@mntn-dev/files-shared'
import { s } from '@mntn-dev/session'
import { UserService } from '@mntn-dev/user-service'
import { assertOk, FilteredSchema } from '@mntn-dev/utilities'
import { getFilesApiBaseUrl } from '@mntn-dev/utilities-next-server'

const InputSchema = ImageTransformationOptionsSchema.extend({
  userId: UserIdSchema,
})

export const getAvatarProxyUrl = async (request: NextRequest) => {
  const session = s.system

  const paramObject = Object.fromEntries(request.nextUrl.searchParams)
  const params = FilteredSchema(InputSchema).parse(paramObject)
  const { userId: userIdParam, ...options } = params

  const userId = UserIdSchema.parse(userIdParam)
  const userService = UserService(session)
  const user = assertOk(await userService.getUser({ userId }))

  const fileId = FileId(user.avatarFileId)
  const fileService = FileService(session, {
    filesApiBaseUrl: getFilesApiBaseUrl(),
  })

  const url = assertOk(
    await fileService.getImageDownloadUrl({ fileId, options })
  )
  return url
}
