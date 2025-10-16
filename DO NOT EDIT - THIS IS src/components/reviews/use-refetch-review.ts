'use client'

import type { ProjectId, ProjectServiceId } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export function useRefetchReview() {
  const utils = trpcReactClient.useUtils()

  const refetchPostProductionReview = async (projectId: ProjectId) => {
    await utils.reviews.postProduction.selectReview.refetch({
      projectId,
    })
  }

  const refetchPreProductionReview = async (
    projectServiceId: ProjectServiceId
  ) => {
    await utils.reviews.preProduction.selectReview.refetch({
      projectServiceId,
    })
  }

  return { refetchPostProductionReview, refetchPreProductionReview }
}
