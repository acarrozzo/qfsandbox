import type { ReactNode } from 'react'

type Props = {
  main: ReactNode
  sidebar?: ReactNode
}

export const ProjectResponsiveLayout = ({ main, sidebar }: Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-11 gap-16">
      <main className="col-span-1 xl:col-span-7">{main}</main>

      {sidebar && (
        <aside className="col-span-1 xl:col-span-4 xl:sticky">{sidebar}</aside>
      )}
    </div>
  )
}
