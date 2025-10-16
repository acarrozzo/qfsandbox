import type { ExtractQueryParams } from '@mntn-dev/app-routing'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

import { getServerDashboardTabs } from '../components/tabs/get-server-dashboard-tabs.ts'
import { getDashboardProjectsQueryInput } from './get-dashboard-projects-query-input.ts'

export const prefetchDashboardProjects = async (
  params: ExtractQueryParams<'/dashboard'>
) => {
  const tabs = await getServerDashboardTabs()

  await Promise.all([
    trpcServerSideClient.projects.list.prefetch(
      getDashboardProjectsQueryInput(params, tabs)
    ),
  ])
}
