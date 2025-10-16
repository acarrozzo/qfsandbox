'use client'

import type { PropsWithChildren } from 'react'

import { Icon, Stack } from '@mntn-dev/ui-components'

export const ProjectFooterNotice = ({ children }: PropsWithChildren) => {
  return (
    <Stack alignItems="center" gap="4" shrink>
      <Icon color="notice" fill="outline" name="error-warning" size="3xl" />

      <Stack direction="col" gap="2" shrink>
        {children}
      </Stack>
    </Stack>
  )
}
