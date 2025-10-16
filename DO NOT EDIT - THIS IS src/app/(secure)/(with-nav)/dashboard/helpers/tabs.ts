import type { DashboardPageTab } from '@mntn-dev/app-routing'
import { ActiveProjectStatuses } from '@mntn-dev/domain-types'
import { intersects } from '@mntn-dev/utilities'

import type {
  DashboardTab,
  DashboardTabType,
} from '../components/tabs/types.ts'

export const getSelectedTab = (
  tabs: DashboardTab[],
  selectedTab: DashboardPageTab
) => tabs.filter((t) => t.element === 'tab').find((t) => t.id === selectedTab)

export const getTabTypes = (
  tabs: DashboardTab[],
  selectedTab: DashboardPageTab
) => {
  const tab = getSelectedTab(tabs, selectedTab)
  return { tabTypes: tab?.type ?? [] }
}

export const getTabOpportunityType = (
  tabs: DashboardTab[],
  selectedTab: DashboardPageTab
) => {
  const tab = getSelectedTab(tabs, selectedTab)
  return { opportunityType: tab?.opportunityType ?? 'active' }
}

export const getTabProjectStatuses = (
  tabs: DashboardTab[],
  selectedTab: DashboardPageTab
) => {
  const tab = getSelectedTab(tabs, selectedTab)
  return tab?.projectStatuses ?? []
}

export const getShowHighlights = (tabTypes: DashboardTabType[]) =>
  tabTypes.includes('highlights')
export const getShowProjects = (tabTypes: DashboardTabType[]) =>
  tabTypes.includes('projects')
export const getShowAddButton = (
  tabs: DashboardTab[],
  tab: DashboardPageTab
) => {
  const projectStatuses = getTabProjectStatuses(tabs, tab)

  return intersects(projectStatuses, ActiveProjectStatuses)
}
