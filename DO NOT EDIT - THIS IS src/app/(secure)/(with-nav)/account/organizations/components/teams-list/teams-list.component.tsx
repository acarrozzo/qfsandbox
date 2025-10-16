import type { TeamDomainQueryModel, TeamId } from '@mntn-dev/domain-types'
import { Button, Stack } from '@mntn-dev/ui-components'

import { TeamBlade } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/teams/components/team-blade.tsx'

import { TeamListTitle, type TeamTitle } from './teams-list-title.component.tsx'

type TeamsListProps = {
  title: TeamTitle
  buttonText: string
  teams: TeamDomainQueryModel[]
  isBusy: boolean
  onClickToTeams: () => void
  onTeamClicked: (teamId: TeamId) => () => void
}

export const TeamsList = ({
  title,
  buttonText,
  teams,
  isBusy,
  onTeamClicked,
  onClickToTeams,
}: TeamsListProps) => {
  return (
    <Stack direction="col" gap="2">
      <Stack alignItems="center">
        <TeamListTitle title={title} />
        <div className="flex-grow" />
        <Button
          variant="secondary"
          iconRight="arrow-right"
          onClick={onClickToTeams}
          disabled={isBusy}
        >
          {buttonText}
        </Button>
      </Stack>
      <Stack direction="col" gap="2">
        {teams?.map((team) => (
          <TeamBlade
            key={team.teamId}
            team={team}
            onClick={onTeamClicked(team.teamId)}
            disabled={isBusy}
          />
        ))}
      </Stack>
    </Stack>
  )
}
