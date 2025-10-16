import { StatusCodes } from 'http-status-codes'
import {
  type CreateTRPCClientOptions,
  httpBatchLink,
  loggerLink,
} from '@trpc/client'

import type { AppRouter } from '@mntn-dev/api'
import { logoutUrl, route } from '@mntn-dev/app-routing'
import type { GetToken } from '@mntn-dev/authentication-client'
import {
  AuthenticationError,
  isAuthenticationError,
  isPrincipalInactiveError,
  PrincipalInactiveError,
} from '@mntn-dev/errors'
import { transformer } from '@mntn-dev/utilities'

import { getClientRouteUrl } from '~/utils/client/get-url.ts'

import { errorLink } from './trpc-links.ts'
import { isTRPCClientError } from './utils.ts'

export const trpcClientConfig: (
  getToken: GetToken
) => CreateTRPCClientOptions<AppRouter> = (getToken) => ({
  links: [
    errorLink({
      onError: (error) => {
        if (isTRPCClientError(error) && typeof window !== 'undefined') {
          if (isAuthenticationError(error.cause)) {
            window.location.href = logoutUrl(window.location.href)
          }

          if (isPrincipalInactiveError(error.cause)) {
            window.location.href = route('/disabled').toRelativeUrl()
          }
        }
      },
    }),
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === 'development' ||
        (opts.direction === 'down' && opts.result instanceof Error),
      colorMode: 'none',
    }),
    httpBatchLink({
      transformer,
      url: getClientRouteUrl('api', 'trpc'),
      headers: async () => {
        try {
          const token = await getToken()
          return token ? { Authorization: `Bearer ${token}` } : {}
        } catch {
          return {}
        }
      },
      fetch: async (url, options) => {
        const res = await fetch(url, options as RequestInit)

        if (res.status === StatusCodes.UNAUTHORIZED) {
          throw new AuthenticationError('Session expired', {
            code: 'expired_session',
          })
        }

        if (res.status === StatusCodes.PRECONDITION_FAILED) {
          throw new PrincipalInactiveError('Principal is inactive')
        }

        return res
      },
    }),
  ],
})
