import type React from 'react'

import { Grid } from '@mntn-dev/ui-components'

import { ThreeColumnAside } from './three-column-aside.tsx'
import { ThreeColumnMain } from './three-column-main.tsx'

const ThreeColumnComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <Grid columns={10} columnGap="8">
      {children}
    </Grid>
  )
}

const ThreeColumnNamespace = Object.assign(ThreeColumnComponent, {
  Aside: ThreeColumnAside,
  Main: ThreeColumnMain,
})

export { ThreeColumnNamespace as ThreeColumn }
