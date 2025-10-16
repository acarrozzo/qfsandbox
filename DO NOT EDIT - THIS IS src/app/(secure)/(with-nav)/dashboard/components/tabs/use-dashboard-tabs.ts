import type { DashboardPageTab } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'

import { useMe } from '~/hooks/secure/use-me.ts'

import { getTabOpportunityType, getTabTypes } from '../../helpers/tabs.ts'
import { getDashboardTabs } from './get-dashboard-tabs.ts'

export const useDashboardTabs = () => {
  const { me } = useMe()
  const { organizationType } = me
  const { t } = useTranslation('tab-names')
  const tabs = getDashboardTabs(organizationType, t)
  return { tabs }
}

export const useDashboardTabTypes = (tabValue: DashboardPageTab) => {
  const { tabs } = useDashboardTabs()
  return getTabTypes(tabs, tabValue)
}

export const useDashboardTabOpportunityType = (tabValue: DashboardPageTab) => {
  const { tabs } = useDashboardTabs()
  return getTabOpportunityType(tabs, tabValue)
}
