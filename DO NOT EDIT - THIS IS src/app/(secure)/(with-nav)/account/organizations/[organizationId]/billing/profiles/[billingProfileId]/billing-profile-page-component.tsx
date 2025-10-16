'use client'

import { assertExists } from 'node_modules/@mntn-dev/utilities/src/objects/exists.ts'
import { forwardRef, useEffect, useState } from 'react'

import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useFlags } from '@mntn-dev/flags-client'
import { SidebarLayoutContent } from '@mntn-dev/ui-components'
import { endOfToday, startOfYear } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import NotFound from '~/app/not-found.tsx'
import { useBreadcrumbs } from '~/components/breadcrumbs/breadcrumb-provider.tsx'

import { BillingProfileHistoryTab } from './components/billing-profile-history-tab.tsx'
import {
  BillingProfilePageTabs,
  type BillingTab,
} from './components/billing-profile-page-tabs.tsx'
import { BillingProfileProfileTab } from './components/billing-profile-profile-tab.tsx'

type BillingProfilePageComponentProps = {
  billingProfileId: BillingProfileId
}

export const BillingProfilePageComponent = forwardRef<
  HTMLDivElement,
  BillingProfilePageComponentProps
>(({ billingProfileId }, _ref) => {
  const [currentTab, setCurrentTab] = useState<BillingTab>('profile')
  const { setBreadcrumbTokens } = useBreadcrumbs()

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
    billingProfile,
    'Billing profile is required in BillingProfilePageComponent'
  )

  const { data: organization } =
    trpcReactClient.organizations.getOrganization.useQuery(
      {
        organizationId: billingProfile.organizationId,
      },
      {
        refetchOnMount: false,
      }
    )

  const startDate = startOfYear(new Date())
  const endDate = endOfToday()
  const pageSize = 5

  const handleTabClick = (tab: BillingTab) => {
    setCurrentTab(tab)
  }

  useEffect(() => {
    setBreadcrumbTokens({
      '/account/organizations/:organizationId': organization?.name,
      '/account/organizations/:organizationId/billing/profiles/:billingProfileId':
        billingProfile.name,
    })
    return () => setBreadcrumbTokens({})
  }, [organization, billingProfile, setBreadcrumbTokens])

  const { multipleBillingProfiles } = useFlags()

  if (!multipleBillingProfiles) {
    return <NotFound />
  }

  return (
    <SidebarLayoutContent className="max-w-full">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center gap-x-8">
          <BillingProfilePageTabs
            currentTab={currentTab}
            onTabClick={handleTabClick}
          />
          <div>{/* controls will go here */}</div>
        </div>
        {currentTab === 'profile' && (
          <BillingProfileProfileTab billingProfile={billingProfile} />
        )}
        {currentTab === 'billing' && (
          <BillingProfileHistoryTab
            billingProfileId={billingProfileId}
            initialStartDate={startDate}
            initialEndDate={endDate}
            pageSize={pageSize}
          />
        )}
      </div>
    </SidebarLayoutContent>
  )
})
