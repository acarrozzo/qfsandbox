import type { PropsWithChildren, ReactNode } from 'react'

const Layout = (props: PropsWithChildren<{ modal: ReactNode }>) => {
  const { children, modal } = props

  return (
    <>
      {children}
      {modal}
    </>
  )
}

export default Layout
