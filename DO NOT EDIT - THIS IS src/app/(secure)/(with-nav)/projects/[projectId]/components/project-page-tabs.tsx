import { useRouter } from '@mntn-dev/app-navigation'
import { type ProjectPageTab, route } from '@mntn-dev/app-routing'
import type { ProjectId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tabs } from '@mntn-dev/ui-components'

type ProjectPageTabsProps = {
  currentTab: ProjectPageTab
  projectId: ProjectId
}

export const ProjectPageTabs = ({
  currentTab,
  projectId,
}: ProjectPageTabsProps) => {
  const router = useRouter()
  const { t } = useTranslation('tab-names')
  const tabs: Array<{
    name: ProjectPageTab
    id: ProjectPageTab
    hide?: boolean
  }> = [
    { name: t('project-details.details'), id: 'details' },
    { name: t('project-details.activity'), id: 'activity' },
  ]

  const handleTabClick = (tab: ProjectPageTab) => {
    router.push(
      route('/projects/:projectId').params({ projectId }).query({ tab })
    )
  }

  return (
    <Tabs current={currentTab} type="segmented" onClick={handleTabClick}>
      {tabs.map(
        (tab) =>
          !tab.hide && (
            <Tabs.Tab
              key={tab.id}
              name={tab.name}
              id={tab.id}
              dataTestId={`project-details-tab-${tab.id}`}
              dataTrackingId={`project-details-tab-${tab.id}`}
            />
          )
      )}
    </Tabs>
  )
}
