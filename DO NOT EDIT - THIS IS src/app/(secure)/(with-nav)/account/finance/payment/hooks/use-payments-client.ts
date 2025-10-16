import { useMemo } from 'react'

import { client } from '@mntn-dev/payments-client'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export function usePaymentsClient() {
  const paymentsClient = useMemo(
    () => client({ queryClient: trpcReactClient.payments }),
    []
  )

  return {
    PayeeIframe: paymentsClient.PayeeIframe,
  }
}
