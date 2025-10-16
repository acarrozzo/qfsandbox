import { useState } from 'react'
import type { PaginationState, SortingState } from '@tanstack/react-table'

import type {
  AnyValue,
  PaginatedResult,
  PagingOptions,
} from '@mntn-dev/utility-types'

type QueryHookResult<TData> = {
  data?: PaginatedResult<TData>
  isLoading: boolean
  refetch: () => Promise<unknown>
  [key: string]: AnyValue
}

export interface UseTablePaginationProps<TData, TParams> {
  queryHook: (params: TParams) => QueryHookResult<TData>
  initialQueryParams: Omit<TParams, 'paging'>
  defaultSortBy?: keyof TData
  defaultPageSize?: number
}

export function useTablePagination<
  TData,
  TParams extends { paging?: PagingOptions<TData> },
>({
  queryHook,
  initialQueryParams,
  defaultPageSize = 10,
  defaultSortBy,
}: UseTablePaginationProps<TData, TParams>) {
  // Use TanStack Table's pagination state format
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  // Use TanStack Table's sorting state format
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: typeof defaultSortBy === 'string' ? defaultSortBy : '',
      desc: false,
    },
  ])

  // Transform TanStack pagination format to our API format
  const pagingParams: PagingOptions<TData> = {
    pageSize: pagination.pageSize,
    currentPage: pagination.pageIndex + 1, // TanStack is 0-indexed, our API is 1-indexed
    sortBy: sorting[0]?.id as keyof TData,
    sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
  }

  // Combine base params with pagination params
  const queryParams = {
    ...initialQueryParams,
    paging: pagingParams,
  } as TParams

  // Execute the query with pagination params
  const { data, isLoading, refetch, ...queryResults } = queryHook(queryParams)

  // Return data in the format expected by TanStack Table
  return {
    // Data for the table
    data: data?.items || [],

    // Pagination state and handlers
    pagination,
    onPaginationChange: setPagination,

    // Values required by TanStack Table for server-side pagination
    pageCount: data?.totalPages ?? 0,
    rowCount: data?.totalItems ?? 0,

    // Sorting state and handlers
    sorting,
    onSortingChange: setSorting,

    // Loading state
    isLoading,

    // Extra values from the query
    refetch,
    ...queryResults,
  }
}
