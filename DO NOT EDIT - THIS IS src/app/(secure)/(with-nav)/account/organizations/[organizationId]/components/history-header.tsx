import { useTranslation } from '@mntn-dev/i18n'
import { DatePicker, Stack } from '@mntn-dev/ui-components'

export interface HistoryHeaderProps {
  endDate: Date
  firstShowing: number
  lastShowing: number
  startDate: Date
  title: string
  totalRecords: number
  setEndDate: (date: Date) => void
  setStartDate: (date: Date) => void
}

export function HistoryHeader({
  endDate,
  firstShowing,
  lastShowing,
  startDate,
  title,
  totalRecords,
  setEndDate,
  setStartDate,
}: Readonly<HistoryHeaderProps>) {
  const { t } = useTranslation('finance')

  return (
    <Stack
      className="max-xl:flex-wrap"
      justifyContent="between"
      width="full"
      gap="6"
      alignItems="center"
    >
      <h1 className="text-xl font-semibold text-white">{title}</h1>

      <Stack className="max-xl:w-full" alignItems="center" gap="4">
        {/* Date Range Filters */}
        <Stack alignItems="center" gap="2">
          <div className="w-[150px]">
            <DatePicker
              selected={startDate}
              onChange={(date) => date && setStartDate(date)}
              maxDate={endDate}
              dataTestId="payments-start-date"
              dataTrackingId="payments-start-date"
            />
          </div>
          <span className="text-white text-sm">to</span>
          <div className="w-[150px]">
            <DatePicker
              selected={endDate}
              onChange={(date) => date && setEndDate(date)}
              minDate={startDate}
              dataTestId="payments-end-date"
              dataTrackingId="payments-end-date"
            />
          </div>
        </Stack>

        {/* Display range info */}
        <div className="text-gray-400 text-sm ml-4">
          {firstShowing > 0
            ? t('history.displaying', {
                start: firstShowing,
                end: lastShowing,
                total: totalRecords,
              })
            : t('history.no-records')}
        </div>
      </Stack>
    </Stack>
  )
}
