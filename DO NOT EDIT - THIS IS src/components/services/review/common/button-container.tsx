'use client'

import type { PropsWithChildren } from 'react'

import { cn } from '@mntn-dev/ui-utilities'

const ButtonContainer = ({ children }: PropsWithChildren) => (
  <div className={cn('flex gap-x-4 p-8 border-t border-subtle')}>
    {children}
  </div>
)

export { ButtonContainer }
