'use client'

import type { ReactNode } from 'react'

import { env } from '@mntn-dev/env'
import { FlagsProvider as ClientSideFlagsProvider } from '@mntn-dev/flags-client'
import { FilteredLogger, Logger } from '@mntn-dev/logger'

const ldLogger = FilteredLogger(Logger('launch-darkly'))

const flagsServerUrls = env.NEXT_PUBLIC_LAUNCHDARKLY_DEV_SERVER_URL
  ? {
      streamUrl: env.NEXT_PUBLIC_LAUNCHDARKLY_DEV_SERVER_URL,
      baseUrl: env.NEXT_PUBLIC_LAUNCHDARKLY_DEV_SERVER_URL,
      eventsUrl: env.NEXT_PUBLIC_LAUNCHDARKLY_DEV_SERVER_URL,
    }
  : {}

type Props = {
  children: ReactNode
  clientSideID: string
  userKey?: string
  email?: string
  bootstrapFlags?: object
}

function FlagsProvider({
  children,
  clientSideID,
  userKey,
  email,
  bootstrapFlags,
}: Props) {
  return (
    <ClientSideFlagsProvider
      clientSideID={clientSideID}
      context={
        userKey
          ? {
              anonymous: false,
              key: userKey,
              email,
            }
          : {
              anonymous: true,
            }
      }
      options={
        bootstrapFlags
          ? {
              bootstrap: bootstrapFlags,
              ...flagsServerUrls,
              logger: ldLogger,
            }
          : {
              logger: ldLogger,
              ...flagsServerUrls,
            }
      }
    >
      {children}
    </ClientSideFlagsProvider>
  )
}

export default FlagsProvider
