'use client'

import { useEffect } from 'react'

import { BillingProvider } from '@mntn-dev/billing/client'
import type { BillingProfileId } from '@mntn-dev/domain-types'
import { SidebarLayoutContent, Surface } from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { useBreadcrumbs } from '#components/breadcrumbs'
import { ErrorMessage } from '#components/error/error-message.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import {
  AccountBillingProvider,
  useBilling,
} from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/hooks/use-billing'

import BillingElements from './billing-elements.tsx'

export default function AddBillingMethod({
  billingProfileId,
  clientSecret,
}: {
  billingProfileId: BillingProfileId
  clientSecret: string
}) {
  const { data: billingProfile } =
    trpcReactClient.financeCoordinator.getBillingProfile.useQuery(
      {
        billingProfileId,
      },
      {
        refetchOnMount: false,
      }
    )

  assertExists(
    billingProfile?.billingServiceId,
    'Credit card billing service customer ID is required in AddBillingMethod'
  )

  const context = useBilling({
    billingId: billingProfile.billingServiceId,
  })

  const { billingAppearance, billingClientPromise, t } = context

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
  }, [organization, billingProfile, setBreadcrumbTokens])

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
            <BillingElements billingProfileId={billingProfileId} />
          </Surface>
        </SidebarLayoutContent>
      </AccountBillingProvider>
    </BillingProvider>
  )
}
