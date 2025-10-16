'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Heading, Surface, Text } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useMe } from '~/hooks/secure/use-me.ts'

type PaymentSetupPreviewProps = {
  organizationId: OrganizationId
}

export const PaymentSetupPreview = ({
  organizationId,
}: PaymentSetupPreviewProps) => {
  const {
    me: { organizationId: meOrganizationId },
  } = useMe()

  const { t } = useTranslation(['generic', 'finance'])
  const router = useRouter()

  const { data: organization } =
    trpcReactClient.organizations.getOrganization.useQuery({
      organizationId,
    })

  const handleSetupPayment = () => {
    router.push(
      route('/account/organizations/:organizationId/payments/setup').params({
        organizationId,
      })
    )
  }

  const paymentsSetupComplete = organization?.payeeId && organization.isPayable

  const buttonText = paymentsSetupComplete
    ? t('generic:edit')
    : t('generic:setup')

  return (
    <Surface border padding="8">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-4">
          <Heading fontSize="xl">{t('finance:paymentSetup')}</Heading>
          <PaymentSetupDetails paymentsSetupComplete={paymentsSetupComplete} />
        </div>
        <Button
          size="sm"
          disabled={meOrganizationId !== organizationId}
          variant="secondary"
          onClick={handleSetupPayment}
        >
          {buttonText}
        </Button>
      </div>
    </Surface>
  )
}

type BillingMethodDetailsProps = {
  paymentsSetupComplete?: boolean
}

const PaymentSetupDetails = ({
  paymentsSetupComplete,
}: BillingMethodDetailsProps) => {
  const { t } = useTranslation(['generic', 'finance'])

  if (!paymentsSetupComplete) {
    return <Text>{t('finance:paymentsSetupNotComplete')}</Text>
  }

  return <Text>{t('finance:paymentsSetupComplete')}</Text>
}
