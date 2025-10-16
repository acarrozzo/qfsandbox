import type { TeamDomainQueryModel } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'

import type { AccountBladePublicProps } from '../../../../components/blade/account-blade.tsx'
import { TeamBlade as TeamBladeV1 } from './team-blade-v1'
import { TeamBlade as TeamBladeV2 } from './team-blade-v2'

type TeamBladeProps = AccountBladePublicProps & {
  team: TeamDomainQueryModel
  userCount?: number
}

export const TeamBlade = (props: TeamBladeProps) => {
  const { multipleBillingProfiles } = useFlags()

  if (multipleBillingProfiles) {
    return <TeamBladeV2 {...props} />
  }

  return <TeamBladeV1 {...props} />
}

TeamBlade.displayName = 'TeamBlade'
