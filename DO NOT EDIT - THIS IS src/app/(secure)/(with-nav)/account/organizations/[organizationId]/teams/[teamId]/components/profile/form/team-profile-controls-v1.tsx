import type { OrganizationId, TeamId } from '@mntn-dev/domain-types'
import type { GetTeamWithProfileOutput } from '@mntn-dev/team-service/client'
import { Stack } from '@mntn-dev/ui-components'

import { TeamMembersButton } from '~/components/team/team-members-button.tsx'
import { OrganizationTeamSelect } from '~/components/team/team-select.tsx'

type TeamProfileControlsProps = {
  multiTeam: boolean
  editing: boolean
  onTeamChange: (teamId: TeamId) => void
  teamId: TeamId
  organizationId: OrganizationId
  team: GetTeamWithProfileOutput
}

export const TeamProfileControls = ({
  multiTeam,
  editing,
  onTeamChange,
  teamId,
  organizationId,
  team,
}: TeamProfileControlsProps) => {
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
