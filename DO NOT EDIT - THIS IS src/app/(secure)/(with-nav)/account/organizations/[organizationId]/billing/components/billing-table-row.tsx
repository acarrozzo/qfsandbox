import type { FlattenedTransaction } from '@mntn-dev/finance-service/types'
import { DataTableRow, type DataTableRowProps } from '@mntn-dev/ui-components'

type BillingTableRowProps = DataTableRowProps<FlattenedTransaction>

export const BillingTableRow = ({
  row,
  data,
  rowIdentifier,
  onClick,
  style,
  tableId,
}: BillingTableRowProps) => {
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
