import { createTRPCReact } from '@trpc/react-query'

import type { AppRouter } from '@mntn-dev/api'

export const trpcReactClient = createTRPCReact<AppRouter>()

export type TrpcUtils = ReturnType<typeof trpcReactClient.useUtils>

export type TrpcFetchClient = TrpcUtils['client']
