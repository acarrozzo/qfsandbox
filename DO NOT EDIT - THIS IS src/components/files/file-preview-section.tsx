import type { PropsWithChildren } from 'react'

import { Stack } from '@mntn-dev/ui-components'

export const FilePreviewSection = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <Stack direction="col" gap="2" className={className}>
      {children}
    </Stack>
  )
}
