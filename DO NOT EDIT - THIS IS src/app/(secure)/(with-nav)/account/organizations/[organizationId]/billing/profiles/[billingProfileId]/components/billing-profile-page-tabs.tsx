import type { TupleToUnion } from 'type-fest'

import { useTranslation } from '@mntn-dev/i18n'
import { Tabs } from '@mntn-dev/ui-components'

const billingTabs = ['profile', 'billing'] as const
export type BillingTab = TupleToUnion<typeof billingTabs>

type BillingProfilePageTabsProps = {
  currentTab: BillingTab
  onTabClick: (tab: BillingTab) => void
}

export const BillingProfilePageTabs = ({
  currentTab,
  onTabClick,
}: BillingProfilePageTabsProps) => {
  const { t } = useTranslation('billing-profile')

  return (
    <Tabs current={currentTab} onClick={onTabClick} type="segmented">
      {billingTabs.map((tab) => (
        <Tabs.Tab
          key={tab}
          name={t(`tabs.${tab}`)}
          id={tab}
          dataTestId={`billing-profile-tab-${tab}`}
          dataTrackingId={`billing-profile-tab-${tab}`}
        />
      ))}
    </Tabs>
  )
}
