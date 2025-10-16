import { z } from 'zod'

import { UserAuthConnectionSchema } from '@mntn-dev/domain-types'

import type { TrpcFetchClient } from '~/app/_trpc/trpc-react-client.ts'

export const FetchUserAuthConnectionSchema = z.object({
  authConnection: UserAuthConnectionSchema,
})

export const fetchUserAuthConnection = async (
  trpcFetchClient: TrpcFetchClient,
  emailAddress: string
) => {
  const authConnection =
    await trpcFetchClient.public.getConnectionByEmail.query(emailAddress)

  const result = { authConnection }
  return result
}
