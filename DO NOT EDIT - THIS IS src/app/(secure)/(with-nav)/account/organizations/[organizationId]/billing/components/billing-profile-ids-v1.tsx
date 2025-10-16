import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Form,
  FormField,
  Heading,
  LoadingCenter,
  Surface,
  Text,
} from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export type BillingProfileIdsProps = {
  billingProfileId: BillingProfileId
}

export const BillingProfileIds = ({
  billingProfileId,
}: BillingProfileIdsProps) => {
  const { t } = useTranslation(['finance'])

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

  return (
    <Surface border padding="8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Heading fontSize="xl">{t('finance:billingProfile.header')}</Heading>
        </div>
        {billingProfile ? (
          <Form.Layout>
            <FormField
              columnSpan={6}
              className="w-full"
              key={billingProfile.billingProfileId}
            >
              <FormField.Label>
                <Text textColor="caution">
                  {t('finance:billingProfile.billingProfileId')}
                </Text>
              </FormField.Label>
              <FormField.Control>
                <pre>{billingProfile.billingProfileId}</pre>
              </FormField.Control>
            </FormField>
            <FormField
              columnSpan={6}
              className="w-full"
              key={billingProfile.netsuiteId}
            >
              <FormField.Label>
                <Text textColor="caution">
                  {t('finance:billingProfile.netsuiteId')}
                </Text>
              </FormField.Label>
              <FormField.Control>
                <pre>{billingProfile.netsuiteId}</pre>
              </FormField.Control>
            </FormField>
          </Form.Layout>
        ) : (
          <div className="h-32">
            <LoadingCenter />
          </div>
        )}
      </div>
    </Surface>
  )
}
