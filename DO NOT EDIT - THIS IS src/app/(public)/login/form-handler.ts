/**
 * Separates out the function used to handle form input on the login landing page.
 * It is separated out to make it easier to test.
 */

import { z } from 'zod'

import { logger } from '@mntn-dev/logger'
import type { ZodInfer } from '@mntn-dev/utility-types'

import type { TrpcFetchClient } from '~/app/_trpc/trpc-react-client.ts'

import { fetchUserAuthConnection } from './fetch-user.ts'
import { redirectToIdp } from './redirect-to-idp.ts'

export const formSchema = ({
  restrictedLogins = [],
  emailErrorMessage,
}: {
  restrictedLogins?: Array<string>
  emailErrorMessage: string
}) => {
  const emailAddress = z
    .string()
    .email()
    .refine((data) => {
      return (
        !restrictedLogins.length ||
        restrictedLogins.some(
          (restrictedLogin) =>
            (restrictedLogin.startsWith('@') &&
              data.endsWith(restrictedLogin)) ||
            restrictedLogin === data
        )
      )
    }, emailErrorMessage)

  return z.object({ emailAddress, returnTo: z.string().optional() })
}

export type FormSchemaType = ZodInfer<ReturnType<typeof formSchema>>

export const onSubmit = (
  trpcFetchClient: TrpcFetchClient,
  data: FormSchemaType
) => {
  return workForOnSubmit(trpcFetchClient, data).catch((err: unknown) => {
    logger.error('Unknown error while logging in:', { err })
    throw err
  })
}

export const workForOnSubmit = async (
  trpcFetchClient: TrpcFetchClient,
  data: { emailAddress: string; returnTo?: string }
) => {
  const { authConnection } = await fetchUserAuthConnection(
    trpcFetchClient,
    data.emailAddress
  )

  redirectToIdp(window, authConnection, data.emailAddress, data.returnTo)
}
