import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectServiceWithAcl } from '@mntn-dev/project-service'
import { Heading, List, Surface } from '@mntn-dev/ui-components'
import { themeTextColorMap } from '@mntn-dev/ui-theme'
export const ProjectSubmissionDeliverableReview = ({
  deliverables,
}: {
  deliverables: ProjectServiceWithAcl[]
}) => {
  const { t } = useTranslation(['project-deliverables'])
  return (
    <Surface border className="w-full p-8 flex-1">
      <div className="w-full overflow-y-auto">
        <div className="flex flex-col gap-4 text-left">
          <Heading fontSize="2xl">
            {t('deliverables', { ns: 'project-deliverables' })}
          </Heading>
          <List className={themeTextColorMap.secondary}>
            {deliverables.map((deliverable) => (
              <List.Item key={deliverable.projectServiceId}>
                {deliverable.name}
              </List.Item>
            ))}
          </List>
        </div>
      </div>
    </Surface>
  )
}
