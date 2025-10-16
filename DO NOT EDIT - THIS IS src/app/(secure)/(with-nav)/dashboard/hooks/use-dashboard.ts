import { useCallback, useMemo, useState } from 'react'

import { useQueryParams } from '@mntn-dev/app-navigation'
import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'

import { useMe } from '~/hooks/secure/use-me.ts'

import { useDashboardTabTypes } from '../components/tabs/use-dashboard-tabs.ts'
import { useDashboardProjectsQuery } from './use-dashboard-projects-query.ts'

export function useDashboard() {
  const {
    me: { organizationType, organization },
  } = useMe()
  const params = useQueryParams<'/dashboard'>()
  const tab = params.tab || 'all'
  // todo: update to check for count of total projects so we can disable tabs if no data
  const isEmpty = false
  const projectsQuery = useDashboardProjectsQuery()

  const [archiveProject, setArchiveProject] =
    useState<ProjectListItemServiceModel>()

  const showOnboarding = useMemo(
    () =>
      organization?.onboarding.status !== 'onboarded' &&
      organizationType === 'agency',
    [organization, organizationType]
  )

  const { tabTypes } = useDashboardTabTypes(tab)
  const showHighlights = useMemo(
    () => !showOnboarding && tabTypes.includes('highlights'),
    [tabTypes, showOnboarding]
  )
  const showProjects = useMemo(() => tabTypes.includes('projects'), [tabTypes])

  const handleCloseArchiver = useCallback(() => {
    setArchiveProject(undefined)
  }, [])

  const handleProjectArchived = useCallback(() => {
    projectsQuery.refetch()
    handleCloseArchiver()
  }, [projectsQuery, handleCloseArchiver])

  return {
    archiveProject,
    isEmpty,
    onProjectArchived: handleProjectArchived,
    onProjectArchiverClose: handleCloseArchiver,
    organizationType,
    organization,
    params,
    setArchiveProject,
    showHighlights,
    showProjects,
    showOnboarding,
    tab,
    tabTypes,
  }
}
