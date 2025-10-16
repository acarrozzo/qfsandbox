'use client'

import type { FileId } from '@mntn-dev/domain-types'

import { useQueryPlan } from '~/hooks/use-query-plan'

export const useRefetchFile = () => {
  const queryPlan = useQueryPlan()

  return ({ fileId }: { fileId: FileId }) =>
    queryPlan
      .include(({ files }) => fileId && files.getFileById.refetch({ fileId }))
      .include(({ files }) => files.list.refetch())
      .apply()
}
