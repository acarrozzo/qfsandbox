import type { FileListItem } from '@mntn-dev/file-service'
import { useTranslation } from '@mntn-dev/i18n'
import { DataGrid, Surface, Text } from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { CenteredLoadingSpinner } from '../shared/centered-loading-spinner.tsx'
import { useFileTableColumnDefs } from './use-file-table.tsx'

type Props = {
  className?: string
  files: FileListItem[]
  isLoading: boolean
  isFetching: boolean
  isError: boolean
  onArchiveFile: (file: FileListItem) => void
  onPreviewFile: (file: FileListItem) => void
}

export const FileTable = ({
  className,
  files,
  isLoading,
  isError,
  onArchiveFile,
  onPreviewFile,
}: Props) => {
  const { t } = useTranslation('file-manager')

  const columnDefs = useFileTableColumnDefs({ onArchiveFile, onPreviewFile })

  const empty = !(isError || isLoading || isNonEmptyArray(files))

  if (isLoading || isError || empty) {
    return (
      <Surface className="flex-1 flex items-center justify-center">
        {isLoading && <CenteredLoadingSpinner />}

        {isError && (
          <Text fontSize="base" fontWeight="medium" textColor="negative">
            {t('error-loading-files')}
          </Text>
        )}

        {empty && (
          <Text fontSize="base" fontWeight="medium" textColor="disabled">
            {t('no-files')}
          </Text>
        )}
      </Surface>
    )
  }

  return (
    <DataGrid<FileListItem>
      className={className}
      columnDefs={columnDefs}
      rowData={files}
      onRowClick={onPreviewFile}
      dataTestId="file-manager-grid"
      dataTrackingId="file-manager-grid"
    />
  )
}
