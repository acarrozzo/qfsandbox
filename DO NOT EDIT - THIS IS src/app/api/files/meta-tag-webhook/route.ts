export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import {
  type FileMetaTagCompletePayload,
  sendAsyncEvent,
} from '@mntn-dev/async-event-service'
import { getLogMessage } from '@mntn-dev/errors'
import { FileService } from '@mntn-dev/file-service'
import {
  MetaTagWebhookErrorSchema,
  MetaTagWebhookInputSchema,
} from '@mntn-dev/files-shared'
import { s } from '@mntn-dev/session'
import { assertMaybe, assertOk, isOk } from '@mntn-dev/utilities'
import { getFilesApiBaseUrl } from '@mntn-dev/utilities-next-server'

import { ApiRouteLogger } from '~/app/api/api-route-logger.ts'

const getTagFileCompletePayload = (
  input: unknown
): FileMetaTagCompletePayload & { message: string } => {
  ApiRouteLogger.info('meta tag webhook received', { input })

  // input should be an ok or an err. If it's neither, this will throw an error
  const payload = assertMaybe(
    input,
    MetaTagWebhookInputSchema,
    MetaTagWebhookErrorSchema
  )

  return isOk(payload)
    ? {
        fileTaggingStatus: 'complete',
        projectId: payload.data.tags.projectUuid,
        fileId: payload.data.tags.assetFileUuid,
        message: 'meta tag webhook reported successful completion',
      }
    : {
        fileTaggingStatus: 'error',
        projectId: payload.error.projectId,
        fileId: payload.error.fileId,
        message: `meta tag webhook reported an error: ${payload.error.message}`,
      }
}

export const POST = async (request: NextRequest) => {
  try {
    const { message, ...tagFileCompletePayload } = getTagFileCompletePayload(
      await request.json()
    )

    ApiRouteLogger.info(message, tagFileCompletePayload)

    assertOk(
      await FileService(s.system, {
        filesApiBaseUrl: getFilesApiBaseUrl(),
      }).setTaggingStatus(tagFileCompletePayload)
    )

    await sendAsyncEvent(s.system, {
      topic: 'file.metatag.complete',
      payload: tagFileCompletePayload,
    })

    // tell the lambda that it's ok, we took care of it
    return NextResponse.json(
      { message, ...tagFileCompletePayload },
      { status: StatusCodes.OK }
    )
  } catch (error) {
    ApiRouteLogger.error('meta tag webhook handler error', { error })

    // tell the lambda that something went wrong
    return NextResponse.json(
      { message: getLogMessage(error) },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}
