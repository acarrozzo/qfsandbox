import { useCallback } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectDomainSelectModel } from '@mntn-dev/domain-types'

export const useViewProjectDetails = () => {
  const router = useRouter()

  const viewProjectDetails = useCallback(
    ({ projectId }: Pick<ProjectDomainSelectModel, 'projectId'>) => {
      router.push(route('/projects/:projectId').params({ projectId }))
    },
    [router.push]
  )

  return viewProjectDetails
}
