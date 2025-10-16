import type { ReactNode } from 'react'

import { Grid } from '@mntn-dev/ui-components'
import type { ThemeGridColumnSpan } from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

const TwoColumnAside = ({
  children,
  className,
  columnSpan = 4,
}: {
  children: ReactNode
  columnSpan?: ThemeGridColumnSpan
  className?: string
}) => {
  return (
    <Grid.Item
      as="aside"
      columnSpan={columnSpan}
      className={cn('sticky', className)}
    >
      {children}
    </Grid.Item>
  )
}

export { TwoColumnAside }
