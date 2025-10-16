'use client'

import { getCreditCardUrl } from '@mntn-dev/app-assets'
import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type {
  BillingProfileId,
  BillingServiceMethod,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Heading,
  LoadingCenter,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useMe } from '~/hooks/secure/use-me.ts'

type BillingMethodPreviewProps = {
  billingProfileId: BillingProfileId
}

export const BillingMethodPreview = ({
  billingProfileId,
}: BillingMethodPreviewProps) => {
  const { data: billingProfile } =
    trpcReactClient.financeCoordinator.getBillingProfile.useQuery(
      {
        billingProfileId,
      },
      {
        refetchOnMount: false,
      }
    )

  assertExists(billingProfile, 'Billing profile is required')

  const {
    me: { organizationId: meOrganizationId },
  } = useMe()

  const { t } = useTranslation(['generic', 'finance'])
  const router = useRouter()

  const { data, isLoading } =
    trpcReactClient.organizations.getOrganizationDefaultBillingServiceMethod.useQuery(
      {
        organizationId: billingProfile.organizationId,
      }
    )

  const paymentMethod = data?.paymentMethod

  const handleEditPaymentMethod = () => {
    router.push(
      route('/account/organizations/:organizationId/billing/methods').params({
        organizationId: billingProfile.organizationId,
      })
    )
  }

  return (
    <Surface border padding="8">
      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Heading fontSize="xl">{t('finance:paymentMethod')}</Heading>
          <div className="h-16">
            <LoadingCenter />
          </div>
        </div>
      ) : (
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col gap-4">
            <Heading fontSize="xl">{t('finance:paymentMethod')}</Heading>
            <BillingMethodDetails paymentMethod={paymentMethod} />
          </div>
          <Button
            size="sm"
            disabled={meOrganizationId !== billingProfile.organizationId}
            variant="secondary"
            onClick={handleEditPaymentMethod}
          >
            {t('generic:edit')}
          </Button>
        </div>
      )}
    </Surface>
  )
}

type BillingMethodDetailsProps = {
  paymentMethod?: BillingServiceMethod
}

const BillingMethodDetails = ({ paymentMethod }: BillingMethodDetailsProps) => {
  const { t } = useTranslation(['generic', 'finance'])

  if (paymentMethod?.type !== 'card' || !paymentMethod.card) {
    return <Text textColor="caution">{t('finance:paymentMethodNotSet')}</Text>
  }

  const {
    card: { brand, last4, exp_month, exp_year },
  } = paymentMethod

  return (
    <Stack gap="4" direction="row" alignItems="center" justifyContent="center">
      {/** biome-ignore lint/performance/noImgElement: stripe card logo image */}
      <img className="h-8" src={getCreditCardUrl(brand)} alt={brand} />
      <Stack direction="col">
        <Text fontSize="lg" className="capitalize">
          {brand}...{last4}
        </Text>
        <Text textColor="secondary" fontSize="sm">
          {t('finance:expires')} {exp_month}/{exp_year}
        </Text>
      </Stack>
    </Stack>
  )
}
