'use client'

import { useEffect } from 'react'

import type { BillingServiceCustomerId } from '@mntn-dev/billing/types'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { SidebarLayoutContent, Surface } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import {
  AccountBillingProvider,
  useBilling,
} from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/hooks/use-billing'
import { BillingMethodsList } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/methods/components/billing-methods-list'
import { useBreadcrumbs } from '~/components/breadcrumbs/index.ts'

import { BillingAlerts } from './billing-alerts.tsx'

export const BillingMethods = ({
  billingId,
  organizationId,
}: {
  billingId: BillingServiceCustomerId
  organizationId: OrganizationId
}) => {
  const context = useBilling({
    billingId,
  })
  const { data: organization } =
    trpcReactClient.organizations.getOrganization.useQuery({
      organizationId,
    })

  const { setBreadcrumbTokens } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbTokens({
      '/account/organizations/:organizationId': organization?.name,
    })
    return () => setBreadcrumbTokens({})
  }, [organization, setBreadcrumbTokens])

  return (
    <AccountBillingProvider value={context}>
      <SidebarLayoutContent className="p-4">
        <BillingAlerts organizationId={organizationId} />
        <Surface className="w-full max-w-2xl mx-auto">
          <BillingMethodsList organizationId={organizationId} />
        </Surface>
      </SidebarLayoutContent>
    </AccountBillingProvider>
  )
}
