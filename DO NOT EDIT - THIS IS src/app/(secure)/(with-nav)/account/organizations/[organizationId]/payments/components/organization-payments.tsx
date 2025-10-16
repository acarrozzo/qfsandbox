'use client'

import { useEffect, useState } from 'react'

import type { OrganizationId } from '@mntn-dev/domain-types'
import { SidebarLayoutContent, Surface } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useBreadcrumbs } from '~/components/breadcrumbs/breadcrumb-provider.tsx'

import { AccountEmptyState } from '../../../../components/account-empty-state.tsx'
import { AgencyFinanceTools } from './agency-finance-tools.tsx'
import { PaymentsDataGrid } from './payments-data-grid.tsx'

type OrganizationPaymentsProps = {
  organizationId: OrganizationId
  initialStartDate: Date
  initialEndDate: Date
  pageSize?: number
}

export const OrganizationPayments = ({
  organizationId,
  initialStartDate,
  initialEndDate,
  pageSize,
}: OrganizationPaymentsProps) => {
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
    <SidebarLayoutContent className="max-w-full">
      <div className="grid grid-cols-11 gap-4 items-start">
        <Surface className="col-span-8 min-h-164 flex-row" border padding="8">
          <PaymentsDataGrid
            agencyOrganizationId={organizationId}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            pageSize={pageSize}
          />
        </Surface>

        <div className="col-span-3">
          <AgencyFinanceTools organizationId={organizationId} />
        </div>
      </div>
    </SidebarLayoutContent>
  )
}
