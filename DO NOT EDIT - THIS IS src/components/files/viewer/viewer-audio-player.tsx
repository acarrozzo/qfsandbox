import { useTranslation } from '@mntn-dev/i18n'
import { AudioPlayer, Stack, Text } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { CenteredLoadingSpinner } from '~/components/shared/centered-loading-spinner.tsx'
import type { ComponentProps } from '~/types/props.ts'

import type { ViewableFile } from './types.ts'

type Props = ComponentProps<{
  file: ViewableFile
}>

export const ViewerAudioPlayer = ({ file }: Props) => {
  const { t } = useTranslation('file-manager')

  const {
    data: url,
    isError,
    isLoading,
  } = trpcReactClient.files.getVideoUrl.useQuery({
    fileId: file.fileId,
    options: {},
  })

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      width="full"
      height="full"
      dataTestId={`viewer-${file.fileId}`}
      dataTrackingId={`viewer-${file.fileId}`}
    >
      {isError && (
        <Text fontWeight="medium" fontSize="base" textColor="negative">
          {t('error-loading-preview', { name: file.name || '' })}
        </Text>
      )}

      {isLoading && <CenteredLoadingSpinner className="absolute" />}

      {url && (
        <AudioPlayer src={url} name={file.name} maxWidth="160" width="full" />
      )}
    </Stack>
  )
}
