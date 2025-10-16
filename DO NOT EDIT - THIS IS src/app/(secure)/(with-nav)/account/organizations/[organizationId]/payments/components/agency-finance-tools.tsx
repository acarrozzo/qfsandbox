'use client'

import type { OrganizationId } from '@mntn-dev/domain-types'

import { PaymentSetupPreview } from './payment-setup-preview.tsx'

type AgencyFinanceToolsProps = {
  organizationId: OrganizationId
}

export const AgencyFinanceTools = ({
  organizationId,
}: AgencyFinanceToolsProps) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <PaymentSetupPreview organizationId={organizationId} />
    </div>
  )
}
