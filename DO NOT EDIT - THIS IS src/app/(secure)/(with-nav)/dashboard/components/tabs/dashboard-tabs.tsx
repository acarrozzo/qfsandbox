import { useQueryParams, useRouter } from '@mntn-dev/app-navigation'
import { type DashboardPageTab, route } from '@mntn-dev/app-routing'
import { Tabs } from '@mntn-dev/ui-components'
import { omit } from '@mntn-dev/utilities'

import { useDashboardTabs } from './use-dashboard-tabs.ts'

export const DashboardTabs = () => {
  const router = useRouter()
  const params = useQueryParams<'/dashboard'>()
  const tab = params.tab || 'all'
  const { tabs } = useDashboardTabs()

  return (
    <Tabs
      current={tab}
      type="simple"
      onClick={(id: string) => {
        router.replace(
          route('/dashboard')
            .query({
              ...omit(params, ['tab']),
              ...(id && { tab: id as DashboardPageTab }),
            })
            .toRelativeUrl()
        )
      }}
    >
      {tabs.map((tab) =>
        tab.element === 'tab' ? (
          <Tabs.Tab key={tab.id} name={tab.name} id={tab.id} />
        ) : (
          <Tabs.Divider key={tab.id} />
        )
      )}
    </Tabs>
  )
}
