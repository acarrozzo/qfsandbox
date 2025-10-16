import type { Description, FileId } from '@mntn-dev/domain-types'
import { useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  FormField,
  Stack,
  TextEditor,
  useEditorController,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import type { ComponentProps } from '~/types/props.ts'

import { FileDescriptionLabel } from './file-description-label.tsx'

type Props = ComponentProps<{
  fileId: FileId
  description?: Description
  onCancel: () => void
  onSaved: (updatedDescription?: Description) => void
}>

export const FileDescriptionEditor = ({
  fileId,
  description,
  onCancel,
  onSaved,
}: Props) => {
  const editFileDetails = trpcReactClient.files.editFileDetails.useMutation()
  const { t } = useTranslation('file-manager')

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      description,
    },
  })

  const { field } = useEditorController({
    control,
    name: 'description',
  })

  const onSubmit = async ({ description }: { description?: Description }) => {
    const updatedFile = await editFileDetails.mutateAsync({
      fileId,
      updates: { description: description || null },
    })
    onSaved(updatedFile.description)
  }

  const saves = editFileDetails.isPending || editFileDetails.isSuccess

  return (
    <>
      <FileDescriptionLabel />

      <FormField hasError={!!errors.description}>
        <TextEditor
          autofocus
          ref={field.ref}
          onBlur={field.onBlur}
          onChange={field.onChange}
          defaultValue={field.value}
          placeholder={t('description-field')}
          disabled={saves}
          dataTestId={`file-description-textarea-${fileId}`}
          dataTrackingId={`file-description-textarea-${fileId}`}
        />

        <FormField.Error>{errors.description?.message}</FormField.Error>
      </FormField>

      <FormField hasError={editFileDetails.isError}>
        <Stack direction="col" gap="2" width="full">
          <Button
            disabled={saves}
            loading={saves}
            size="sm"
            variant="secondary"
            onClick={handleSubmit(onSubmit)}
            dataTestId={`file-description-save-${fileId}`}
            dataTrackingId={`file-description-save-${fileId}`}
          >
            {t('save-description')}
          </Button>

          <Button
            disabled={saves}
            size="sm"
            variant="text"
            onClick={onCancel}
            dataTestId={`file-description-cancel-${fileId}`}
            dataTrackingId={`file-description-cancel-${fileId}`}
          >
            {t('cancel-description')}
          </Button>

          <FormField.Error>{t('save-description-error')}</FormField.Error>
        </Stack>
      </FormField>
    </>
  )
}
