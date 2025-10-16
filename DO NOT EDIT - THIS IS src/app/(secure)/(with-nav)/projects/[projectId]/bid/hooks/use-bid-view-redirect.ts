import { useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { SelectBidOutput } from '@mntn-dev/bid-service'

export const useBidViewRedirect = (
  bid: SelectBidOutput,
  condition: boolean
) => {
  const router = useRouter()

  useEffect(() => {
    if (condition) {
      router.replace(
        route('/projects/:projectId/bid/:bidId')
          .params({
            projectId: bid.projectId,
            bidId: bid.bidId,
          })
          .toRelativeUrl()
      )
    }
  }, [condition, bid.bidId, bid.projectId, router])
}
