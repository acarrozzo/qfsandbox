import { useQueryParams, useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Heading, Text } from '@mntn-dev/ui-components'

import { EmptyState } from '#components/empty'
import { useMe } from '~/hooks/secure/use-me.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { getShowAddButton } from '../../helpers/tabs.ts'
import { useDashboardTabs } from '../tabs/use-dashboard-tabs.ts'

export const ProjectListEmptyState = () => {
  const { t } = useTranslation('project-list')
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const { meOnATeam } = useMe()

  const { tabs } = useDashboardTabs()
  const params = useQueryParams<'/dashboard'>()
  const tab = params.tab || 'all'

  const showAddButton =
    getShowAddButton(tabs, tab) && hasPermission('project:create') && meOnATeam

  return (
    <EmptyState
      id="project-list"
      border
      dataTestId="project-table-empty-state"
      dataTrackingId="project-table-empty-state"
    >
      <EmptyState.CallToAction
        heading={
          <>
            <Text textColor="brand" fontWeight="semibold" fontSize="lg">
              {t('no-projects-alt')}
            </Text>
            {showAddButton && (
              <Heading fontWeight="bold" fontSize="3xl">
                {t('no-projects-sub')}
              </Heading>
            )}
          </>
        }
        button={
          showAddButton ? (
            <Button
              variant="primary"
              onClick={() => router.push(route('/projects/new'))}
              width="fit"
              iconRight="add"
              dataTestId="empty-project-state-new-project-button"
              dataTrackingId="empty-project-state-new-project-button"
            >
              {t('create-new-project')}
            </Button>
          ) : undefined
        }
      />
    </EmptyState>
  )
}
