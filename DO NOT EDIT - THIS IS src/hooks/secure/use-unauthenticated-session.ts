import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const useUnauthenticatedSession = () => {
  const [unauthenticatedSession] =
    trpcReactClient.session.unauthenticatedSession.useSuspenseQuery(undefined)

  if (!unauthenticatedSession) {
    throw new Error(
      'Unauthenticated session is not available. Are you prefetching it?'
    )
  }

  return unauthenticatedSession
}
