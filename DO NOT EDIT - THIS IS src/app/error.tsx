'use client'

import type { AppRouterErrorProps } from '@highlight-run/next/ssr'

import { CenteredLayout } from '@mntn-dev/ui-components'

import { ErrorLayout } from '~/components/error/error-layout'

export default function Page({ error }: AppRouterErrorProps) {
  // biome-ignore lint/suspicious/noConsole: Log the error for debugging purposes
  console.error('ErrorPage', error)

  // currently this error object does not return an error code, so for now we assume it is always 500.
  return (
    <CenteredLayout>
      <ErrorLayout code={500} />
    </CenteredLayout>
  )
}
