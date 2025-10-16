'use client'

import { useMemo } from 'react'

import {
  type BillingAppearance,
  getBillingClient,
} from '@mntn-dev/billing/client'
import type { BillingServiceCustomerId } from '@mntn-dev/billing/types'
import { env } from '@mntn-dev/env'
import { useTranslation } from '@mntn-dev/i18n'
import { createContext } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export function useBilling({ billingId }: UseBillingProps) {
  const { t } = useTranslation('billing')

  const billingClientPromise = getBillingClient(
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  )

  const billingAppearance: BillingAppearance = useMemo(
    () => ({
      theme: 'night',
      variables: {
        fontFamily: 'Inter, sans-serif',
        logoColor: 'dark',
      },
      rules: {
        '.Input': {
          backgroundColor: '#08192B',
        },
      },
    }),
    []
  )

  /** Data Fetchers **/
  const paymentMethodsQuery =
    trpcReactClient.billing.listPaymentMethods.useQuery(billingId)

  const customerQuery = trpcReactClient.billing.getCustomer.useQuery({
    customerId: billingId,
  })

  /** Return Values **/
  return {
    billingAppearance,
    billingClientPromise,
    billingId,
    customerQuery,
    paymentMethodsQuery,
    t,
  }
}

export type UseBillingProps = {
  billingId: BillingServiceCustomerId
}

export const [AccountBillingProvider, AccountBillingContext] = createContext<
  ReturnType<typeof useBilling>
>({
  name: 'AccountBillingContext',
})
