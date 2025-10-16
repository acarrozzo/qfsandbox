import { useMemo } from 'react'
import { type CellContext, createColumnHelper } from '@tanstack/react-table'

import { FormattedDate } from '@mntn-dev/app-ui-components'
import type { FileCategory } from '@mntn-dev/domain-types'
import type { FileListItem } from '@mntn-dev/file-service'
import { useTranslation } from '@mntn-dev/i18n'
import { Icon, Text } from '@mntn-dev/ui-components'

import { formatBytes } from '~/utils/format-bytes.ts'

import { FilePopOutCell } from './file-pop-out-cell.tsx'
import { FileServiceNameCell } from './file-service-name-cell.tsx'
import { FileThumbnail } from './thumbnail/file-thumbnail.tsx'

export const columnHelper = createColumnHelper<FileListItem>()

type Props = {
  onArchiveFile: (file: FileListItem) => void
  onPreviewFile: (file: FileListItem) => void
}

export const useFileTableColumnDefs = ({
  onArchiveFile,
  onPreviewFile,
}: Props) => {
  const { t } = useTranslation(['files', 'file-manager'])

  return useMemo(() => {
    return [
      columnHelper.display({
        id: 'file-preview-icon',
        enableSorting: false,
        cell: (_: CellContext<FileListItem, unknown>) => (
          <button className="table-cell align-middle" type="button">
            <Icon name="eye" fill="solid" size="lg" color="brand" />
          </button>
        ),
        meta: { sizeStrategy: { type: 'fixed', width: { default: 56 } } },
      }),

      columnHelper.display({
        id: 'file-thumbnail',
        enableSorting: false,
        cell: (props: CellContext<FileListItem, unknown>) => (
          <FileThumbnail
            canUpload={false}
            key={props.row.original.fileId}
            file={props.row.original}
            size="3xs"
          />
        ),
        meta: { sizeStrategy: { type: 'fixed', width: { default: 80 } } },
      }),

      columnHelper.accessor('name', {
        header: t('file-manager:name'),
        enableSorting: false,
        cell: (props: CellContext<FileListItem, string>) => (
          <Text textColor="primary">{props.getValue()}</Text>
        ),
        meta: { sizeStrategy: { type: 'max' } },
      }),

      columnHelper.accessor('category', {
        header: t('file-manager:type'),
        enableSorting: false,
        cell: (props: CellContext<FileListItem, FileCategory>) => (
          <Text textColor="secondary">
            {t(`files:category.${props.getValue()}`)}
          </Text>
        ),
      }),

      columnHelper.accessor('serviceName', {
        header: t('file-manager:service-name'),
        enableSorting: false,
        cell: (props: CellContext<FileListItem, string>) => (
          <FileServiceNameCell file={props.row.original} />
        ),
      }),

      columnHelper.accessor('size', {
        header: t('file-manager:size'),
        enableSorting: false,
        cell: (props: CellContext<FileListItem, number>) => (
          <Text textColor="secondary">{formatBytes(props.getValue())}</Text>
        ),
      }),

      columnHelper.accessor('ownerDisplayName', {
        header: t('file-manager:added-by'),
        enableSorting: false,
        cell: (props: CellContext<FileListItem, string>) => (
          <Text textColor="secondary">{props.getValue()}</Text>
        ),
      }),

      columnHelper.accessor('uploadTimestamp', {
        header: t('file-manager:last-modified'),
        enableSorting: false,
        cell: (props: CellContext<FileListItem, Date>) => (
          <Text textColor="secondary">
            <FormattedDate date={props.getValue()} format="medium-date" />
          </Text>
        ),
        meta: { className: 'w-48' },
      }),

      columnHelper.display({
        id: 'file-pop-out',
        cell: (props: CellContext<FileListItem, unknown>) => (
          <FilePopOutCell
            file={props.row.original}
            onArchiveFile={() => onArchiveFile(props.row.original)}
            onPreviewFile={() => onPreviewFile(props.row.original)}
          />
        ),
        meta: { className: 'w-20' },
      }),
    ]
  }, [t, onArchiveFile, onPreviewFile])
}
