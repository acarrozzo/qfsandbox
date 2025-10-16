'use client'

import {
  type Context,
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useState,
} from 'react'

type TabsContextProps<T extends string> = {
  currentTab: T
  setCurrentTab: Dispatch<SetStateAction<T>>
}

const TabsContext = createContext<TabsContextProps<string>>({
  currentTab: '',
  setCurrentTab: () => null,
})

export const useTabs = <T extends string>() =>
  useContext<TabsContextProps<T>>(
    TabsContext as unknown as Context<TabsContextProps<T>>
  )

export const TabsProvider = <T extends string>({
  children,
  initialTab,
}: PropsWithChildren<{ initialTab: T }>) => {
  const [currentTab, setCurrentTab] = useState<string>(initialTab)

  return (
    <TabsContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabsContext.Provider>
  )
}
