'use client'

import type { ReactNode } from 'react'

import { FooterContent, Stack } from '@mntn-dev/ui-components'

type Props = {
  left: ReactNode
  right: ReactNode
}

export const ProjectFooterLayout = ({ left, right }: Props) => {
  return (
    <FooterContent gap="8" justifyContent="between" alignItems="center">
      {/* Something to nudge the other element to the right */}
      {left ? left : <div />}

      {right && (
        <Stack gap="8" alignItems="center">
          {right}
        </Stack>
      )}
    </FooterContent>
  )
}
