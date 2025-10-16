import { useState } from 'react'

import { useTranslation } from '@mntn-dev/i18n'
import { Stack, Text } from '@mntn-dev/ui-components'

import { FileImage } from '~/components/image/file-image.tsx'
import { CenteredLoadingSpinner } from '~/components/shared/centered-loading-spinner.tsx'
import type { ComponentProps } from '~/types/props.ts'

import type { ViewableFile } from './types.ts'
import { getViewerImageDefaults } from './viewer-utils.ts'

type Props = ComponentProps<{
  file: ViewableFile
}>

export const ViewerImage = ({ file }: Props) => {
  const { t } = useTranslation('file-manager')
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading'
  )

  const isError = status === 'error'
  const isLoading = status === 'loading'
  const setImageError = () => setStatus('error')
  const setImageSuccess = () => setStatus('success')

  return (
    <Stack
      className="relative"
      alignItems="center"
      justifyContent="center"
      width="full"
      height="full"
      dataTestId={`viewer-${file.fileId}`}
      dataTrackingId={`viewer-${file.fileId}`}
    >
      {isError && (
        <Text fontWeight="medium" fontSize="base" textColor="negative">
          {t('error-loading-preview', { name: file?.name || '' })}
        </Text>
      )}

      {isLoading && <CenteredLoadingSpinner className="absolute" />}

      {!isError && (
        <FileImage
          {...getViewerImageDefaults()}
          className="object-scale-down"
          fileId={file.fileId}
          fill
          alt={file.name}
          unoptimized
          onLoad={setImageSuccess}
          onError={setImageError}
          dataTestId={`file-image-${file.fileId}`}
          dataTrackingId={`file-image-${file.fileId}`}
        />
      )}
    </Stack>
  )
}
