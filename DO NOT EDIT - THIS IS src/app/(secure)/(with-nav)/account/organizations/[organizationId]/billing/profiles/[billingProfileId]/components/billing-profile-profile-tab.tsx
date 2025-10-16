'use client'

import type { BillingProfileDomainSelectModel } from '@mntn-dev/domain-types'
import { Stack, Surface } from '@mntn-dev/ui-components'

import { BrandFinanceTools } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/components/brand-finance-tools.tsx'
import { TwoColumn } from '~/components/layout/two-column/two-column.tsx'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { BillingProfileControls } from '../../../components/billing-profile-controls.tsx'
import { InternalBillingProfileControls } from '../../../components/internal-billing-profile-controls.tsx'

type BillingProfileProfileTabProps = {
  billingProfile: BillingProfileDomainSelectModel
}

export const BillingProfileProfileTab = ({
  billingProfile,
}: BillingProfileProfileTabProps) => {
  const { hasPermission } = usePermissions()

  const canAdminister = hasPermission('customer-organization:administer')

  return (
    <TwoColumn className="gap-4 items-start">
      {/* Wide left column */}
      <TwoColumn.Main className="col-span-8">
        <Surface className="min-h-164" border padding="8">
          <Stack direction="col" className="w-full">
            {canAdminister && (
              <InternalBillingProfileControls
                billingProfileId={billingProfile.billingProfileId}
              />
            )}

            <BillingProfileControls
              billingProfileId={billingProfile.billingProfileId}
              organizationId={billingProfile.organizationId}
            />
          </Stack>
        </Surface>
      </TwoColumn.Main>

      {/* Narrow right column */}
      <TwoColumn.Aside className="col-span-3 static">
        <BrandFinanceTools billingProfileId={billingProfile.billingProfileId} />
      </TwoColumn.Aside>
    </TwoColumn>
  )
}
