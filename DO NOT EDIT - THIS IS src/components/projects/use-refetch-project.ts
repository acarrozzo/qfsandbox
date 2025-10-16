'use client'

import type { ProjectId, UserId } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export function useRefetchProject() {
  const utils = trpcReactClient.useUtils()

  const refetch = async (
    project: {
      projectId: ProjectId
      acceptorId?: UserId
    },
    opts: { deleted: boolean } = { deleted: false }
  ) => {
    await Promise.all([
      !opts.deleted && utils.projects.get.refetch(project.projectId),
      utils.projects.list.refetch({}),
    ])
  }

  return refetch
}
