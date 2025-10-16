import type { Description, FileId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Stack, Text } from '@mntn-dev/ui-components'

import type { ComponentProps } from '~/types/props.ts'

import { FileDescriptionLabel } from './file-description-label.tsx'

type Props = ComponentProps<{
  fileId: FileId
  description?: Description
  canEdit: boolean
  onStartEditing?: () => void
}>

export const FileDescriptionViewer = ({
  fileId,
  description,
  canEdit,
  onStartEditing,
}: Props) => {
  const { t } = useTranslation('file-manager')

  return (
    <>
      <Stack alignItems="center">
        <FileDescriptionLabel />

        {canEdit && description && (
          <Button
            iconLeft="pencil"
            size="sm"
            variant="text"
            iconColor="brand"
            onClick={onStartEditing}
            dataTestId={`file-description-edit-${fileId}`}
            dataTrackingId={`file-description-edit-${fileId}`}
          />
        )}
      </Stack>

      {description && (
        <Text
          className="whitespace-pre-wrap break-words"
          fontWeight="medium"
          fontSize="base"
          dataTestId={`file-description-${fileId}`}
          dataTrackingId={`file-description-${fileId}`}
        >
          {description}
        </Text>
      )}

      {canEdit && !description && (
        <Button
          iconLeft="add"
          size="sm"
          variant="text"
          width="fit"
          onClick={onStartEditing}
          dataTestId={`file-description-add-${fileId}`}
          dataTrackingId={`file-description-add-${fileId}`}
        >
          {t('add-description')}
        </Button>
      )}
    </>
  )
}
