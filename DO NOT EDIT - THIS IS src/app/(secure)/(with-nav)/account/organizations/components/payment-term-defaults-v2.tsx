import type { TFunction } from 'i18next'
import { useMemo } from 'react'

import {
  type BillingProfileId,
  type BillingSchedule,
  BillingSchedules,
  type InvoiceTerms,
  InvoiceTermsMap,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Checkbox,
  Form,
  FormField,
  Select,
  Surface,
} from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

const getBillingScheduleOptions = (t: TFunction<['organization-details']>) =>
  Object.values(BillingSchedules).map((billingSchedule) => ({
    label: t(`organization-details:billing_schedules.${billingSchedule}`),
    value: billingSchedule,
  }))

const getInvoiceTermsOptions = (t: TFunction<['organization-details']>) =>
  Object.values(InvoiceTermsMap).map((invoiceTerms) => ({
    label: t(`organization-details:payment_terms.${invoiceTerms}`),
    value: invoiceTerms,
  }))

export const PaymentTermDefaults = ({
  billingProfileId,
}: {
  billingProfileId: BillingProfileId
}) => {
  const { t } = useTranslation(['organization-details'])

  const { data: billingProfile, refetch: refetchBillingProfile } =
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
    'Billing profile is required in PaymentTermDefaultsV2'
  )

  const updateBillingProfile =
    trpcReactClient.financeCoordinator.updateBillingProfile.useMutation({
      onSuccess: () => {
        refetchBillingProfile()
      },
    })

  const billingScheduleOptions = useMemo(
    () => getBillingScheduleOptions(t),
    [t]
  )
  const invoiceTermsOptions = useMemo(() => getInvoiceTermsOptions(t), [t])

  const handleBillingScheduleUpdate = async (
    billingSchedule: BillingSchedule
  ) => {
    await updateBillingProfile.mutateAsync({
      billingProfileId,
      billingSchedule,
    })
  }

  const handleInvoiceTermsUpdate = async (invoiceTerms: InvoiceTerms) => {
    await updateBillingProfile.mutateAsync({
      billingProfileId,
      invoiceTerms,
    })
  }

  const handleAMSCustomerCheck = async (isChecked: boolean) => {
    await updateBillingProfile.mutateAsync({
      billingProfileId,
      ams: isChecked,
    })
  }

  return (
    <Surface.Body>
      <Form.Layout>
        <FormField columnSpan={3}>
          <FormField.Label>
            {t('organization-details:payment-option')}
          </FormField.Label>
          <Select
            value={billingProfile?.billingSchedule}
            searchable={false}
            deselectable={false}
            placeholder={t('organization-details:invoice-payment-terms')}
            onChange={handleBillingScheduleUpdate}
            options={billingScheduleOptions}
            disabled={updateBillingProfile.isPending}
            dataTestId="billing-schedule-select"
            dataTrackingId="billing-schedule-select"
          />
        </FormField>
        <FormField columnSpan={3}>
          <FormField.Label>
            {t('organization-details:invoice-payment-terms')}
          </FormField.Label>
          <Select
            value={billingProfile?.invoiceTerms}
            searchable={false}
            deselectable={false}
            placeholder={t('organization-details:payment-option')}
            onChange={handleInvoiceTermsUpdate}
            options={invoiceTermsOptions}
            disabled={updateBillingProfile.isPending}
            dataTestId="invoice-terms-select"
            dataTrackingId="invoice-terms-select"
          />
        </FormField>
        <FormField columnSpan={3}>
          <FormField.Label>AMS Customer</FormField.Label>
          <Checkbox
            onChange={handleAMSCustomerCheck}
            value={billingProfile?.ams ?? false}
            dataTestId="ams-customer-checkbox"
            dataTrackingId="ams-customer-checkbox"
            disabled={updateBillingProfile.isPending}
          />
        </FormField>
      </Form.Layout>
    </Surface.Body>
  )
}
