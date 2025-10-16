import { StatusCodes } from 'http-status-codes'

import type { RouterContextType } from '@mntn-dev/app-navigation'
import { logoutUrl, route } from '@mntn-dev/app-routing'
import type { GetToken } from '@mntn-dev/authentication-client'
import { logger } from '@mntn-dev/logger'

import type { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export async function handleSessionChange(
  router: RouterContextType,
  trpcUtils: ReturnType<typeof trpcReactClient.useUtils>,
  getToken: GetToken
) {
  try {
    const response = await fetch(route('/api/auth/principal').toRelativeUrl(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getToken()}`,
      },
    })

    if (response.status === StatusCodes.UNAUTHORIZED) {
      logger.warn(
        `A fetch to /api/auth/principal resulted in a 401. This means the user is no longer authenticated. Redirecting to the login page.`
      )

      router.pushUrl(logoutUrl(window.location.href))
    } else if (response.status === StatusCodes.PRECONDITION_FAILED) {
      router.push(route('/disabled'))
    } else {
      trpcUtils.invalidate()
    }
  } catch (error) {
    logger.error('Unexpected error handling session change', { error })
  }
}
