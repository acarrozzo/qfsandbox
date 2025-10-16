'use client'

import { useEffect } from 'react'

import type { BillingProfileId } from '@mntn-dev/domain-types'
import { SidebarLayoutContent, Surface } from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useBreadcrumbs } from '~/components/breadcrumbs/index.ts'

import { BillingAlerts } from './billing-alerts.tsx'
import { BillingMethodsList } from './billing-methods-list.tsx'

export const BillingMethods = ({
  billingProfileId,
}: {
  billingProfileId: BillingProfileId
}) => {
  const { data: billingProfile } =
    trpcReactClient.financeCoordinator.getBillingProfile.useQuery(
      {
        billingProfileId,
      },
      {
        refetchOnMount: false,
      }
    )

  assertExists(billingProfile, 'Billing profile is required in BillingMethods')

  const { data: organization } =
    trpcReactClient.organizations.getOrganization.useQuery(
      {
        organizationId: billingProfile.organizationId,
      },
      {
        refetchOnMount: false,
      }
    )

  const { setBreadcrumbTokens } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbTokens({
      '/account/organizations/:organizationId': organization?.name,
    })
    setBreadcrumbTokens({
      '/account/organizations/:organizationId/billing/profiles/:billingProfileId':
        billingProfile.name,
    })
    return () => setBreadcrumbTokens({})
  }, [organization, setBreadcrumbTokens, billingProfile])

  return (
    <SidebarLayoutContent className="p-4">
      <BillingAlerts billingProfileId={billingProfileId} />
      <Surface className="w-full max-w-2xl mx-auto">
        <BillingMethodsList billingProfileId={billingProfileId} />
      </Surface>
    </SidebarLayoutContent>
  )
}
