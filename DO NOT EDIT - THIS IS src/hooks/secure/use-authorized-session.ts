import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const useAuthorizedSession = () => {
  const [authorizedSession] =
    trpcReactClient.session.authorizedSession.useSuspenseQuery(undefined)

  if (!authorizedSession) {
    throw new Error(
      'Authorized session is not available. You are either not logged in or the page is not prefetching it.'
    )
  }

  return authorizedSession
}
