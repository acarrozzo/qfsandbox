import { DescriptionFieldModal } from '@mntn-dev/app-ui-components/description-field-modal'
import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import {
  Button,
  FieldModal,
  getTestProps,
  Icon,
  RichText,
  Stack,
  Surface,
  Text,
  useOpenState,
} from '@mntn-dev/ui-components'

type Props = {
  project: ProjectWithAcl
}

export const ProjectDescriptionReader = ({ project }: Props) => {
  const { t } = useTranslation(['generic', 'project-details'])
  const { description } = project
  const { onClose, onToggle, open } = useOpenState()

  return (
    <>
      <button
        type="button"
        {...getTestProps({
          dataTestId: 'project-description-button',
          dataTrackingId: 'project-description-button',
        })}
        className="h-full w-full"
        onClick={onToggle}
      >
        <Surface
          border
          className="text-left"
          width="full"
          padding="6"
          elevation="xs"
        >
          <Stack direction="col" gap="1">
            <Stack gap="1" alignItems="center">
              <Text textColor="secondary" fontSize="sm">
                {t('project-details:project-description')}
              </Text>
              <Icon name="eye" size="sm" color="secondary" />
            </Stack>
            {description && (
              <RichText
                displayPlainText
                className="line-clamp-3"
                value={description}
              />
            )}
          </Stack>
        </Surface>
      </button>
      <DescriptionFieldModal open={open} onClose={onClose}>
        <FieldModal.Title>
          {t('project-details:project-description')}
        </FieldModal.Title>
        <FieldModal.Main>
          <FieldModal.Controls>
            <RichText bounded value={description} className="h-full" />
          </FieldModal.Controls>
          <FieldModal.Buttons>
            <Button variant="secondary" size="sm" onClick={onClose}>
              {t('generic:close')}
            </Button>
          </FieldModal.Buttons>
        </FieldModal.Main>
      </DescriptionFieldModal>
    </>
  )
}
