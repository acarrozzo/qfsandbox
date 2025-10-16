import type { PropsWithChildren } from 'react'

import {
  SidebarLayout,
  SidebarLayoutMain,
  SidebarLayoutSidebar,
} from '@mntn-dev/ui-components'

import { Navbar } from './navbar.tsx'
import UserIdentifier from './user-identifier.tsx'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <UserIdentifier /> {/* identifies user to highligh.io */}
      <SidebarLayout>
        <SidebarLayoutSidebar>
          <Navbar />
        </SidebarLayoutSidebar>
        <SidebarLayoutMain>{children}</SidebarLayoutMain>
      </SidebarLayout>
    </>
  )
}
