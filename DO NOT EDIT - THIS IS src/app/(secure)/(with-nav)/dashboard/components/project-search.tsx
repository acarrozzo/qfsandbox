'use client'

import { useQueryParams, useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { omit } from '@mntn-dev/utilities'

import { SearchBar } from '~/components/search/index.ts'

import { useDashboardProjectsQuery } from '../hooks/use-dashboard-projects-query.ts'

export const ProjectSearch = () => {
  const router = useRouter()
  const params = useQueryParams<'/dashboard'>()
  const projectsQuery = useDashboardProjectsQuery()

  return (
    <SearchBar
      postpone={projectsQuery.isFetching}
      onChange={(search) =>
        router.replace(
          route('/dashboard')
            .query({
              ...omit(params, ['search']),
              ...(search && { search }),
              ...(params.organizationId && {
                organizationId: params.organizationId,
              }),
            })
            .toRelativeUrl()
        )
      }
      defaultValue={params.search}
      dataTestId="project-search"
      dataTrackingId="project-search"
    />
  )
}
