import type { OrganizationId, TeamId } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'
import type { GetTeamWithProfileOutput } from '@mntn-dev/team-service/client'

import { TeamProfileControls as TeamProfileControlsV1 } from './team-profile-controls-v1.tsx'
import { TeamProfileControls as TeamProfileControlsV2 } from './team-profile-controls-v2.tsx'

type TeamProfileControlsProps = {
  multiTeam: boolean
  editing: boolean
  onTeamChange: (teamId: TeamId) => void
  teamId: TeamId
  organizationId: OrganizationId
  team: GetTeamWithProfileOutput
}

export const TeamProfileControls = (props: TeamProfileControlsProps) => {
  const { multipleBillingProfiles } = useFlags()
  if (multipleBillingProfiles) {
    return <TeamProfileControlsV2 {...props} />
  }

  return <TeamProfileControlsV1 {...props} />
}
