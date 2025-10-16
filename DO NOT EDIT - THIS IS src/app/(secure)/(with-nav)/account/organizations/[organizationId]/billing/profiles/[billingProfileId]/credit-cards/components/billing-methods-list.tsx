'use client'

import { motion } from 'motion/react'
import { useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type {
  BillingProfileId,
  BillingServiceCustomer,
  BillingServiceMethod,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Heading,
  Stack,
  Surface,
  useToast,
} from '@mntn-dev/ui-components'
import { themeBorderColorMap } from '@mntn-dev/ui-theme'
import { assertExists, isNonEmptyArray } from '@mntn-dev/utilities'

import { CenteredLoadingSpinner } from '#components/shared/centered-loading-spinner.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { BillingLogger } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/utils/billing-logger.ts'

import { BillingMethodCard } from './billing-method-card'
import { BillingMethodsEmpty } from './billing-methods-empty'

export function BillingMethodsList({
  billingProfileId,
}: {
  billingProfileId: BillingProfileId
}) {
  const { t: toastT } = useTranslation('toast')
  const { t } = useTranslation('billing')

  const { showToast } = useToast()
  const router = useRouter()

  const { data: billingProfile } =
    trpcReactClient.financeCoordinator.getBillingProfile.useQuery(
      {
        billingProfileId,
      },
      {
        refetchOnMount: false,
      }
    )

  assertExists(
    billingProfile,
    'Billing profile is required in BillingMethodsList'
  )

  const [becomingDefault, setBecomingDefault] = useState<string | undefined>(
    undefined
  )

  const {
    data: customerResult,
    isLoading: customerLoading,
    refetch: refetchCustomer,
  } = trpcReactClient.financeCoordinator.getBillingServiceCustomer.useQuery(
    {
      billingServiceCustomerId: billingProfile.billingServiceId,
    },
    {
      refetchOnMount: false,
    }
  )

  const {
    data: paymentMethodsResult,
    isLoading: paymentMethodsLoading,
    refetch: refetchPaymentMethods,
  } = trpcReactClient.financeCoordinator.listBillingProfileBillingServiceMethods.useQuery(
    {
      billingProfileId,
    },
    {
      refetchOnMount: false,
    }
  )

  const unsortedPaymentMethods = paymentMethodsResult?.paymentMethods ?? []

  const setBillingProfileDefaultCreditCard =
    trpcReactClient.financeCoordinator.setBillingProfileDefaultBillingServiceMethod.useMutation()

  const detachPaymentMethod =
    trpcReactClient.financeCoordinator.detachBillingProfileBillingMethod.useMutation()

  const handleAddPaymentMethodClick = () => {
    router.push(
      route(
        '/account/organizations/:organizationId/billing/profiles/:billingProfileId/credit-cards/add-card'
      ).params({
        billingProfileId,
        organizationId: billingProfile.organizationId,
      })
    )
    router.refresh() // force server load for target page to generate new client secret
  }

  const handleDeleteClick = (paymentMethodId: string) => async () => {
    try {
      await detachPaymentMethod.mutateAsync({
        billingProfileId,
        billingMethod: paymentMethodId,
      })
      await refetchCustomer()
      await refetchPaymentMethods()
      showToast.success({
        title: toastT('finance.payment-method-deleted.title'),
        body: toastT('finance.payment-method-deleted.body'),
        dataTestId: 'payment-method-deleted-success-toast',
        dataTrackingId: 'payment-method-deleted-success-toast',
      })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t('unknown-error')
      BillingLogger.error(errorMessage, { error })
    }
  }

  const handleMakeDefaultClick = (paymentMethodId: string) => async () => {
    try {
      setBecomingDefault(paymentMethodId)
      await setBillingProfileDefaultCreditCard.mutateAsync({
        billingProfileId,
        creditCardId: paymentMethodId,
      })
      await refetchCustomer()
      await refetchPaymentMethods()
      showToast.success({
        title: toastT('finance.payment-method-default-changed.title'),
        body: toastT('finance.payment-method-default-changed.body'),
        dataTestId: 'payment-method-deleted-success-toast',
        dataTrackingId: 'payment-method-deleted-success-toast',
      })
      setBecomingDefault(undefined)
    } catch (error) {
      setBecomingDefault(undefined)
      const errorMessage =
        error instanceof Error ? error.message : t('unknown-error')
      BillingLogger.error(errorMessage, { error })
    }
  }

  const paymentMethods = sortedPaymentMethods(
    unsortedPaymentMethods,
    customerResult?.billingServiceCustomer?.invoiceSettings
      ?.default_payment_method
  )

  const isLoading = customerLoading || paymentMethodsLoading

  if (isLoading) {
    return <CenteredLoadingSpinner />
  }

  return (
    <Surface.Body
      className={`border rounded-lg ${themeBorderColorMap.muted}`}
      dataTestId="payment-methods-list"
      dataTrackingId="payment-methods-list"
    >
      <Stack padding="8" direction="col" gap="8">
        <Stack justifyContent="between" alignItems="center">
          <Heading fontSize="2xl" dataTestId="your-payment-methods-heading">
            {t('your-payment-methods')}
          </Heading>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddPaymentMethodClick}
            dataTestId="add-payment-method-button"
            dataTrackingId="add-payment-method-button"
          >
            {t('add-payment-method')}
          </Button>
        </Stack>
        <ul className="flex flex-col gap-1">
          {
            <RenderPaymentMethods
              billingCustomer={customerResult?.billingServiceCustomer}
              becomingDefault={becomingDefault}
              paymentMethods={paymentMethods}
              onAddPaymentMethodClick={handleAddPaymentMethodClick}
              onDeleteClick={handleDeleteClick}
              onMakeDefaultClick={handleMakeDefaultClick}
            />
          }
        </ul>
      </Stack>
    </Surface.Body>
  )
}

const RenderPaymentMethods = ({
  becomingDefault,
  billingCustomer,
  paymentMethods,
  onAddPaymentMethodClick,
  onDeleteClick,
  onMakeDefaultClick,
}: {
  billingCustomer?: BillingServiceCustomer
  becomingDefault: string | undefined
  paymentMethods: Array<BillingServiceMethod>
  onAddPaymentMethodClick: () => void
  onDeleteClick: (paymentMethodId: string) => () => Promise<void>
  onMakeDefaultClick: (paymentMethodId: string) => () => Promise<void>
}) => {
  if (isNonEmptyArray(paymentMethods)) {
    return paymentMethods.map((method) => (
      <motion.li key={method.id} layout>
        <BillingMethodCard
          key={method.id}
          brand={method.card?.brand || 'unknown'}
          last4={method.card?.last4 || '****'}
          expMonth={method.card?.exp_month || 0}
          expYear={method.card?.exp_year || 0}
          isDefault={
            method.id ===
            billingCustomer?.invoiceSettings?.default_payment_method
          }
          loading={becomingDefault === method.id}
          readonly={becomingDefault !== undefined}
          onDelete={onDeleteClick(method.id)}
          onMakeDefault={onMakeDefaultClick(method.id)}
        />
      </motion.li>
    ))
  }

  return (
    <BillingMethodsEmpty onAddBillingMethodClick={onAddPaymentMethodClick} />
  )
}

export const sortedPaymentMethods = (
  paymentMethods: BillingServiceMethod[],
  defaultMethodId?: string | null | BillingServiceMethod
) => {
  return paymentMethods
    .slice()
    .sort((a: BillingServiceMethod, b: BillingServiceMethod) => {
      // Move the default payment method to the top
      if (defaultMethodId) {
        if (a.id === defaultMethodId) {
          return -1
        }

        if (b.id === defaultMethodId) {
          return 1
        }
      }

      // Otherwise, sort by creation timestamp
      return a.created && b.created ? a.created - b.created : 0
    })
}
