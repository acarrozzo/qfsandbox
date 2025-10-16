'use client'

import { useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { BidDomainQueryModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { logger } from '@mntn-dev/logger'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import { FooterContent, useToast } from '@mntn-dev/ui-components'
import { first, isNonEmptyArray } from '@mntn-dev/utilities'

import { useRefetchProject } from '#components/projects/use-refetch-project.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { MakerProjectBiddingButtons } from '~/components/projects/footers/components/maker-project-bidding-buttons'

import { ProjectSummary } from './components/project-summary.tsx'

type Props = {
  project: ProjectWithAcl
  projectServices: ProjectServiceWithAcl[]
}

export const MakerProjectBiddingFooter = ({
  project,
  projectServices,
}: Props) => {
  const { bids, projectId, name } = project

  const router = useRouter()
  const { t } = useTranslation(['project-footer', 'toast'])
  const { showToast } = useToast()
  const refetchProject = useRefetchProject()

  const existingBid = isNonEmptyArray(bids) ? first(bids) : undefined

  const acceptOpportunityToBid =
    trpcReactClient.bids.acceptOpportunityToBid.useMutation()

  const declineOpportunityToBid =
    trpcReactClient.bids.declineOpportunityToBid.useMutation()

  const updateBid = trpcReactClient.bids.updateBid.useMutation()

  const handleAcceptOpportunityToBid = async () => {
    try {
      const { bid } = await acceptOpportunityToBid.mutateAsync({
        projectId,
      })

      await refetchProject(project)

      handleViewBid(bid)
    } catch (err) {
      logger.error(
        `Failed to accept opportunity to bid for project ${projectId}`,
        {
          err,
        }
      )
    }
  }

  const handleDeclineOpportunityToBid = async () => {
    try {
      await declineOpportunityToBid.mutateAsync({
        projectId,
      })

      await refetchProject(project)

      showToast.info({
        title: t('toast:bidding.dismissed.title'),
        body: t('toast:bidding.dismissed.body', { project: name }),
        dataTestId: 'bidding-dismissed-info-toast',
        dataTrackingId: 'bidding-dismissed-info-toast',
      })
    } catch (err) {
      logger.error(
        `Failed to decline opportunity to bid for project ${projectId}`,
        { err }
      )
    }
    router.push(route('/dashboard'))
  }

  const handleMoveBidToDraft = async () => {
    try {
      if (existingBid) {
        const updatedBid = await updateBid.mutateAsync({
          bidId: existingBid.bidId,
        })
        handleViewBid(updatedBid.bid)
      }
    } catch (err) {
      logger.error(
        `Failed to move bid to draft status for project ${projectId}`,
        { err }
      )
    }
  }

  const handleViewBid = (bid: BidDomainQueryModel) => {
    router.push(
      route(
        `/projects/:projectId/bid/:bidId${bid.status === 'draft' ? '/edit' : ''}`
      ).params({
        projectId: project.projectId,
        bidId: bid.bidId,
      })
    )
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: refetch on mount
  useEffect(() => {
    refetchProject(project)
  }, [])

  return (
    <FooterContent justifyContent="between">
      <ProjectSummary project={project} projectServices={projectServices} />

      <div className="flex flex-col gap-2 w-[270px]">
        <MakerProjectBiddingButtons
          existingBid={existingBid}
          onViewBid={handleViewBid}
          onAcceptOpportunityToBid={handleAcceptOpportunityToBid}
          onDeclineOpportunityToBid={handleDeclineOpportunityToBid}
          onMoveBidToDraft={handleMoveBidToDraft}
          acceptOpportunityPending={acceptOpportunityToBid.isPending}
          declineOpportunityPending={declineOpportunityToBid.isPending}
          updateBidPending={updateBid.isPending}
        />
      </div>
    </FooterContent>
  )
}
