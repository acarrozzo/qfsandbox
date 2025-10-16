import { keepPreviousData } from '@tanstack/react-query'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const useDashboardBrandHighlightsQuery = ({
  enabled = true,
}: {
  enabled?: boolean
} = {}) => {
  const highlightsQuery =
    trpcReactClient.projects.getBrandHighlightedProjectsList.useQuery(
      undefined,
      {
        enabled,
        placeholderData: keepPreviousData,
      }
    )

  return highlightsQuery
}

export const useDashboardBrandHighlightsSuspenseQuery = () => {
  const [projects] =
    trpcReactClient.projects.getBrandHighlightedProjectsList.useSuspenseQuery(
      undefined
    )

  return projects
}
