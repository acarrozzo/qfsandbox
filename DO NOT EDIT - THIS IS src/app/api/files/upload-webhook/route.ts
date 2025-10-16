export const dynamic = 'force-dynamic'

import { StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import { env } from '@mntn-dev/env'
import { FileService } from '@mntn-dev/file-service'
import { FileManager } from '@mntn-dev/files-adapter-server'
import {
  type CloudinaryUploadWebhookPayload,
  CloudinaryUploadWebhookPayloadSchema,
} from '@mntn-dev/files-shared'
import { s } from '@mntn-dev/session'
import { assertOk, convertToNumber } from '@mntn-dev/utilities'
import { getFilesApiBaseUrl } from '@mntn-dev/utilities-next-server'

import { ApiRouteLogger } from '~/app/api/api-route-logger.ts'

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.text()
    const payload = JSON.parse(body)

    const verified = await verifySignature(request.headers, body)

    if (!verified) {
      ApiRouteLogger.warn('upload webhook received invalid signature', {
        payload,
      })
      return new NextResponse(null, { status: StatusCodes.UNAUTHORIZED })
    }

    const uploadedFileInformation: CloudinaryUploadWebhookPayload =
      CloudinaryUploadWebhookPayloadSchema.parse(payload)

    ApiRouteLogger.debug('upload-webhook received', {
      uploadedFileInformation,
    })

    const fileId = uploadedFileInformation.metadata.external_id
    if (fileId) {
      const session = s.system
      const fileService = FileService(session, {
        filesApiBaseUrl: getFilesApiBaseUrl(),
      })
      const response = await fileService.completeUpload({ fileId })
      ApiRouteLogger.debug('upload webhook success', { response })
      return NextResponse.json(
        { file: assertOk(response) },
        { status: StatusCodes.OK }
      )
    }

    ApiRouteLogger.warn('upload webhook ended with file not found', {
      payload,
    })
    return new NextResponse(null, { status: StatusCodes.NOT_FOUND })
  } catch (error) {
    ApiRouteLogger.error('upload webhook returned error', {
      error,
      url: request.url,
      headers: Array.from(request.headers.entries()),
    })
    return NextResponse.json(
      { error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    )
  }
}

function verifySignature(headers: Headers, body: string): boolean {
  const fileManager = FileManager({
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
  })
  const timestamp = headers.get('X-Cld-Timestamp')
  const signature = headers.get('X-Cld-Signature')

  if (!(timestamp && signature)) {
    return false
  }

  const timestampNumber = convertToNumber(timestamp)
  const validFor = 60 * 60 // 1 hour
  const verified = fileManager.verifyNotificationSignature({
    body,
    timestamp: timestampNumber,
    signature,
    validFor,
  })
  return verified
}
