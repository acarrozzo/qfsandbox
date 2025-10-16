import { type FormEvent, useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import {
  BillingElement,
  useBillingClient,
  useBillingElements,
} from '@mntn-dev/billing/client'
import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Form,
  Heading,
  SidebarLayoutContent,
  Stack,
  Surface,
  useToast,
} from '@mntn-dev/ui-components'
import { themeBorderColorMap } from '@mntn-dev/ui-theme'
import { assertExists, isNonEmptyArray } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefreshOrganizations } from '~/app/(secure)/(with-nav)/account/organizations/hooks/use-refresh-organizations.ts'

import { AccountBillingContext } from '../../../../../hooks/use-billing.tsx'

export default function BillingElements({
  billingProfileId,
}: {
  billingProfileId: BillingProfileId
}) {
  const { showToast } = useToast()
  const { customerQuery, paymentMethodsQuery, t } = AccountBillingContext()
  const { t: toastT } = useTranslation('toast')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const billingClient = useBillingClient()
  const billingElements = useBillingElements()
  const refreshOrganizations = useRefreshOrganizations()

  const { data: billingProfile } =
    trpcReactClient.financeCoordinator.getBillingProfile.useQuery(
      {
        billingProfileId,
      },
      {
        refetchOnMount: false,
      }
    )

  assertExists(billingProfile, 'Billing profile is required in BillingElements')

  const setBillingProfileDefaultCreditCard =
    trpcReactClient.financeCoordinator.setBillingProfileDefaultBillingServiceMethod.useMutation()

  const handleBackToBillingProfile = () => {
    router.push(
      route(
        '/account/organizations/:organizationId/billing/profiles/:billingProfileId'
      ).params({
        organizationId: billingProfile.organizationId,
        billingProfileId,
      })
    )
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    if (!(billingClient && billingElements)) {
      return null
    }

    const { error } = await billingClient.confirmSetup({
      elements: billingElements,
      redirect: 'if_required',
    })

    if (error) {
      showToast.error({
        title: toastT('finance.payment-method-failed.title'),
        body: error.message || toastT('finance.payment-method-failed.body'),
        dataTestId: 'payment-method-added-error-toast',
        dataTrackingId: 'payment-method-added-error-toast',
      })
      setLoading(false)
      return
    }

    const updatedPaymentMethods = await paymentMethodsQuery?.refetch()
    const updatedCustomer = await customerQuery.refetch()

    const paymentMethods = updatedPaymentMethods?.data?.paymentMethods
    const customerResult = updatedCustomer?.data

    if (
      customerResult &&
      !customerResult.invoiceSettings?.default_payment_method &&
      isNonEmptyArray(paymentMethods)
    ) {
      await setBillingProfileDefaultCreditCard.mutateAsync({
        billingProfileId,
        creditCardId: paymentMethods[0].id,
      })
    }

    await refreshOrganizations({
      organizationId: billingProfile.organizationId,
    })

    showToast.success({
      title: toastT('finance.payment-method-added.title'),
      body: toastT('finance.payment-method-added.body'),
      dataTestId: 'payment-method-added-success-toast',
      dataTrackingId: 'payment-method-added-success-toast',
    })

    handleBackToBillingProfile()
  }

  return (
    <Surface.Body className={`border rounded-lg ${themeBorderColorMap.muted}`}>
      <SidebarLayoutContent>
        <Stack
          direction="col"
          gap="4"
          dataTestId="add-new-payment-form"
          dataTrackingId="add-new-payment-form"
        >
          <Heading
            fontSize="2xl"
            dataTestId="add-new-payment-heading"
            dataTrackingId="add-new-payment-heading"
          >
            {t('add-new-payment')}
          </Heading>
          <Form onSubmit={handleSubmit}>
            <BillingElement />
            <Stack width="full" direction="col" gap="4">
              <Button
                type="submit"
                disabled={!billingClient}
                loading={loading}
                dataTestId="add-new-payment-submit-button"
                dataTrackingId="add-new-payment-submit-button"
              >
                {t('save')}
              </Button>
              <Button
                variant="text"
                onClick={handleBackToBillingProfile}
                dataTestId="add-new-payment-cancel-button"
                dataTrackingId="add-new-payment-cancel-button"
              >
                {t('cancel')}
              </Button>
            </Stack>
          </Form>
        </Stack>
      </SidebarLayoutContent>
    </Surface.Body>
  )
}
