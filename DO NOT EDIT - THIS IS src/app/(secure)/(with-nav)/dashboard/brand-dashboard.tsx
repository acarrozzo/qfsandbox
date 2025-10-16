import { Suspense } from 'react'

import type { ExtractQueryParams } from '@mntn-dev/app-routing'

import { ProjectListLoading } from '#components/projects/project-list/project-list-loading.tsx'
import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { DashboardToolbar } from './components/dashboard-toolbar.tsx'
import { BrandHighlightedProjects } from './components/highlighted-projects/brand-highlighted-projects.tsx'
import { HighlightedProjectsLoading } from './components/highlighted-projects/highlighted-projects-loading.tsx'
import { MyProjectsList } from './components/my-projects/my-projects-list.tsx'
import { MyProjectsSection } from './components/my-projects/my-projects-section.tsx'
import { getServerDashboardTabs } from './components/tabs/get-server-dashboard-tabs.ts'
import { getDashboardProjectsQueryInput } from './helpers/get-dashboard-projects-query-input.ts'
import {
  getShowHighlights,
  getShowProjects,
  getTabTypes,
} from './helpers/tabs.ts'

type Props = {
  params: ExtractQueryParams<'/dashboard'>
}

export default async function BrandDashboard({ params }: Props) {
  const tabs = await getServerDashboardTabs()
  const tab = params.tab ?? 'all'

  const { tabTypes } = getTabTypes(tabs, tab)

  const showHighlights = getShowHighlights(tabTypes)
  const showProjects = getShowProjects(tabTypes)

  trpcServerSideClient.projects.list.prefetch(
    getDashboardProjectsQueryInput(params, tabs)
  )

  trpcServerSideClient.projects.getBrandHighlightedProjectsList.prefetch()

  return (
    <HydrateClient>
      <DashboardToolbar />
      <div className="w-full flex flex-col gap-y-16">
        {showHighlights && (
          <Suspense fallback={<HighlightedProjectsLoading />}>
            <BrandHighlightedProjects />
          </Suspense>
        )}
        {showProjects && (
          <MyProjectsSection>
            <Suspense fallback={<ProjectListLoading />}>
              <MyProjectsList />
            </Suspense>
          </MyProjectsSection>
        )}
      </div>
    </HydrateClient>
  )
}
