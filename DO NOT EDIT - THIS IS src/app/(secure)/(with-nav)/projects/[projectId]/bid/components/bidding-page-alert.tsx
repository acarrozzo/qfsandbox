import type { SelectBidOutput } from '@mntn-dev/bid-service'
import { Alert } from '@mntn-dev/ui-components'

import { useMe } from '~/hooks/secure/use-me.ts'

export const BiddingPageAlert = ({ bid }: { bid: SelectBidOutput }) => {
  const { me } = useMe()

  if (bid.acl.canSubmitBid) {
    return
  }

  const userIsPartOfAgencyTeam = me.teams.some(
    (team) => team.teamId === bid.agencyTeamId
  )
  const isBidExpiredOrDismissed = ['rejected', 'unsuccessful'].includes(
    bid.status
  )

  const getAlertText = () => {
    if (isBidExpiredOrDismissed) {
      return {
        title: 'You are viewing an expired or dismissed bid.',
      }
    }

    if (bid.status === 'submitted' && userIsPartOfAgencyTeam) {
      return { title: 'You are viewing your submitted bid.' }
    }

    if (bid.project.status === 'bidding_open') {
      return {
        title: 'Your project is still open for bids.',
        subTitle:
          'While you can view current bids, you will not be able to make a selection until the bidding deadline has passed.',
      }
    }

    if (bid.project.status === 'awarded' && !userIsPartOfAgencyTeam) {
      return {
        title: 'This project has been awarded to a Video Professional.',
        subTitle: 'You will be notified when they start the project.',
      }
    }
  }

  const alertText = getAlertText()

  if (!alertText) {
    return
  }

  return (
    <Alert
      dataTestId="bidding-page-alert"
      dataTrackingId="bidding-page-alert"
      type={isBidExpiredOrDismissed ? 'warning' : 'notice'}
    >
      <Alert.Main>
        <Alert.Indicator />
        <Alert.Details>
          <Alert.Title>{alertText.title}</Alert.Title>
          <Alert.Subtitle>{alertText.subTitle}</Alert.Subtitle>
        </Alert.Details>
      </Alert.Main>
    </Alert>
  )
}
