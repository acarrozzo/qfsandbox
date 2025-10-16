import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'

import { BillingProfileIds as BillingProfileIdsV1 } from './billing-profile-ids-v1.tsx'
import { BillingProfileIds as BillingProfileIdsV2 } from './billing-profile-ids-v2.tsx'

export type BillingProfileIdsProps = {
  billingProfileId: BillingProfileId
}

export const BillingProfileIds = ({
  billingProfileId,
}: BillingProfileIdsProps) => {
  const { multipleBillingProfiles } = useFlags()
  if (multipleBillingProfiles) {
    return <BillingProfileIdsV2 billingProfileId={billingProfileId} />
  }
  return <BillingProfileIdsV1 billingProfileId={billingProfileId} />
}
