import { useMemo } from 'react'
import {
  type CellContext,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'

import {
  type BillingMethod,
  type ChargeStatus,
  isCurrency,
} from '@mntn-dev/domain-types'
import type {
  FlattenedTransaction,
  TransactionKind,
} from '@mntn-dev/finance-service/types'
import { useTranslation } from '@mntn-dev/i18n'

export const columnHelper = createColumnHelper<FlattenedTransaction>()

/**
 * Hook to create and configure the billing history table
 */
export function useBillingTable({
  transactions,
  pagination,
  onPaginationChange,
  rowCount,
  sorting,
  onSortingChange,
}: {
  transactions: FlattenedTransaction[]
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  rowCount?: number
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
}) {
  const columns = useBillingTableColumns()

  return useReactTable({
    data: useMemo(() => transactions ?? [], [transactions]),
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // Tell TanStack we're doing server-side pagination
    // Pagination state and handlers
    ...(pagination && {
      state: {
        pagination,
        ...(sorting && { sorting }),
      },
      onPaginationChange,
      rowCount,
    }),
    ...(sorting && {
      manualSorting: true,
      enableSortingRemoval: false,
      onSortingChange,
    }),
  })
}

function useBillingTableColumns() {
  const { t } = useTranslation(['finance'])

  return useMemo(() => {
    return [
      columnHelper.accessor('timestamp', {
        id: 'timestamp',
        header: t('columnHeaders.date'),
        cell: (props: CellContext<FlattenedTransaction, Date>) => {
          const date = new Date(props.getValue())
          const dateString = `${date.toLocaleDateString()}`
          return <span>{dateString}</span>
        },
        meta: { className: 'whitespace-nowrap' },
        enableSorting: true,
        sortingFn: 'basic',
      }),

      columnHelper.accessor('projectName', {
        id: 'projectName',
        header: t('columnHeaders.projectName'),
        cell: (props: CellContext<FlattenedTransaction, string>) => (
          <span>{props.getValue()}</span>
        ),
        meta: { className: 'truncate max-w-[150px]' },
        enableSorting: true,
      }),

      columnHelper.accessor('transactionKind', {
        id: 'transactionKind',
        header: t('columnHeaders.transactionKind'),
        cell: (props: CellContext<FlattenedTransaction, TransactionKind>) => (
          <span>{t(`transactionKind.${props.getValue()}`)}</span>
        ),
        enableSorting: true,
      }),

      columnHelper.accessor('transactionId', {
        id: 'transactionId',
        header: t('columnHeaders.transactionId'),
        cell: (
          props: CellContext<FlattenedTransaction, string | undefined>
        ) => <span>{props.getValue() ?? '-'}</span>,
        enableSorting: true,
      }),

      columnHelper.accessor('status', {
        id: 'status',
        header: t('columnHeaders.status'),
        cell: (props: CellContext<FlattenedTransaction, ChargeStatus>) => (
          <span>{t(`transactionStatus.${props.getValue()}`)}</span>
        ),
        enableSorting: true,
      }),

      columnHelper.accessor('billingMethod', {
        id: 'billingMethod',
        header: t('columnHeaders.billingMethod'),
        cell: (
          props: CellContext<FlattenedTransaction, BillingMethod | undefined>
        ) => <span>{t(`billingMethod.${props.getValue() ?? '-'}`)}</span>,
        enableSorting: true,
      }),

      columnHelper.accessor('amount', {
        id: 'amount',
        header: t('columnHeaders.amount'),
        cell: (props: CellContext<FlattenedTransaction, number>) => {
          const useCurrency = isCurrency(props.row.original.unit)
          if (useCurrency) {
            return (
              <span>
                {props.getValue().toLocaleString('en-US', {
                  style: 'currency',
                  currency: props.row.original.unit,
                })}
              </span>
            )
          }
          return <span>{props.getValue().toLocaleString('en-US')}</span>
        },
        enableSorting: true,
      }),
    ]
  }, [t])
}
