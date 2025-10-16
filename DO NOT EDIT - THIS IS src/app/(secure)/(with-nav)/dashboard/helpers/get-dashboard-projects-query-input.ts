import type { ExtractQueryParams } from '@mntn-dev/app-routing'
import type { GetProjectListInput } from '@mntn-dev/project-service'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import type { DashboardTab } from '../components/tabs/types.ts'

export const getDashboardProjectsQueryInput = (
  params: ExtractQueryParams<'/dashboard'>,
  tabs: DashboardTab[]
): GetProjectListInput => {
  const tab = tabs
    .filter((tab) => tab.element === 'tab')
    .find(
      (tab) => tab.id === (params.tab || 'all') && tab.type.includes('projects')
    )

  const { projectStatuses } = tab ?? {}

  return {
    where: {
      organizationId: params.organizationId || undefined,
      statuses: isNonEmptyArray(projectStatuses) ? projectStatuses : undefined,
      search: params.search || undefined,
    },
    orderBy: params.sortBy
      ? {
          column: params.sortBy,
          direction: params.sortDir || 'asc',
        }
      : undefined,
  }
}
