import type { ChangeEvent } from 'react'
import { z } from 'zod'

import { MaxNameLength } from '@mntn-dev/domain-types'
import type { FileListItem } from '@mntn-dev/file-service'
import { useForm, zodResolver } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField, Input, MediaCard } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { Viewer } from '~/components/files/viewer/viewer.tsx'
import { useTextField } from '~/utils/form/use-text-field.ts'
import { useDebouncedCallback } from '~/utils/use-debounced-callback.ts'

type Props = {
  file: FileListItem
  index: number
  onChange: () => void
}

export const PackageFile = ({ file, index, onChange }: Props) => {
  const { t } = useTranslation('package-details')
  const { t: tValidation } = useTranslation('validation')
  const editFileDetails = trpcReactClient.files.editFileDetails.useMutation()
  const archiveFile = trpcReactClient.files.archiveFile.useMutation()

  const titleField = useTextField({
    field: t('quickview.title-field'),
    min: 1,
    max: MaxNameLength,
  })

  const {
    formState: { errors, isValid },
    register,
  } = useForm({
    defaultValues: {
      title: file.title,
    },
    mode: 'onChange',
    resolver: zodResolver(z.object({ title: titleField.schema }), tValidation),
  })

  const handleArchiveClick = async () => {
    await archiveFile.mutateAsync({ fileId: file.fileId })
    onChange()
  }

  const handleTitleChange = useDebouncedCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (isValid) {
        await editFileDetails.mutateAsync({
          fileId: file.fileId,
          updates: { title: event.target.value || null },
        })
        onChange()
      }
    },
    {
      postpone: editFileDetails.isPending,
    }
  )

  const isArchiving = archiveFile.isPending || archiveFile.isSuccess
  const isTitleChangeSuccess = editFileDetails.isSuccess && isValid
  const isTitleChangeError = editFileDetails.isError || !!errors.title

  return (
    <MediaCard width="1/3">
      <MediaCard.Main>
        <MediaCard.Asset>
          <MediaCard.RemoveButton
            disabled={isArchiving}
            loading={isArchiving}
            onClick={handleArchiveClick}
          >
            {t('quickview.remove')}
          </MediaCard.RemoveButton>

          <Viewer file={file} videoOptions={{ resizeWidthToFitParent: true }} />
        </MediaCard.Asset>
      </MediaCard.Main>

      <FormField
        disabled={isArchiving}
        hasError={isTitleChangeError}
        hasSuccess={isTitleChangeSuccess}
      >
        <Input
          placeholder={t('quickview.title-placeholder', { slot: index + 1 })}
          {...register('title', { onChange: handleTitleChange })}
        />

        <FormField.Error>
          {errors.title?.message || t('quickview.error-changing-title')}
        </FormField.Error>
      </FormField>
    </MediaCard>
  )
}
