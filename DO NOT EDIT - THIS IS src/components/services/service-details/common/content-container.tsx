'use client'

import type { PropsWithChildren } from 'react'

import { cn } from '@mntn-dev/ui-utilities'

const ContentContainer = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div
    className={cn(
      'flex flex-col justify-between h-full p-8 gap-8 shrink overflow-auto',
      className
    )}
  >
    {children}
  </div>
)

export { ContentContainer }
