import { keepPreviousData } from '@tanstack/react-query'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const useDashboardAgencyHighlightsQuery = ({
  enabled = true,
}: {
  enabled?: boolean
} = {}) => {
  const highlightsQuery =
    trpcReactClient.projects.getAgencyHighlightedProjectsList.useQuery(
      undefined,
      {
        enabled,
        placeholderData: keepPreviousData,
      }
    )

  return highlightsQuery
}

export const useDashboardAgencyHighlightsSuspenseQuery = () => {
  const [projects] =
    trpcReactClient.projects.getAgencyHighlightedProjectsList.useSuspenseQuery(
      undefined
    )

  return projects
}
