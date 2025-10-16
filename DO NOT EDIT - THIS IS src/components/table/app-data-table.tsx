'use client'

import dynamic from 'next/dynamic'

import type { DataTable } from '@mntn-dev/ui-components'

// virtualizing the table is not properly supported with ssr
export const AppDataTable = dynamic(
  () => import('@mntn-dev/ui-components').then((module) => module.DataTable),
  { ssr: false }
) as typeof DataTable
