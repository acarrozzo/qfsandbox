import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const useAuthenticatedSession = () => {
  const [authenticatedSession] =
    trpcReactClient.session.authenticatedSession.useSuspenseQuery(undefined)

  if (!authenticatedSession) {
    throw new Error(
      'Authenticated session is not available. You are either not logged in or the page is not prefetching it.'
    )
  }

  return authenticatedSession
}
