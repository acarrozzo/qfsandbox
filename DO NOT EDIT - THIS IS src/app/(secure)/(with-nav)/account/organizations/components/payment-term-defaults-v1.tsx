import type { TFunction } from 'i18next'
import { useMemo } from 'react'

import {
  type BillingProfileDomainSelectModel,
  type BillingSchedule,
  BillingSchedules,
  type InvoiceTerms,
  InvoiceTermsMap,
  type OrganizationId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Checkbox,
  Form,
  FormField,
  Select,
  Surface,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefreshOrganizations } from '~/app/(secure)/(with-nav)/account/organizations/hooks/use-refresh-organizations.ts'

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
  organizationId,
  billingProfile,
}: {
  organizationId: OrganizationId
  billingProfile?: BillingProfileDomainSelectModel
}) => {
  const { t } = useTranslation(['organization-details'])
  const setOrganizationBillingProfile =
    trpcReactClient.finance.setOrganizationBillingProfile.useMutation()

  const refreshOrganization = useRefreshOrganizations()

  const billingScheduleOptions = useMemo(
    () => getBillingScheduleOptions(t),
    [t]
  )
  const invoiceTermsOptions = useMemo(() => getInvoiceTermsOptions(t), [t])

  const handleBillingScheduleUpdate = async (
    billingSchedule: BillingSchedule
  ) => {
    await setOrganizationBillingProfile.mutateAsync({
      organizationId,
      billingProfile: { billingSchedule },
    })

    refreshOrganization({ organizationId })
  }

  const handleInvoiceTermsUpdate = async (invoiceTerms: InvoiceTerms) => {
    await setOrganizationBillingProfile.mutateAsync({
      organizationId,
      billingProfile: { invoiceTerms },
    })

    refreshOrganization({ organizationId })
  }

  const handleAMSCustomerCheck = async (isChecked: boolean) => {
    await setOrganizationBillingProfile.mutateAsync({
      organizationId,
      billingProfile: { ams: isChecked },
    })

    refreshOrganization({ organizationId })
  }

  return (
    <Surface.Body>
      <Form.Layout>
        <FormField columnSpan={3}>
          <FormField.Label>
            {t('organization-details:payment-option')}
          </FormField.Label>
          <Select
            searchable={false}
            deselectable={false}
            defaultValue={billingProfile?.billingSchedule}
            placeholder={t('organization-details:invoice-payment-terms')}
            onChange={handleBillingScheduleUpdate}
            options={billingScheduleOptions}
            disabled={setOrganizationBillingProfile.isPending}
            dataTestId="billing-schedule-select"
            dataTrackingId="billing-schedule-select"
          />
        </FormField>
        <FormField columnSpan={3}>
          <FormField.Label>
            {t('organization-details:invoice-payment-terms')}
          </FormField.Label>
          <Select
            searchable={false}
            deselectable={false}
            defaultValue={billingProfile?.invoiceTerms}
            placeholder={t('organization-details:payment-option')}
            onChange={handleInvoiceTermsUpdate}
            options={invoiceTermsOptions}
            disabled={setOrganizationBillingProfile.isPending}
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
            disabled={setOrganizationBillingProfile.isPending}
          />
        </FormField>
      </Form.Layout>
    </Surface.Body>
  )
}
