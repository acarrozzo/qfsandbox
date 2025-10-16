'use client'

import type { ProjectDetailsUpdateFormModel } from '@mntn-dev/app-form-schemas'
import type { ProjectId } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefetchProject } from '~/components/projects/use-refetch-project.ts'
import { useDebouncedCallback } from '~/utils/use-debounced-callback.ts'

export const useDebouncedUpdateProject = (projectId: ProjectId) => {
  const update = trpcReactClient.projects.update.useMutation()
  const refetchProject = useRefetchProject()

  const debouncedUpdate = useDebouncedCallback(
    async (updates: ProjectDetailsUpdateFormModel) => {
      const updatedProject = await update.mutateAsync({
        projectId,
        updates,
      })
      await refetchProject(updatedProject)
    },
    { postpone: update.isPending }
  )

  return {
    debouncedUpdate,
    isError: update.isError,
    isPending: update.isPending,
  }
}
