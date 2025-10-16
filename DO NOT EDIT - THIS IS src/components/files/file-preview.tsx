import { FormattedDate } from '@mntn-dev/app-ui-components'
import type { FileId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Stack, Surface, Text } from '@mntn-dev/ui-components'
import { themeBackgroundMap } from '@mntn-dev/ui-theme'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefetchFile } from '~/app/(secure)/(with-nav)/projects/[projectId]/files/hooks/use-refetch-file.ts'
import {
  fileProcessingAwaitingCompletion,
  handleFileDownload,
} from '~/lib/files/file-helpers.ts'
import type { ComponentProps } from '~/types/props.ts'
import { formatBytes } from '~/utils/format-bytes.ts'

import { CenteredLoadingSpinner } from '../shared/centered-loading-spinner.tsx'
import { FileDescription } from './description/file-description.tsx.tsx'
import { FilePreviewSection } from './file-preview-section.tsx'
import { Viewer } from './viewer/viewer.tsx'

type Props = ComponentProps<{
  fileId: FileId
}>

export const FilePreview = ({ fileId }: Props) => {
  const { t } = useTranslation(['files', 'file-manager'])
  const {
    data: file,
    isLoading,
    isError,
  } = trpcReactClient.files.getFileById.useQuery({
    fileId,
  })

  const refetchFile = useRefetchFile()

  const handleChangeFile = () => {
    refetchFile({ fileId })
  }

  const isProcessing = file && fileProcessingAwaitingCompletion(file)

  const isDownloadDisabled = !file || isProcessing

  const handleDownload = async () => {
    if (!isDownloadDisabled) {
      await handleFileDownload(file)
    }
  }

  return (
    <Surface height="full" width="full">
      <Stack height="full" width="full">
        <Stack
          className={themeBackgroundMap['container-tertiary']}
          direction="col"
          divide="muted"
          width="80"
        >
          {file && (
            <Stack
              direction="col"
              gap="8"
              padding="8"
              className="overflow-y-auto"
            >
              <FilePreviewSection>
                <Text
                  className="whitespace-pre-wrap break-words"
                  fontWeight="bold"
                  fontSize="lg"
                  dataTestId="file-preview-name"
                  dataTrackingId="file-preview-name"
                >
                  {file.name}
                </Text>
              </FilePreviewSection>

              <FilePreviewSection>
                <FileDescription
                  fileId={file.fileId}
                  description={file.description}
                  canEdit={!!file.acl.canEditFileDetails}
                  onChange={handleChangeFile}
                />
              </FilePreviewSection>

              <FilePreviewSection>
                <Text
                  fontWeight="medium"
                  fontSize="base"
                  textColor="secondary"
                  dataTestId="file-preview-kind-label"
                  dataTrackingId="file-preview-kind-label"
                >
                  {t('file-manager:type')}
                </Text>
                <Text
                  fontWeight="medium"
                  fontSize="base"
                  dataTestId="file-preview-kind"
                  dataTrackingId="file-preview-kind"
                >
                  {t(`files:category.${file.category}`)}
                </Text>
              </FilePreviewSection>

              <FilePreviewSection>
                <Text
                  fontWeight="medium"
                  fontSize="base"
                  textColor="secondary"
                  dataTestId="file-preview-size-label"
                  dataTrackingId="file-preview-size-label"
                >
                  {t('file-manager:size')}
                </Text>
                <Text
                  fontWeight="medium"
                  fontSize="base"
                  dataTestId="file-preview-size"
                  dataTrackingId="file-preview-size"
                >
                  {formatBytes(file.size)}
                </Text>
              </FilePreviewSection>

              <FilePreviewSection>
                <Text
                  fontWeight="medium"
                  fontSize="base"
                  textColor="secondary"
                  dataTestId="file-preview-added-by-label"
                  dataTrackingId="file-preview-added-by-label"
                >
                  {t('file-manager:added-by')}
                </Text>
                <Text
                  fontWeight="medium"
                  fontSize="base"
                  dataTestId="file-preview-added-by"
                  dataTrackingId="file-preview-added-by"
                >
                  {file.owner?.displayName}
                </Text>
              </FilePreviewSection>

              <FilePreviewSection>
                <Text
                  fontWeight="medium"
                  fontSize="base"
                  textColor="secondary"
                  dataTestId="file-preview-last-modified-label"
                  dataTrackingId="file-preview-last-modified-label"
                >
                  {t('file-manager:last-modified')}
                </Text>
                <Text
                  fontWeight="medium"
                  fontSize="base"
                  dataTestId="file-preview-last-modified"
                  dataTrackingId="file-preview-last-modified"
                >
                  <FormattedDate
                    date={file.uploadTimestamp}
                    format="medium-date"
                  />
                </Text>
              </FilePreviewSection>

              <FilePreviewSection>
                <Button
                  disabled={isDownloadDisabled}
                  iconRight="download"
                  size="sm"
                  variant="secondary"
                  onClick={handleDownload}
                  dataTestId="file-preview-download-button"
                  dataTrackingId="file-preview-download-button"
                >
                  {t('file-manager:download')}
                </Button>

                {isProcessing && (
                  <Text fontWeight="medium" fontSize="sm" textColor="tertiary">
                    {t('file-manager:file-processing')}
                  </Text>
                )}
              </FilePreviewSection>
            </Stack>
          )}
        </Stack>

        <Stack
          alignItems="center"
          justifyContent="center"
          padding="8"
          height="full"
          width="full"
          shrink
        >
          {isError && (
            <Text fontSize="base" fontWeight="medium" textColor="negative">
              {t('file-manager:error-loading-preview', {
                name: file?.name || '',
              })}
            </Text>
          )}

          {isLoading && <CenteredLoadingSpinner className="absolute" />}

          {file && (
            <Viewer
              file={file}
              videoOptions={{ resizeWidthToFitParent: true }}
              onDownload={isDownloadDisabled ? undefined : handleDownload}
            />
          )}
        </Stack>
      </Stack>
    </Surface>
  )
}
