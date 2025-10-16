'use client'

import dynamic from 'next/dynamic'
import { type PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { type GetToken, useAuth } from '@mntn-dev/authentication-client'

import { getQueryClient } from './query-client.ts'
import { trpcClientConfig } from './trpc-client-config.ts'
import { trpcReactClient } from './trpc-react-client.ts'

declare global {
  interface Window {
    /**
     * Function to toggle React Query devtools in production.
     *
     * Usage: Open browser console and run `window.qfmp.toggleReactQueryDevtools()`
     * This will show/hide the production version of React Query devtools.
     *
     * Note: The development devtools are always visible in the top-right corner.
     * This function only controls the production devtools overlay.
     */
    qfmp: {
      toggleReactQueryDevtools?: () => void
    }
  }
}

const ReactQueryDevtoolsProduction = dynamic(
  () =>
    import('@tanstack/react-query-devtools/production').then((module) => ({
      default: module.ReactQueryDevtools,
    })),
  { ssr: false }
)

const useReactQueryDevtools = () => {
  const [showReactQueryDevtools, setShowReactQueryDevtools] = useState(false)

  useEffect(() => {
    window.qfmp = {
      toggleReactQueryDevtools: () =>
        setShowReactQueryDevtools((isShowing) => !isShowing),
    }
  }, [])

  return showReactQueryDevtools
}

const TrpcReactClientProvider = ({
  children,
  getToken,
}: PropsWithChildren<{ getToken: GetToken }>) => {
  const queryClient = useMemo(() => getQueryClient(), [])

  const trpcClient = useMemo(
    () => trpcReactClient.createClient(trpcClientConfig(getToken)),
    [getToken]
  )

  const showReactQueryDevtools = useReactQueryDevtools()

  return (
    <trpcReactClient.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
        {showReactQueryDevtools && (
          <ReactQueryDevtoolsProduction buttonPosition="top-right" />
        )}
      </QueryClientProvider>
    </trpcReactClient.Provider>
  )
}

export const TrpcReactProvider = ({ children }: PropsWithChildren) => {
  const { getToken } = useAuth()

  return (
    <TrpcReactClientProvider getToken={getToken}>
      {children}
    </TrpcReactClientProvider>
  )
}

export const Auth0TrpcReactProvider = ({ children }: PropsWithChildren) => {
  const getToken: GetToken = useMemo(() => () => Promise.resolve(null), [])

  return (
    <TrpcReactClientProvider getToken={getToken}>
      {children}
    </TrpcReactClientProvider>
  )
}
