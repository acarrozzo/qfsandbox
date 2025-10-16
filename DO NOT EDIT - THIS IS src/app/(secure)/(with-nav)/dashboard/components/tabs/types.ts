import type { DashboardPageTab } from '@mntn-dev/app-routing'
import type { ProjectStatus } from '@mntn-dev/domain-types'

export type DashboardTabType = 'projects' | 'highlights'
export type DashboardTab =
  | {
      element: 'tab'
      name: string
      id: DashboardPageTab
      type: DashboardTabType[]
      projectStatuses?: ProjectStatus[]
      opportunityType?: 'active' | 'declined'
    }
  | { element: 'divider'; id: string }
