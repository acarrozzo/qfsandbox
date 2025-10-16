import 'server-only'

import { cache } from 'react'
import { createHydrationHelpers } from '@trpc/react-query/rsc'

import { type AppRouter, appRouter, createCallerFactory } from '@mntn-dev/api'
import { getApiBaseUrl } from '@mntn-dev/utilities-next-server'

import { env } from '~/env.js'

import { getQueryClient } from './query-client.ts'

const createServerSideTRPCContext = cache(async () => ({
  config: {
    launchDarklySdkKey: env.LAUNCHDARKLY_SDK_KEY,
    filesApiBaseUrl: `${getApiBaseUrl()}/files`,
    financeManagerProvider: env.MNTN_FINANCE_MANAGER_PROVIDER,
  },
}))

const getCachedQueryClient = cache(getQueryClient)

const caller = createCallerFactory(appRouter)(createServerSideTRPCContext)

export const { trpc: trpcServerSideClient, HydrateClient } =
  createHydrationHelpers<AppRouter>(caller, getCachedQueryClient)
