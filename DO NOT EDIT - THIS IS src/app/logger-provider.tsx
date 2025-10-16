import type { PropsWithChildren } from 'react'
import { HighlightInit } from '@highlight-run/next/client'

import { authConfig } from '@mntn-dev/authentication-types'
import { env } from '@mntn-dev/env'

import { frontEndExcludedHosts } from '~/logging-excluded-hosts.ts'
import { getConsoleMethodsToRecord } from '~/utils/get-console-methods-to-record.ts'

async function LoggerProvider({ children }: PropsWithChildren) {
  if (!env.HIGHLIGHT_PROJECT_ID) {
    return <>{children}</>
  }

  const environment = env.CUSTOM_URL ?? env.VERCEL_URL ?? 'localhost'
  const consoleMethodsToRecord = await getConsoleMethodsToRecord(environment)

  return (
    <>
      <HighlightInit
        projectId={env.HIGHLIGHT_PROJECT_ID}
        serviceName="magicsky-frontend"
        environment={environment}
        tracingOrigins
        networkRecording={{
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: [authConfig().clerkFrontendUrl],
        }}
        consoleMethodsToRecord={consoleMethodsToRecord}
        recordCrossOriginIframe={true}
        reportConsoleErrors={true}
        excludedHostnames={frontEndExcludedHosts}
      />
      {children}
    </>
  )
}

export default LoggerProvider
