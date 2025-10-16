import { useMemo } from 'react'

import { PublicTagCategories } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const useTags = () => {
  const [allTags, { refetch: refetchTags }] =
    trpcReactClient.tags.discover.useSuspenseQuery({
      category: PublicTagCategories,
    })

  return useMemo(
    () => ({
      allTags,
      refetchTags,
    }),
    [allTags, refetchTags]
  )
}
