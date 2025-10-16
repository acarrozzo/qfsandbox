'use client'

import { useState } from 'react'

import type { BillingProfileId, ExternalCharge } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Stack, useToast } from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { useFailedCharges } from '../../../../hooks/use-failed-charges.ts'
import { useRefreshBilling } from '../../../../hooks/use-refresh-billing.ts'
import { UpdatePaymentMethodAlert } from './alerts/update-payment-method-alert.tsx'

export const BillingAlerts = ({
  billingProfileId,
}: {
  billingProfileId: BillingProfileId
}) => {
  const { showToast } = useToast()
  const { t } = useTranslation(['toast'])

  const { data: billingProfile } =
    trpcReactClient.financeCoordinator.getBillingProfile.useQuery(
      {
        billingProfileId,
      },
      {
        refetchOnMount: false,
      }
    )

  assertExists(billingProfile, 'Billing profile is required in BillingAlerts')

  const { data: organization } =
    trpcReactClient.organizations.getOrganization.useQuery(
      {
        organizationId: billingProfile.organizationId,
      },
      {
        refetchOnMount: false,
      }
    )

  const [activeRetryExternalChargeId, setActiveRetryExternalChargeId] =
    useState<number | undefined>()

  const { mutateAsync: retryExternalCharge, isPending } =
    trpcReactClient.finance.retryExternalCharge.useMutation({
      onError: () => {
        setActiveRetryExternalChargeId(undefined)
        showToast.error({
          title: t('toast:finance.retry-external-charge-failed.title'),
          body: t('toast:finance.retry-external-charge-failed.body'),
          dataTestId: 'retry-external-charge-failed-toast',
          dataTrackingId: 'retry-external-charge-failed-toast',
        })
      },
    })

  const refreshBilling = useRefreshBilling()

  const handleRetry =
    ({ externalChargeId, billingProfileId }: ExternalCharge) =>
    async () => {
      setActiveRetryExternalChargeId(externalChargeId)
      await retryExternalCharge({
        externalChargeId,
        billingProfileId,
      })

      await refreshBilling({ organizationId: billingProfile.organizationId })
    }

  const failedCharges = useFailedCharges({ organization })

  return failedCharges.length > 0 ? (
    <Stack className="w-full max-w-2xl mx-auto mb-4" direction="col" gap="4">
      {failedCharges.map((charge) => (
        <UpdatePaymentMethodAlert
          key={charge.externalChargeId}
          charge={charge}
          onRetry={handleRetry(charge)}
          isBusy={activeRetryExternalChargeId === charge.externalChargeId}
          isDisabled={isPending}
        />
      ))}
    </Stack>
  ) : null
}
