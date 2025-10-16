'use client'

import { FormattedDate } from '@mntn-dev/app-ui-components'
import { Text } from '@mntn-dev/ui-components'
import { themeTextColorMap } from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

import { getNoteDataTestIdPrefix } from '../utils.ts'

type ServiceNoteHeaderProps = {
  readonly?: boolean
  subtitle?: string
  timestamp?: Date
  title: string
}

const ServiceNoteTitleTimestamp = ({ timestamp }: { timestamp: Date }) => {
  return (
    <time
      dateTime={timestamp.toLocaleDateString()}
      className={cn(
        'text-sm font-medium uppercase',
        themeTextColorMap.tertiary
      )}
    >
      {timestamp ? (
        <FormattedDate date={timestamp} format="medium-date-time" />
      ) : undefined}
    </time>
  )
}

const ServiceNoteHeader = ({
  readonly = false,
  subtitle,
  timestamp,
  title,
}: ServiceNoteHeaderProps) => (
  <div className="flex-none flex items-center gap-2 justify-between w-full">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Text
          fontSize="lg"
          textColor="primary"
          fontWeight="bold"
          dataTestId={`${getNoteDataTestIdPrefix(readonly)}-title`}
          dataTrackingId={`${getNoteDataTestIdPrefix(readonly)}-title`}
        >
          {title}
        </Text>
      </div>
      {subtitle && (
        <Text
          fontSize="sm"
          textColor="tertiary"
          dataTestId={`${getNoteDataTestIdPrefix(readonly)}-subtitle`}
          dataTrackingId={`${getNoteDataTestIdPrefix(readonly)}-subtitle`}
        >
          {subtitle}
        </Text>
      )}
    </div>
    {readonly && timestamp && (
      <ServiceNoteTitleTimestamp timestamp={timestamp} />
    )}
  </div>
)

export { ServiceNoteHeader, type ServiceNoteHeaderProps }
