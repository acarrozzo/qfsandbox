import type { TFunction } from 'i18next'

import {
  ActiveProjectStatuses,
  InProgressProjectStatuses,
  type OrganizationType,
  SubmittedProjectStatuses,
} from '@mntn-dev/domain-types'
import { UnhandledUnionError } from '@mntn-dev/utilities'

import type { DashboardTab } from './types.ts'

export const getDashboardTabs = (
  organizationType: OrganizationType,
  t: TFunction<'tab-names'>
): DashboardTab[] => {
  switch (organizationType) {
    case 'agency': {
      return [
        {
          element: 'tab',
          name: t('project-list.all'),
          id: 'all',
          type: ['projects', 'highlights'],
          projectStatuses: ActiveProjectStatuses,
        },
        {
          element: 'tab',
          name: t('project-list.my-projects'),
          id: 'my-projects',
          type: ['projects'],
          projectStatuses: InProgressProjectStatuses,
        },
        {
          element: 'tab',
          name: t('project-list.opportunities'),
          id: 'opportunities',
          type: ['highlights'],
          opportunityType: 'active',
        },
        {
          element: 'divider',
          id: 'inactive-project-divider',
        },
        {
          element: 'tab',
          name: t('project-list.completed'),
          id: 'completed',
          type: ['projects'],
          projectStatuses: ['complete'],
        },
        {
          element: 'tab',
          name: t('project-list.dismissed'),
          id: 'dismissed',
          type: ['highlights'],
          opportunityType: 'declined',
        },
        {
          element: 'tab',
          name: t('project-list.closed'),
          id: 'closed',
          type: ['projects'],
          projectStatuses: ['closed'],
        },
      ]
    }

    case 'brand':
    case 'internal': {
      return [
        {
          element: 'tab',
          name: t('project-list.all'),
          id: 'all',
          type: ['projects', 'highlights'],
          projectStatuses: ActiveProjectStatuses,
        },
        {
          element: 'tab',
          name: t('project-list.draft'),
          id: 'draft',
          type: ['projects'],
          projectStatuses: ['draft'],
        },
        {
          element: 'tab',
          name: t('project-list.submitted'),
          id: 'submitted',
          type: ['projects', 'highlights'],
          projectStatuses: SubmittedProjectStatuses,
        },
        {
          element: 'tab',
          name: t('project-list.in-progress'),
          id: 'in-progress',
          type: ['projects'],
          projectStatuses: InProgressProjectStatuses,
        },
        {
          element: 'divider',
          id: 'inactive-project-divider',
        },
        {
          element: 'tab',
          name: t('project-list.completed'),
          id: 'completed',
          type: ['projects'],
          projectStatuses: ['complete'],
        },
        {
          element: 'tab',
          name: t('project-list.archived'),
          id: 'archived',
          type: ['projects'],
          projectStatuses: ['archived'],
        },
        {
          element: 'tab',
          name: t('project-list.closed'),
          id: 'closed',
          type: ['projects'],
          projectStatuses: ['closed'],
        },
      ]
    }

    default: {
      throw new UnhandledUnionError(organizationType)
    }
  }
}
