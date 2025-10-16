'use client'

import type { PropsWithChildren } from 'react'

import { cn } from '@mntn-dev/ui-utilities'

const ContentContainer = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div
    className={cn(
      'flex-1 flex flex-col h-full p-8 shrink overflow-auto',
      className
    )}
  >
    {children}
  </div>
)

export { ContentContainer }
