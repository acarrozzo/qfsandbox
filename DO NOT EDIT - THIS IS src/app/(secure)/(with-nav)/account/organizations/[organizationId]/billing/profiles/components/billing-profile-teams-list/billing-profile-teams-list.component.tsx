import { TeamsList } from '~/app/(secure)/(with-nav)/account/organizations/components/teams-list/teams-list.component.tsx'

import {
  type BillingProfileTeamsListProps,
  useBillingProfileTeamsList,
} from './billing-profile-teams-list.hook.ts'

export const BillingProfileTeamsList = ({
  billingProfileId,
  organizationId,
}: BillingProfileTeamsListProps) => {
  const {
    buttonText,
    isBusy,
    teams,
    title,

    handleClickToTeams,
    handleTeamClicked,
  } = useBillingProfileTeamsList({ billingProfileId, organizationId })

  return (
    <TeamsList
      title={title}
      buttonText={buttonText}
      teams={teams}
      isBusy={isBusy}
      onClickToTeams={handleClickToTeams}
      onTeamClicked={handleTeamClicked}
    />
  )
}
