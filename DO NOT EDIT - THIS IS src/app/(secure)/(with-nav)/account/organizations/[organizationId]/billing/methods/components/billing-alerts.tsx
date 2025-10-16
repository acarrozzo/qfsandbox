'use client'

import { useState } from 'react'

import type { ExternalCharge, OrganizationId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Stack, useToast } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { useFailedCharges } from '../../hooks/use-failed-charges.ts'
import { useRefreshBilling } from '../../hooks/use-refresh-billing.ts'
import { UpdatePaymentMethodAlert } from './alerts/update-payment-method-alert.tsx'

export const BillingAlerts = ({
  organizationId,
}: {
  organizationId: OrganizationId
}) => {
  const { showToast } = useToast()
  const { t } = useTranslation(['toast'])

  const [organization] =
    trpcReactClient.organizations.getOrganization.useSuspenseQuery({
      organizationId,
    })

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

      await refreshBilling({ organizationId })
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
