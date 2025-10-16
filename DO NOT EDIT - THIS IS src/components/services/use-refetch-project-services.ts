'use client'

import type { ProjectId, ProjectServiceId } from '@mntn-dev/domain-types'

import { useQueryPlan } from '~/hooks/use-query-plan'

export const useRefetchProjectServices = ({
  projectId,
  projectServiceId,
}: {
  projectId: ProjectId
  projectServiceId?: ProjectServiceId
}) => {
  const queryPlan = useQueryPlan()

  return () =>
    queryPlan

      .include(({ projects }) =>
        projects.getProjectServicesByProjectId.refetch(projectId)
      )

      .include(
        ({ projects }) =>
          projectServiceId &&
          projects.getProjectServiceByIdWithProject.refetch(projectServiceId)
      )

      .apply()
}
