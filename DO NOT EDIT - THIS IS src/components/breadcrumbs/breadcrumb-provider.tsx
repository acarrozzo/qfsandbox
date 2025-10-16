'use client'

import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from 'react'

import type { RouteBreadcrumbTokens } from './types.ts'

export type BreadcrumbContextProps = {
  breadcrumbTokens: RouteBreadcrumbTokens
  setBreadcrumbTokens: Dispatch<SetStateAction<RouteBreadcrumbTokens>>
}

const BreadcrumbContext = createContext<BreadcrumbContextProps>({
  breadcrumbTokens: {},
  setBreadcrumbTokens: () => null,
})

export const useBreadcrumbs = () => useContext(BreadcrumbContext)

export const BreadcrumbProvider = ({ children }: PropsWithChildren) => {
  const [breadcrumbTokens, setBreadcrumbTokens] =
    useState<RouteBreadcrumbTokens>({})

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbTokens,
        setBreadcrumbTokens,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  )
}
