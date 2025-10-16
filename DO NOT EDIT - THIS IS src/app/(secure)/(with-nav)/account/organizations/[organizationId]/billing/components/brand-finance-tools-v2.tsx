'use client'

import type { BillingProfileId } from '@mntn-dev/domain-types'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { BillingMethodPreview } from './billing-method-preview.tsx'
import { BillingProfileIds } from './billing-profile-ids.tsx'
import { InvoiceAddressPreview } from './invoice-address-preview.tsx'
import { InvoiceContactsList } from './invoice-contacts-list.tsx'

type BrandFinanceToolsProps = {
  billingProfileId: BillingProfileId
}

export const BrandFinanceTools = ({
  billingProfileId,
}: BrandFinanceToolsProps) => {
  const { data: billingProfile } =
    trpcReactClient.financeCoordinator.getBillingProfile.useQuery(
      {
        billingProfileId,
      },
      {
        refetchOnMount: false,
      }
    )
  assertExists(billingProfile, 'Billing profile is required')

  return (
    <div className="flex flex-col gap-4 h-full">
      <BillingProfileIds billingProfileId={billingProfileId} />

      <BillingMethodPreview billingProfileId={billingProfileId} />

      <InvoiceAddressPreview billingProfileId={billingProfileId} />

      <InvoiceContactsList billingProfileId={billingProfileId} />
    </div>
  )
}
