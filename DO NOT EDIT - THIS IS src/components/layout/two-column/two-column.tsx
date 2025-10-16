import type React from 'react'

import { Grid } from '@mntn-dev/ui-components'

import { TwoColumnAside } from './two-column-aside.tsx'
import { TwoColumnMain } from './two-column-main.tsx'

const TwoColumnComponent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <Grid columns={11} columnGap="16" className={className}>
      {children}
    </Grid>
  )
}

const TwoColumnNamespace = Object.assign(TwoColumnComponent, {
  Aside: TwoColumnAside,
  Main: TwoColumnMain,
})

export { TwoColumnNamespace as TwoColumn }
