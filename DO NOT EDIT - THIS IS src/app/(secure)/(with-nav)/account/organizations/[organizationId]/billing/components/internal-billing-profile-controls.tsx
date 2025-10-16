import { Surface } from 'node_modules/@mntn-dev/ui-components/src/components/surface/surface.tsx'

import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { forwardRef, Heading } from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { BillingProfileCreditBalances } from '~/app/(secure)/(with-nav)/account/organizations/[organizationId]/billing/components/billing-profile-credit-balances.tsx'
import { PaymentTermDefaults } from '~/app/(secure)/(with-nav)/account/organizations/components/payment-term-defaults-v2'

type InternalBillingProfileControlsProps = {
  billingProfileId: BillingProfileId
}

export const InternalBillingProfileControls = forwardRef<
  HTMLDivElement,
  InternalBillingProfileControlsProps
>(({ billingProfileId }, ref) => {
  const { t } = useTranslation(['organization-details'])

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
    'Billing profile is required in InternalBillingProfileControlsV2'
  )

  return (
    <Surface ref={ref} border padding="6">
      <Surface.Header className="p-4">
        <Heading fontSize="xl" fontWeight="bold" textColor="primary">
          {t('organization-details:internal.partner-programs.title.brand')}
        </Heading>
      </Surface.Header>
      <PaymentTermDefaults billingProfileId={billingProfileId} />
      <BillingProfileCreditBalances billingProfileId={billingProfileId} />
    </Surface>
  )
})
