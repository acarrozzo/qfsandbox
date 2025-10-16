import type { PropsWithChildren } from 'react'

import { Grid, type GridItemProps } from '@mntn-dev/ui-components'

const ThreeColumnMain = ({
  columnSpan = 4,
  children,
}: PropsWithChildren<Pick<GridItemProps, 'columnSpan'>>) => {
  return (
    <Grid.Item
      as="main"
      columnSpan={columnSpan}
      className="sticky h-screen-minus-64 grow"
    >
      {children}
    </Grid.Item>
  )
}

export { ThreeColumnMain }
