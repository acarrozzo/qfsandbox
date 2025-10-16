'use client'

import type React from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import type { AbstractLinkProps } from '@mntn-dev/ui-utilities'

export const BackLink: React.FC<AbstractLinkProps> = ({
  children,
  ...props
}: AbstractLinkProps) => {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.back()
  }

  return (
    // biome-ignore lint/a11y/useValidAnchor:  Need to use anchor instead of button to keep a consistent look and feel
    <a {...props} href="#" onClick={handleClick}>
      {children}
    </a>
  )
}
