import type { ReactNode } from 'react'

import { Grid } from '@mntn-dev/ui-components'
import type { ThemeGridColumnSpan } from '@mntn-dev/ui-theme'

const TwoColumnMain = ({
  children,
  columnSpan = 7,
  className,
}: {
  children: ReactNode
  className?: string
  columnSpan?: ThemeGridColumnSpan
}) => {
  return (
    <Grid.Item as="main" columnSpan={columnSpan} className={className}>
      {children}
    </Grid.Item>
  )
}

export { TwoColumnMain }
