import { useRouter } from '@mntn-dev/app-navigation'
import { logoutUrl } from '@mntn-dev/app-routing'
import { hasMultipleTeams, hasTeams } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

/**
 * Custom error class for when a user is not found in the cache
 */
export class UserNotFoundError extends Error {
  constructor(message = 'User not found in cache') {
    super(message)
    this.name = 'UserNotFoundError'
  }
}

export const useMe = () => {
  const { pushUrl } = useRouter()
  const { data: me, refetch: refetchMe } =
    trpcReactClient.users.getMe.useQuery(undefined)

  /**
   * This asserts `me` should always be present in the cache.
   * Normally we could do `useSuspenseQuery()`, but this approach allows us to craft a more specific error message if misused.
   *
   * We are trusting the following:
   * 1. `useMe()` is being rendered by a component under the (secure) route group.
   * 2. The (secure) route group layout is hydrating `me` into the react-query cache.
   */
  if (!me) {
    logger.error('useMe: no user found in cache.')
    // Navigate to login but also throw error for error boundary to catch
    pushUrl(logoutUrl(window.location.href))
    throw new UserNotFoundError(
      'User session data not found in cache. This may be due to an expired or invalid session.'
    )
  }

  return {
    me,
    refetchMe,
    meOnATeam: hasTeams(me),
    meOnMultipleTeams: hasMultipleTeams(me),
  }
}

// This should replace above useMe eventually..
export const useMeSuspense = () => {
  const [me] = trpcReactClient.users.getMe.useSuspenseQuery()
  return me
}
