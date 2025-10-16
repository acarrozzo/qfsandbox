import type { FlattenedTransaction } from '@mntn-dev/finance-service/types'
import { DataTableRow, type DataTableRowProps } from '@mntn-dev/ui-components'

type PaymentsTableRowProps = DataTableRowProps<FlattenedTransaction>

export const PaymentsTableRow = ({
  row,
  data,
  rowIdentifier,
  onClick,
  style,
  tableId,
}: PaymentsTableRowProps) => {
  return (
    <DataTableRow
      row={row}
      data={data}
      rowIdentifier={rowIdentifier}
      style={style}
      tableId={tableId}
      onClick={onClick}
    />
  )
}
