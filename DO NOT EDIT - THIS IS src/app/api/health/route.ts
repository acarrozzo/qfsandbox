export const dynamic = 'force-dynamic'

import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { type NextRequest, NextResponse } from 'next/server'

import { env } from '@mntn-dev/env'
import { createFlagService } from '@mntn-dev/flags-server'
import { PublicService } from '@mntn-dev/public-service'
import { assertOk } from '@mntn-dev/utilities'

import { ApiRouteLogger } from '~/app/api/api-route-logger.ts'

const isMaintenanceMode = async () => {
  const { serverFlag } = await createFlagService(env.LAUNCHDARKLY_SDK_KEY)
  return await serverFlag('maintenance-mode')
}

export const GET = async (request: NextRequest) => {
  try {
    const {
      status,
      probes: { passed, degraded, failed, skipped },
    } = assertOk(await PublicService().health.check())

    // Make sure the platform is not in maintenance mode before
    // failing the health check and triggering monitoring alerts.
    const unavailable = status === 'failed' && !(await isMaintenanceMode())

    const code = unavailable ? StatusCodes.SERVICE_UNAVAILABLE : StatusCodes.OK

    ApiRouteLogger.info(`Health Check ${code} ${getReasonPhrase(code)}`, {
      probes: {
        ...(passed && { passed: Object.keys(passed) }),
        ...(degraded && { degraded: JSON.stringify(degraded) }),
        ...(failed && { failed: JSON.stringify(failed) }),
        skipped,
      },
    })

    return await NextResponse.json(
      { status, passed, degraded, failed },
      { status: code }
    )
  } catch (error) {
    ApiRouteLogger.error('Health check returned error', {
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
