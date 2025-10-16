import type { PropsWithChildren } from 'react'

const SingleColumn = ({ children }: PropsWithChildren) => (
  <div className="flex flex-col w-full h-full gap-6">{children}</div>
)

export { SingleColumn }
