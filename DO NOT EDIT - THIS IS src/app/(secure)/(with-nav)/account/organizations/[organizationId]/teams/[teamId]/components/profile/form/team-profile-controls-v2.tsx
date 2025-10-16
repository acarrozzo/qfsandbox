import type { TeamId } from '@mntn-dev/domain-types'
import { Stack } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { TeamMembersButton } from '~/components/team/team-members-button.tsx'
import { OrganizationTeamSelect } from '~/components/team/team-select.tsx'

type TeamProfileControlsProps = {
  multiTeam: boolean
  editing: boolean
  teamId: TeamId
  onTeamChange: (teamId: TeamId) => void
}

export const TeamProfileControls = ({
  multiTeam,
  editing,
  onTeamChange,
  teamId,
}: TeamProfileControlsProps) => {
  const [team] = trpcReactClient.teams.getTeamWithProfile.useSuspenseQuery(
    { teamId },
    { refetchOnMount: false }
  )

  const { organizationId } = team

  return (
    <>
      {multiTeam && (
        <Stack gap="2">
          <OrganizationTeamSelect
            disabled={editing}
            onChange={onTeamChange}
            value={teamId}
            organizationId={organizationId}
          />
          {team.acl.canUpdateTeam && (
            <TeamMembersButton
              organizationId={organizationId}
              count={team.users?.length}
            />
          )}
        </Stack>
      )}
    </>
  )
}
