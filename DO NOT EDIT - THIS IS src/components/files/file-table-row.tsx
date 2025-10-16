import type { FileListItem } from '@mntn-dev/file-service'
import { DataTableRow, type DataTableRowProps } from '@mntn-dev/ui-components'

type FileTableRowProps = DataTableRowProps<FileListItem>

export const FileTableRow = ({
  row,
  data,
  rowIdentifier,
  onClick,
  tableId,
}: FileTableRowProps) => {
  return (
    <DataTableRow
      row={row}
      data={data}
      rowIdentifier={rowIdentifier}
      onClick={onClick}
      tableId={tableId}
    />
  )
}
