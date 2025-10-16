import { useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import type { GetProjectDetailsPayloadByIdOutput } from '@mntn-dev/project-service'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const useProjectDetailsPayload = (
  initialData: GetProjectDetailsPayloadByIdOutput
) => {
  const router = useRouter()
  const {
    mode: initialMode,
    project: { projectId },
  } = initialData

  const { data } =
    trpcReactClient.projects.getProjectDetailsPayloadById.useQuery(
      { projectId },
      { initialData }
    )

  const { mode } = data

  // Reload the project details page if our type of project access changed
  useEffect(() => {
    if (mode !== initialMode) {
      router.refresh()
    }
  }, [mode, router, initialMode])

  return data
}
