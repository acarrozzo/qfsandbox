'use client'

import { useEffect } from 'react'

import { BillingProvider } from '@mntn-dev/billing/client'
import type { BillingServiceCustomerId } from '@mntn-dev/billing/types'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { SidebarLayoutContent, Surface } from '@mntn-dev/ui-components'

import { useBreadcrumbs } from '#components/breadcrumbs'
import { ErrorMessage } from '#components/error/error-message.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import {
  AccountBillingProvider,
  useBilling,
} from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/hooks/use-billing'
import BillingElements from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/methods/add-method/components/billing-elements'

export default function AddBillingMethod({
  billingId,
  clientSecret,
  organizationId,
}: {
  billingId: BillingServiceCustomerId
  clientSecret: string
  organizationId: OrganizationId
}) {
  const context = useBilling({
    billingId,
  })

  const { billingAppearance, billingClientPromise, t } = context

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

  if (!clientSecret) {
    return <ErrorMessage message={t('setup-intent-failed')} />
  }

  return (
    <BillingProvider
      appearance={billingAppearance}
      billingClient={billingClientPromise}
      clientSecret={clientSecret}
    >
      <AccountBillingProvider value={context}>
        <SidebarLayoutContent className="p-4">
          <Surface className="w-full max-w-2xl mx-auto">
            <BillingElements />
          </Surface>
        </SidebarLayoutContent>
      </AccountBillingProvider>
    </BillingProvider>
  )
}
