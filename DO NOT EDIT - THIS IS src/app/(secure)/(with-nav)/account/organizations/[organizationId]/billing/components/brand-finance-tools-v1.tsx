'use client'

import type { BillingProfileId } from '@mntn-dev/domain-types'

import { usePermissions } from '~/hooks/secure/use-permissions.ts'

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
  const { hasPermission } = usePermissions()

  return (
    <div className="flex flex-col gap-4 h-full">
      <BillingMethodPreview billingProfileId={billingProfileId} />

      <InvoiceAddressPreview billingProfileId={billingProfileId} />

      <InvoiceContactsList billingProfileId={billingProfileId} />

      {hasPermission('customer-organization:administer') && (
        <BillingProfileIds billingProfileId={billingProfileId} />
      )}
    </div>
  )
}
