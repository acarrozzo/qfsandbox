import { useQueryParams } from '@mntn-dev/app-navigation'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useDashboardTabs } from '~/app/(secure)/(with-nav)/dashboard/components/tabs/use-dashboard-tabs.ts'

import { getDashboardProjectsQueryInput } from '../helpers/get-dashboard-projects-query-input.ts'

export const useDashboardProjectsQuery = () => {
  const params = useQueryParams<'/dashboard'>()
  const { tabs } = useDashboardTabs()

  const projectsQuery = trpcReactClient.projects.list.useQuery(
    getDashboardProjectsQueryInput(params, tabs)
  )

  return projectsQuery
}

export const useDashboardProjectsSuspenseQuery = () => {
  const params = useQueryParams<'/dashboard'>()
  const { tabs } = useDashboardTabs()

  const [projects] = trpcReactClient.projects.list.useSuspenseQuery(
    getDashboardProjectsQueryInput(params, tabs)
  )

  return projects
}
