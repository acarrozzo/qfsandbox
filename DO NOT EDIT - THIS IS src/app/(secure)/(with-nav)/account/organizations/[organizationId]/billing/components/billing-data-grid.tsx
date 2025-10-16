import type { FinanceEntityId } from '@mntn-dev/domain-types'
import type {
  FlattenedTransaction,
  GetBrandTransactionsInput,
  GetTransactionsInput,
} from '@mntn-dev/finance-service/types'
import { useTranslation } from '@mntn-dev/i18n'
import { PaginationToolbar } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useBillingTable } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/hooks/use-billing-table.tsx'
import { HistoryHeader } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/components/history-header.tsx'
import { EmptyState } from '~/components/data-grid/empty-state.tsx'
import { LoadingState } from '~/components/data-grid/loading-state.tsx'
import { AppDataTable } from '~/components/table/app-data-table.tsx'
import { useTablePagination } from '~/hooks/use-table-pagination'

import { BillingTableRow } from './billing-table-row.tsx'

interface BillingDataGridProps {
  financeEntityId: FinanceEntityId
  startDate: Date
  setStartDate: (date: Date) => void
  endDate: Date
  setEndDate: (date: Date) => void
  title?: string
  pageSize?: number
}

export function BillingDataGrid({
  financeEntityId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  pageSize = 3,
}: Readonly<BillingDataGridProps>) {
  const { t } = useTranslation('finance')
  const getTransactionsHook = trpcReactClient.finance.getTransactions.useQuery

  const initialQueryParams: GetBrandTransactionsInput = {
    transactionType: 'brand',
    financeEntityId,
    startDate,
    endDate,
  }
  const {
    data: transactions,
    isLoading,
    pageCount,
    pagination,
    rowCount,
    sorting,
    onPaginationChange,
    onSortingChange,
  } = useTablePagination<FlattenedTransaction, GetTransactionsInput>({
    queryHook: getTransactionsHook,
    initialQueryParams: initialQueryParams,
    defaultPageSize: pageSize,
  })

  const table = useBillingTable({
    transactions,
    pagination,
    onPaginationChange,
    rowCount,
    sorting,
    onSortingChange,
  })

  // Calculate pagination info
  const firstShowing =
    transactions?.length > 0
      ? pagination.pageIndex * pagination.pageSize + 1
      : 0
  const lastShowing =
    transactions?.length > 0
      ? Math.min(
          (pagination.pageIndex + 1) * pagination.pageSize,
          rowCount || 0
        )
      : 0
  const totalRecords = rowCount || 0

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header component */}
      <HistoryHeader
        title={t('billingHeader')}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        firstShowing={firstShowing}
        lastShowing={lastShowing}
        totalRecords={totalRecords}
      />

      {/* Table container */}
      <div className="w-full overflow-auto flex-1">
        {isLoading && <LoadingState />}
        {transactions && transactions.length > 0 && (
          <AppDataTable
            table={table}
            tableId="billing-history"
            rowIdentifier="transactionId"
            loading={isLoading}
            rowComponent={BillingTableRow}
          />
        )}
        {!isLoading && (!transactions || transactions.length === 0) && (
          <EmptyState className="h-142" />
        )}
      </div>

      {/* Pagination */}
      <div className="pt-4 w-full">
        <PaginationToolbar
          currentPage={pagination.pageIndex + 1}
          totalPages={pageCount ?? 0}
          hasNextPage={table.getCanNextPage()}
          hasPreviousPage={table.getCanPreviousPage()}
          goToPage={(page) => table.setPageIndex(page - 1)}
          goToNextPage={table.nextPage}
          goToPreviousPage={table.previousPage}
        />
      </div>
    </div>
  )
}
