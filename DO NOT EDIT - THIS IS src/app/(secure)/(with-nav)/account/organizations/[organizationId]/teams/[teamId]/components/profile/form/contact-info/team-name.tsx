import { useFlags } from '@mntn-dev/flags-client'

import { TeamName as TeamNameV1 } from '../contact-info-v1/team-name.tsx'
import { TeamName as TeamNameV2 } from '../contact-info-v2/team-name.tsx'

const TeamName = () => {
  const { multipleBillingProfiles } = useFlags()

  if (multipleBillingProfiles) {
    return <TeamNameV2 />
  }

  return <TeamNameV1 />
}

export { TeamName }
