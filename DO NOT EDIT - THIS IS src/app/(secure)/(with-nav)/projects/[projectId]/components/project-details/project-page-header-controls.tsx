import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import { Button, PageHeader, Stack, Text } from '@mntn-dev/ui-components'

import { usePermissions } from '~/hooks/secure/use-permissions'

type Props = {
  isEditing: boolean
  project: ProjectWithAcl
  onToggleEditing: () => void
}

export const ProjectPageHeaderControls = ({
  isEditing,
  project,
  onToggleEditing,
}: Props) => {
  const { t } = useTranslation('project-details')
  const { hasPermission } = usePermissions()

  return (
    <>
      {hasPermission('project:administer') && project.acl.canEditProject && (
        <PageHeader.Controls>
          {isEditing ? (
            <Stack gap="4" alignItems="center">
              <Text fontSize="base" textColor="tertiary">
                {t('edit.editing')}
              </Text>

              <Button
                variant="primary"
                dataTestId="project-details-done-editing-project"
                onClick={onToggleEditing}
              >
                {t('edit.done')}
              </Button>
            </Stack>
          ) : (
            <Button
              variant="secondary"
              dataTestId="project-details-start-editing-project"
              onClick={onToggleEditing}
            >
              {t('edit.start')}
            </Button>
          )}
        </PageHeader.Controls>
      )}
    </>
  )
}
