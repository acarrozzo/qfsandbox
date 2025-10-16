'use client'

import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'

import { BrandFinanceTools as BrandFinanceToolsV1 } from './brand-finance-tools-v1.tsx'
import { BrandFinanceTools as BrandFinanceToolsV2 } from './brand-finance-tools-v2.tsx'

type BrandFinanceToolsProps = {
  billingProfileId: BillingProfileId
}

export const BrandFinanceTools = ({
  billingProfileId,
}: BrandFinanceToolsProps) => {
  const { multipleBillingProfiles } = useFlags()
  if (multipleBillingProfiles) {
    return <BrandFinanceToolsV2 billingProfileId={billingProfileId} />
  }
  return <BrandFinanceToolsV1 billingProfileId={billingProfileId} />
}
