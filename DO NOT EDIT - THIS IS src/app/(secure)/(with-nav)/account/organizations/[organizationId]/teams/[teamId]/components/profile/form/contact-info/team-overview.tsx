import { useFlags } from '@mntn-dev/flags-client'

import { TeamOverview as TeamOverviewV1 } from '../contact-info-v1/team-overview.tsx'
import { TeamOverview as TeamOverviewV2 } from '../contact-info-v2/team-overview.tsx'

const TeamOverview = () => {
  const { multipleBillingProfiles } = useFlags()

  if (multipleBillingProfiles) {
    return <TeamOverviewV2 />
  }

  return <TeamOverviewV1 />
}

export { TeamOverview }
