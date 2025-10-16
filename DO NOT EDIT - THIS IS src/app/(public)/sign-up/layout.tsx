import type { PropsWithChildren } from 'react'

import { FocusedLayout } from '@mntn-dev/app-ui-components'

const Layout = ({ children }: PropsWithChildren) => {
  return <FocusedLayout>{children}</FocusedLayout>
}

export default Layout
