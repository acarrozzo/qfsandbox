'use client'

import { useCallback, useMemo } from 'react'

import { SidebarLayoutFooter } from '@mntn-dev/ui-components'

import { useInitialProjectQueryData } from '#projects/providers/project-initial-data-provider.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { getProjectFooter } from './get-project-footer.tsx'

type ProjectFooterProps = Readonly<{ formId?: string }>

export const ProjectFooter = ({ formId }: ProjectFooterProps) => {
  const initialData = useInitialProjectQueryData()
  const projectId = initialData.project.projectId

  const projectQuery = trpcReactClient.projects.get.useQuery(projectId, {
    initialData: { project: initialData.project },
  })

  const { data: projectServices } =
    trpcReactClient.projects.getProjectServicesByProjectId.useQuery(projectId, {
      initialData: initialData.services,
    })

  const {
    data: { project },
  } = projectQuery

  const { hasPermission } = usePermissions()

  const onSubmitChange = useCallback(() => {
    projectQuery.refetch()
  }, [projectQuery])

  const footer = useMemo(
    () =>
      getProjectFooter(
        project,
        projectServices,
        hasPermission,
        formId,
        onSubmitChange
      ),
    [project, projectServices, hasPermission, formId, onSubmitChange]
  )

  return footer ? <SidebarLayoutFooter>{footer}</SidebarLayoutFooter> : null
}
