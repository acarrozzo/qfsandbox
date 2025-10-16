import { Suspense } from 'react'

import type { ExtractQueryParams } from '@mntn-dev/app-routing'

import { ProjectListLoading } from '#components/projects/project-list/project-list-loading.tsx'
import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { DashboardToolbar } from './components/dashboard-toolbar.tsx'
import { MyProjectsList } from './components/my-projects/my-projects-list.tsx'
import { getServerDashboardTabs } from './components/tabs/get-server-dashboard-tabs.ts'
import { getDashboardProjectsQueryInput } from './helpers/get-dashboard-projects-query-input.ts'

type Props = {
  params: ExtractQueryParams<'/dashboard'>
}

export default async function InternalDashboard({ params }: Props) {
  const tabs = await getServerDashboardTabs()

  trpcServerSideClient.projects.list.prefetch(
    getDashboardProjectsQueryInput(params, tabs)
  )
  trpcServerSideClient.organizations.listCompactOrganizations.prefetch({})

  return (
    <HydrateClient>
      <DashboardToolbar />
      <div className="w-full flex flex-col">
        <Suspense fallback={<ProjectListLoading />}>
          <MyProjectsList />
        </Suspense>
      </div>
    </HydrateClient>
  )
}
