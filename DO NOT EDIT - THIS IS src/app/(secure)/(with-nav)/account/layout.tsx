import type { PropsWithChildren } from 'react'

import { AccountHeader } from './components/account-header.tsx'
import { AccountTabs } from './components/account-tabs.tsx'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <AccountTabs />
      <AccountHeader />
      {children}
    </>
  )
}
