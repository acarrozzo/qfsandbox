import { useEffect } from 'react'

import { Modal } from '@mntn-dev/ui-components'

import { CenteredLoadingSpinner } from '#components/shared/centered-loading-spinner.tsx'
import { useBidContext } from '#projects/[projectId]/bid/hooks/use-bid.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { AcceptBidConfirmationModal } from '~/app/(secure)/(with-nav)/projects/[projectId]/bid/[bidId]/accept-bid-modal/accept-bid-confirmation-modal'
import {
  checkForBillingSetupNeeded,
  getProjectCardCharge,
  getProjectCreditCharge,
  getProjectInvoiceCharge,
} from '~/utils/project/billing.ts'

import { AcceptBidSetupBillingModal } from './accept-bid-setup-billing-modal.tsx'

export const AcceptBidModal = ({
  open,
  onClose,
  onConfirm,
  confirmIsLoading,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  confirmIsLoading: boolean
}) => {
  const { bid, project } = useBidContext()
  const { data, refetch, isPending } =
    trpcReactClient.finance.getProjectFinanceBreakdown.useQuery({
      projectId: bid.project.projectId,
      chargeKind: 'preliminary',
      bidId: bid.bidId,
      withMargin: true,
    })

  const setupBillingType = checkForBillingSetupNeeded(project, data)

  useEffect(() => {
    if (project.chosenBillingMethod) {
      refetch()
    }
  }, [project.chosenBillingMethod, refetch])

  if (isPending) {
    return (
      <Modal open={open} onClose={onClose}>
        <CenteredLoadingSpinner />
      </Modal>
    )
  }

  if (!setupBillingType) {
    return (
      <AcceptBidConfirmationModal
        open={open}
        onClose={onClose}
        onConfirm={onConfirm}
        confirmIsLoading={confirmIsLoading}
        chargeToCredits={getProjectCreditCharge(project, data)}
        chargeToInvoice={getProjectInvoiceCharge(project, data)}
        chargeToCard={getProjectCardCharge(project, data)}
        totalDollars={data?.charges.current.total.dollars ?? 0}
        creditUnits={data?.creditUnits}
      />
    )
  }

  return (
    <AcceptBidSetupBillingModal
      open={open}
      onClose={onClose}
      setupType={setupBillingType}
    />
  )
}
