import { FormattedDate } from '@mntn-dev/app-ui-components'
import { themeTextColorMap } from '@mntn-dev/ui-theme'

const separator = ' • '

export const ActivityTimestamp = ({ timestamp }: { timestamp: Date }) => {
  return (
    <time
      dateTime={timestamp.toLocaleDateString()}
      className={`${themeTextColorMap.disabled} text-sm font-medium uppercase`}
    >
      <FormattedDate date={timestamp} format="medium-date" />
      {separator}
      <FormattedDate date={timestamp} format="short-time" />
    </time>
  )
}
