import { Suspense } from 'react'

import type { ExtractQueryParams } from '@mntn-dev/app-routing'
import { s } from '@mntn-dev/session'
import { Divider } from '@mntn-dev/ui-components'

import { ProjectListLoading } from '#components/projects/project-list/project-list-loading.tsx'
import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { DashboardToolbar } from './components/dashboard-toolbar.tsx'
import { AgencyHighlightedProjects } from './components/highlighted-projects/agency-highlighted-projects.tsx'
import { HighlightedProjectsLoading } from './components/highlighted-projects/highlighted-projects-loading.tsx'
import { MyProjectsList } from './components/my-projects/my-projects-list.tsx'
import { MyProjectsSection } from './components/my-projects/my-projects-section.tsx'
import { AgencyOnboarding } from './components/onboarding/agency/agency-onboarding.tsx'
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

export default async function AgencyDashboard({ params }: Props) {
  const session = await s.getAuthorizedSessionOrLogout()
  const tabs = await getServerDashboardTabs()
  const tab = params.tab ?? 'all'

  const { tabTypes } = getTabTypes(tabs, tab)

  const organization = await trpcServerSideClient.organizations.getOrganization(
    { organizationId: session.authz.organizationId }
  )

  const isOnboarded = organization.onboarding.status === 'onboarded'

  const showHighlights = isOnboarded && getShowHighlights(tabTypes)
  const showProjects = isOnboarded && getShowProjects(tabTypes)

  trpcServerSideClient.projects.list.prefetch(
    getDashboardProjectsQueryInput(params, tabs)
  )

  trpcServerSideClient.projects.getAgencyHighlightedProjectsList.prefetch()

  return (
    <HydrateClient>
      {isOnboarded ? (
        <>
          <DashboardToolbar />
          <div className="w-full flex flex-col gap-y-8">
            {showProjects && (
              <MyProjectsSection>
                <Suspense fallback={<ProjectListLoading />}>
                  <MyProjectsList />
                </Suspense>
              </MyProjectsSection>
            )}
            {showProjects && showHighlights && <Divider />}
            {showHighlights && (
              <Suspense fallback={<HighlightedProjectsLoading />}>
                <AgencyHighlightedProjects />
              </Suspense>
            )}
          </div>
        </>
      ) : (
        <>
          <AgencyOnboarding />
          <Suspense fallback={<ProjectListLoading />}>
            <MyProjectsList emptyState={null} />
          </Suspense>
        </>
      )}
    </HydrateClient>
  )
}
