import { useFlags } from '@mntn-dev/flags-client'

import { useMe } from '~/hooks/secure/use-me.ts'

export const useCanShowPaymentsFeatures = () => {
  const { me } = useMe()
  const { payments: paymentsFlag } = useFlags()
  const [agencyTeam] = me.organizationType === 'agency' ? (me.teams ?? []) : []
  const result = !!(paymentsFlag && agencyTeam)
  return result
}
