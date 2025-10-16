import type {
  BidDomainQueryModel,
  BidDomainSelectModel,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button } from '@mntn-dev/ui-components'

type MakerProjectBiddingButtonsProps = {
  existingBid?: BidDomainSelectModel
  onViewBid: (bid: BidDomainQueryModel) => void
  onAcceptOpportunityToBid: () => void
  onDeclineOpportunityToBid: () => void
  onMoveBidToDraft: () => void
  acceptOpportunityPending: boolean
  declineOpportunityPending: boolean
  updateBidPending: boolean
}

export const MakerProjectBiddingButtons = ({
  existingBid,
  onViewBid,
  onAcceptOpportunityToBid,
  onDeclineOpportunityToBid,
  onMoveBidToDraft,
  acceptOpportunityPending,
  declineOpportunityPending,
  updateBidPending,
}: MakerProjectBiddingButtonsProps) => {
  const { t } = useTranslation(['project-footer'])
  const bidIsDismissed = existingBid?.status === 'declined'

  if (bidIsDismissed) {
    return (
      <Button
        size="lg"
        variant="secondary"
        loading={updateBidPending}
        onClick={onMoveBidToDraft}
        className="w-full"
        dataTestId="maker-bidding-footer-previously-dismissed-now-interested-button"
        dataTrackingId="maker-bidding-footer-previously-dismissed-now-interested-button"
      >
        {t('project-footer:maker.project-bidding-footer.interested')}
      </Button>
    )
  }

  if (existingBid) {
    return (
      <Button
        size="lg"
        variant="secondary"
        onClick={() => onViewBid(existingBid)}
        dataTestId="maker-bidding-footer-view-bid-button"
        dataTrackingId="maker-bidding-footer-view-bid-button"
      >
        {existingBid.status === 'draft'
          ? t('project-footer:maker.project-bidding-footer.draft')
          : t('project-footer:maker.project-bidding-footer.submitted')}
      </Button>
    )
  }

  return (
    <>
      <Button
        size="lg"
        variant="primary"
        disabled={declineOpportunityPending}
        loading={acceptOpportunityPending}
        onClick={onAcceptOpportunityToBid}
        className="w-full"
        dataTestId="maker-bidding-footer-interested-button"
        dataTrackingId="maker-bidding-footer-interested-button"
      >
        {t('project-footer:maker.project-bidding-footer.interested')}
      </Button>
      <Button
        size="md"
        variant="text"
        loading={declineOpportunityPending}
        onClick={onDeclineOpportunityToBid}
        className="w-full"
        dataTestId="maker-bidding-footer-not-interested-button"
        dataTrackingId="maker-bidding-footer-not-interested-button"
      >
        {t('project-footer:maker.project-bidding-footer.not-interested')}
      </Button>
    </>
  )
}
