'use client'

import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'

import { BillingMethodPreview as BillingMethodPreviewV1 } from './billing-method-preview-v1.tsx'
import { BillingMethodPreview as BillingMethodPreviewV2 } from './billing-method-preview-v2.tsx'

type BillingMethodPreviewProps = {
  billingProfileId: BillingProfileId
}

export const BillingMethodPreview = ({
  billingProfileId,
}: BillingMethodPreviewProps) => {
  const { multipleBillingProfiles } = useFlags()
  if (multipleBillingProfiles) {
    return <BillingMethodPreviewV2 billingProfileId={billingProfileId} />
  }
  return <BillingMethodPreviewV1 billingProfileId={billingProfileId} />
}
