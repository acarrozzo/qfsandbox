'use client'

import type { PaymentsClientRequest } from '@mntn-dev/payments-shared'
import { PaymentsClientRequestSchema } from '@mntn-dev/payments-shared'
import { SidebarLayoutContent, Stack } from '@mntn-dev/ui-components'

import { useCanShowPaymentsFeatures } from '~/hooks/secure/use-can-show-payments-features.ts'

import { usePaymentsClient } from './hooks/use-payments-client'

export default function PayeeSetup({
  request,
  iframeUrl,
}: {
  request: PaymentsClientRequest
  iframeUrl?: string
}) {
  const { PayeeIframe } = usePaymentsClient()

  // PaymentsClientRequest always has a payeeId, but just in case, let's parse it
  const paymentsClientRequest = PaymentsClientRequestSchema.parse(request)

  const canShowPaymentsFeatures = useCanShowPaymentsFeatures()

  if (!canShowPaymentsFeatures) {
    return null
  }

  return (
    <SidebarLayoutContent>
      <Stack
        dataTestId="payee-setup-iframe"
        dataTrackingId="payee-setup-iframe"
      >
        <PayeeIframe request={paymentsClientRequest} initialURL={iframeUrl} />
      </Stack>
    </SidebarLayoutContent>
  )
}
