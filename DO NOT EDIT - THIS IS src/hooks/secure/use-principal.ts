import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const usePrincipal = () => {
  const { data: principal } =
    trpcReactClient.session.principal.useQuery(undefined)

  /**
   * This asserts `principal` should always be present in the cache.
   * Normally we could do `useSuspenseQuery()`, but this approach allows us to craft a more specific error message if misused.
   *
   * We are trusting the following:
   * 1. `usePrincipal()` is being rendered by a component under the (secure) route group.
   * 2. The (secure) route group layout is hydrating `me` into the react-query cache.
   */
  if (!principal) {
    throw new Error(
      'usePrincipal: no principal found. Only supported under the (secure) route group.'
    )
  }

  return { principal }
}
