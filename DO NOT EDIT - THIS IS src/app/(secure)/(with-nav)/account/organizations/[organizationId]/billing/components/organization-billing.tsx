'use client'

import { useEffect, useState } from 'react'

import type { BillingProfileId, OrganizationId } from '@mntn-dev/domain-types'
import { Surface } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { BillingDataGrid } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/components/billing-data-grid'
import { useBreadcrumbs } from '~/components/breadcrumbs/breadcrumb-provider.tsx'

import { AccountEmptyState } from '../../../../components/account-empty-state.tsx'
import { BrandFinanceTools } from './brand-finance-tools'

type OrganizationBillingProps = {
  organizationId: OrganizationId
  billingProfileId: BillingProfileId
  initialStartDate: Date
  initialEndDate: Date
  pageSize?: number
}

export const OrganizationBilling = ({
  organizationId,
  billingProfileId,
  initialStartDate,
  initialEndDate,
  pageSize,
}: OrganizationBillingProps) => {
  const [organization] =
    trpcReactClient.organizations.getOrganization.useSuspenseQuery({
      organizationId,
    })
  const { setBreadcrumbTokens } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbTokens({
      '/account/organizations/:organizationId': organization?.name,
    })
    return () => setBreadcrumbTokens({})
  }, [organization, setBreadcrumbTokens])

  const [startDate, setStartDate] = useState<Date>(initialStartDate)
  const [endDate, setEndDate] = useState<Date>(initialEndDate)

  return organization.organizationType === 'internal' ? (
    <AccountEmptyState />
  ) : (
    <div className="grid grid-cols-11 gap-4 items-start">
      <Surface className="col-span-8 min-h-164" border padding="8">
        <BillingDataGrid
          financeEntityId={billingProfileId}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          pageSize={pageSize}
        />
      </Surface>

      <div className="col-span-3">
        <BrandFinanceTools billingProfileId={billingProfileId} />
      </div>
    </div>
  )
}
