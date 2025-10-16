'use client'

import { useState } from 'react'

import type { BillingProfileId } from '@mntn-dev/domain-types'
import { Surface } from '@mntn-dev/ui-components'

import { BillingDataGrid } from '../../../components/billing-data-grid.tsx'

type BillingProfileHistoryTabProps = {
  billingProfileId: BillingProfileId
  initialStartDate: Date
  initialEndDate: Date
  pageSize?: number
}

export const BillingProfileHistoryTab = ({
  billingProfileId,
  initialStartDate,
  initialEndDate,
  pageSize = 5,
}: BillingProfileHistoryTabProps) => {
  const [startDate, setStartDate] = useState<Date>(initialStartDate)
  const [endDate, setEndDate] = useState<Date>(initialEndDate)

  return (
    <Surface className="w-full min-h-164" border padding="8">
      <BillingDataGrid
        financeEntityId={billingProfileId}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        pageSize={pageSize}
      />
    </Surface>
  )
}
