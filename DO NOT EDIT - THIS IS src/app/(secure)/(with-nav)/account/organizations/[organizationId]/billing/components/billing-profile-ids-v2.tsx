import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { logger } from '@mntn-dev/logger'
import {
  Editable,
  Form,
  FormField,
  getTestProps,
  Heading,
  Icon,
  LoadingCenter,
  Surface,
  Text,
  useToast,
} from '@mntn-dev/ui-components'
import { assertExists } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useMe } from '~/hooks/secure/use-me.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

export type BillingProfileIdsProps = {
  billingProfileId: BillingProfileId
}

export const BillingProfileIds = ({
  billingProfileId,
}: BillingProfileIdsProps) => {
  const { t } = useTranslation(['finance', 'toast', 'billing-profile'])
  const { t: tToast } = useTranslation(['toast'])
  const { showToast } = useToast()
  const {
    me: { organizationId },
  } = useMe()

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

  const { hasPermission } = usePermissions()

  const updateBillingProfile =
    trpcReactClient.billingProfiles.updateBillingProfile.useMutation()

  const handleNameUpdate = async (newName: string) => {
    try {
      await updateBillingProfile.mutateAsync({
        billingProfileId,
        name: newName,
      })

      showToast.success({
        title: tToast('toast:billing-profile.name-updated.title'),
        body: tToast('toast:billing-profile.name-updated.body'),
        dataTestId: 'billing-profile-name-updated-success-toast',
        dataTrackingId: 'billing-profile-name-updated-success-toast',
      })
    } catch {
      logger.error('Failed to update billing profile name', {
        billingProfileId,
        newName,
      })

      showToast.error({
        title: tToast('toast:billing-profile.name-update-failed.title'),
        body: tToast('toast:billing-profile.name-update-failed.body'),
        dataTestId: 'billing-profile-name-updated-error-toast',
        dataTrackingId: 'billing-profile-name-updated-error-toast',
      })
    }
  }

  const handleCopyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showToast.success({
        title: tToast('toast:billing-profile.copied-to-clipboard.title'),
        body: tToast('toast:billing-profile.copied-to-clipboard.body', {
          field: fieldName,
        }),
        dataTestId: 'billing-profile-copied-to-clipboard-success-toast',
        dataTrackingId: 'billing-profile-copied-to-clipboard-success-toast',
      })
    } catch (error) {
      logger.error('Failed to copy to clipboard', {
        text,
        fieldName,
        error,
      })

      showToast.error({
        title: tToast('toast:billing-profile.copy-to-clipboard-failed.title'),
        body: tToast('toast:billing-profile.copy-to-clipboard-failed.body'),
        dataTestId: 'billing-profile-copy-to-clipboard-error-toast',
        dataTrackingId: 'billing-profile-copy-to-clipboard-error-toast',
      })
    }
  }

  const canEditName =
    hasPermission('customer-organization:administer') ||
    (hasPermission('own-organization:administer') &&
      billingProfile.organizationId === organizationId)

  return (
    <Surface border padding="8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Heading fontSize="xl">{t('finance:billingProfile.header')}</Heading>
        </div>
        {billingProfile ? (
          <Form.Layout>
            <FormField columnSpan={6} className="w-full">
              <FormField.Label>
                {t('finance:billingProfile.profileName')}
              </FormField.Label>
              <FormField.Control>
                <Editable
                  key={billingProfile.name}
                  initialValue={billingProfile.name}
                  placeholder={t(
                    'billing-profile:placeholder.billingProfileName'
                  )}
                  readOnly={!canEditName}
                  onUpdate={handleNameUpdate}
                  dataTestId="billing-profile-name-editable"
                  className="text-lg font-semibold"
                />
              </FormField.Control>
            </FormField>

            {hasPermission('customer-organization:administer') && (
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
                  <div className="flex items-center gap-2">
                    <pre
                      className="cursor-pointer hover:bg-gray-600 p-2 rounded transition-colors flex-1"
                      onClick={() =>
                        handleCopyToClipboard(
                          billingProfile.billingProfileId,
                          t('finance:billingProfile.billingProfileId')
                        )
                      }
                      {...getTestProps({
                        dataTestId: 'billing-profile-id-copy',
                        dataTrackingId: 'billing-profile-id-copy',
                      })}
                    >
                      {billingProfile.billingProfileId}
                    </pre>
                    <Icon
                      name="copy"
                      size="sm"
                      color="brand"
                      className="cursor-pointer hover:text-gray-600 transition-colors"
                      onClick={() =>
                        handleCopyToClipboard(
                          billingProfile.billingProfileId,
                          t('finance:billingProfile.billingProfileId')
                        )
                      }
                      dataTestId="billing-profile-id-copy-icon"
                      dataTrackingId="billing-profile-id-copy-icon"
                    />
                  </div>
                </FormField.Control>
              </FormField>
            )}

            {hasPermission('customer-organization:administer') && (
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
                  <div className="flex items-center gap-2">
                    <pre
                      className="cursor-pointer hover:bg-gray-600 p-2 rounded transition-colors flex-1"
                      onClick={() =>
                        handleCopyToClipboard(
                          billingProfile.netsuiteId,
                          t('finance:billingProfile.netsuiteId')
                        )
                      }
                      {...getTestProps({
                        dataTestId: 'netsuite-id-copy',
                        dataTrackingId: 'netsuite-id-copy',
                      })}
                    >
                      {billingProfile.netsuiteId}
                    </pre>
                    <Icon
                      name="copy"
                      size="sm"
                      color="brand"
                      className="cursor-pointer hover:text-gray-600 transition-colors"
                      onClick={() =>
                        handleCopyToClipboard(
                          billingProfile.netsuiteId,
                          t('finance:billingProfile.netsuiteId')
                        )
                      }
                      dataTestId="netsuite-id-copy-icon"
                      dataTrackingId="netsuite-id-copy-icon"
                    />
                  </div>
                </FormField.Control>
              </FormField>
            )}
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
