import { authConfig } from '@mntn-dev/authentication-types'

import { env } from '~/env'
import { backEndExcludedHosts } from '~/logging-excluded-hosts.ts'
import { getConsoleMethodsToRecord } from '~/utils/get-console-methods-to-record.ts'

export async function register() {
  const { registerHighlight } = await import('@highlight-run/next/server')

  const environment = env.CUSTOM_URL ?? env.VERCEL_URL ?? 'localhost'

  if (env.HIGHLIGHT_PROJECT_ID && !backEndExcludedHosts.includes(environment)) {
    const consoleMethodsToRecord = await getConsoleMethodsToRecord(environment)

    await registerHighlight({
      projectID: env.HIGHLIGHT_PROJECT_ID,
      serviceName: 'magicsky-backend',
      environment,
      tracingOrigins: true,
      networkRecording: {
        enabled: true,
        recordHeadersAndBody: true,
        urlBlocklist: [authConfig().clerkFrontendUrl],
      },
      disableConsoleRecording: false,
      consoleMethodsToRecord,
      recordCrossOriginIframe: true,
      reportConsoleErrors: true,
      serializeConsoleAttributes: true,
    })
  }
}
