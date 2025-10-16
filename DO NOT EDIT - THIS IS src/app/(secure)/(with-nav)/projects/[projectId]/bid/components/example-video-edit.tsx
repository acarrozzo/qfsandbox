import { useMemo } from 'react'

import { ExampleVideoUpdateFormModelSchema } from '@mntn-dev/app-form-schemas'
import { useForm, zodResolver } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Form,
  FormField,
  Icon,
  Input,
  Stack,
  TextEditor,
  useEditorController,
} from '@mntn-dev/ui-components'
import { cn } from '@mntn-dev/ui-utilities'

import type { ViewableFile } from '#components/files/viewer/types.ts'
import { useBidContext } from '#projects/[projectId]/bid/hooks/use-bid.ts'

export const ExampleVideoEdit = ({ video }: { video: ViewableFile }) => {
  const { handleSaveVideo, setEditingFileId } = useBidContext()
  const { t: tValidation } = useTranslation('validation')

  const schema = useMemo(
    () => ExampleVideoUpdateFormModelSchema(tValidation),
    [tValidation]
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    defaultValues: {
      description: video.description ?? '',
      title: (video.title || video.name) ?? '',
    },
    resolver: zodResolver(schema, tValidation),
  })

  const { field } = useEditorController({
    control,
    name: 'description',
    rules: { required: true },
  })

  const onSave = async ({
    title,
    description,
  }: {
    title: string
    description: string
  }) => {
    await handleSaveVideo({
      fileId: video.fileId,
      updates: {
        title: title ?? '',
        description: description ?? '',
      },
    })
  }

  return (
    <Form
      className={cn('w-full')}
      onSubmit={handleSubmit(onSave)}
      dataTestId="example-video-edit-form"
      dataTrackingId="example-video-edit-form"
    >
      <Stack direction="col" gap="2" width="full">
        <FormField hasError={!!errors.title}>
          <FormField.Label>Title</FormField.Label>
          <FormField.Control>
            <Input
              {...register('title', { required: true })}
              placeholder="Title"
              dataTestId="example-video-edit-title"
              dataTrackingId="example-video-edit-title"
            />
          </FormField.Control>
        </FormField>
        <FormField hasError={!!errors.description}>
          <FormField.Label>Description</FormField.Label>
          <FormField.Control>
            <TextEditor
              ref={field.ref}
              className="h-40"
              onChange={field.onChange}
              onBlur={field.onBlur}
              defaultValue={field.value}
              placeholder="Description"
              dataTestId="example-video-edit-description"
              dataTrackingId="example-video-edit-description"
            />
          </FormField.Control>
        </FormField>
        <Stack justifyContent="end" gap="1">
          <Button
            variant="secondary"
            size="xs"
            onClick={() => setEditingFileId(undefined)}
            readonly={false}
            dataTestId="example-video-edit-cancel-button"
            dataTrackingId="example-video-edit-cancel-button"
          >
            <Icon name="close" size="sm" color="negative" />
          </Button>
          <Button
            variant="secondary"
            size="xs"
            type="submit"
            readonly={false}
            dataTestId="example-video-edit-save-button"
            dataTrackingId="example-video-edit-save-button"
          >
            <Icon name="check" size="sm" color="positive" />
          </Button>
        </Stack>
      </Stack>
    </Form>
  )
}
