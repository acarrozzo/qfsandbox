import type { PropsWithChildren } from 'react'

import { IconButton, type IconName, Tooltip } from '@mntn-dev/ui-components'

export const IconInfoTooltip = ({
  iconName = 'question',
  children,
}: PropsWithChildren<{ iconName?: IconName }>) => {
  return (
    <Tooltip delay={0} variant="inverse" content={children}>
      <IconButton name={iconName} size="sm" fill="solid" color="brand" />
    </Tooltip>
  )
}
