import type { PropsWithChildren } from 'react'

import { Grid, type GridItemProps } from '@mntn-dev/ui-components'

const ThreeColumnAside = ({
  columnSpan = 3,
  children,
}: PropsWithChildren<Pick<GridItemProps, 'columnSpan'>>) => {
  return (
    <Grid.Item
      as="aside"
      columnSpan={columnSpan}
      className="sticky h-screen-minus-64"
    >
      {children}
    </Grid.Item>
  )
}

export { ThreeColumnAside }
