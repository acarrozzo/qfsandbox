'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ListBidOutput } from '@mntn-dev/bid-service/client'
import {
  BrandBidStatuses,
  type ProjectDomainQueryModel,
} from '@mntn-dev/domain-types'
import { DataGrid } from '@mntn-dev/ui-components'

import { useInitialProjectQueryData } from '#projects/providers/project-initial-data-provider.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client'

import { useProjectBidsTableColumnDefs } from './hooks/use-project-bids-table-column-defs.tsx'

export const ProjectBidsTable = ({
  project,
  hideBrandBidAmount,
}: {
  project: ProjectDomainQueryModel
  hideBrandBidAmount: boolean
}) => {
  const { bids: initialBids } = useInitialProjectQueryData()
  const router = useRouter()

  const { projectId } = project

  const bidsQuery = trpcReactClient.bids.listBids.useQuery(
    {
      projectId,
      status: BrandBidStatuses,
    },
    {
      initialData: { bids: initialBids ?? [] },
    }
  )

  const handleReviewBid = ({ projectId, bidId }: ListBidOutput) => {
    router.push(
      route('/projects/:projectId/bid/:bidId').params({
        projectId,
        bidId,
      })
    )
  }

  const columnDefs = useProjectBidsTableColumnDefs({
    hideBrandBidAmount,
    onReviewBid: handleReviewBid,
  })

  return (
    <DataGrid
      columnDefs={columnDefs}
      rowData={bidsQuery.data?.bids ?? []}
      onRowClick={handleReviewBid}
      dataTestId="project-bids-table"
      dataTrackingId="project-bids-table"
      emptyState="No bids yet!"
      settings={{
        grouping: {
          enabled: project.status === 'bidding_closed',
          rowGroups: [
            {
              order: 1,
              label: 'Preferred Bids',
              filter: (bid) => bid.isPreferred && bid.status === 'submitted',
              initialOpen: true,
              dataTestId: 'preferred-bids',
            },
            {
              order: 2,
              label: 'All Other Bids',
              filter: (bid) => !bid.isPreferred && bid.status === 'submitted',
              dataTestId: 'all-other-bids',
            },
            {
              order: 3,
              label: 'Dismissed Bids',
              filter: (bid) =>
                bid.status === 'rejected' ||
                bid.status === 'disqualified' ||
                bid.status === 'unsuccessful',
              dataTestId: 'dismissed-bids',
            },
          ],
        },
      }}
    />
  )
}
