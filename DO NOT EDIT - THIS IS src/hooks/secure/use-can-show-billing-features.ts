import { useFlags } from '@mntn-dev/flags-client'

import { useMe } from '~/hooks/secure/use-me.ts'

export const useCanShowBillingFeatures = () => {
  const { me } = useMe()
  const flags = useFlags()
  const { billing: billingFlag } = flags
  const [brandTeam] = me.organizationType === 'brand' ? (me.teams ?? []) : []
  const result = !!(billingFlag && brandTeam)
  return result
}
