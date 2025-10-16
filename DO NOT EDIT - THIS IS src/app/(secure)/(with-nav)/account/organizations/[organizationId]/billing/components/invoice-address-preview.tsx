'use client'

import { useState } from 'react'

import type {
  BillingAddressDomainInsertModel,
  BillingProfileId,
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
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { InvoiceAddressModal } from './invoice-address-modal.tsx'

type InvoiceAddressPreviewProps = {
  billingProfileId: BillingProfileId
}

export const InvoiceAddressPreview = ({
  billingProfileId,
}: InvoiceAddressPreviewProps) => {
  const { data: billingProfile } =
    trpcReactClient.financeCoordinator.getBillingProfile.useQuery(
      {
        billingProfileId,
      },
      {
        refetchOnMount: false,
      }
    )

  const {
    me: { organizationId: meOrganizationId },
  } = useMe()
  const { hasPermission } = usePermissions()

  const { t } = useTranslation(['generic', 'finance'])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, refetch, isLoading } =
    trpcReactClient.financeCoordinator.getBillingProfileAddress.useQuery({
      billingProfileId,
    })

  const billingAddress = data?.billingProfileAddress

  const { mutate: upsertBillingAddress, isPending } =
    trpcReactClient.financeCoordinator.upsertBillingAddress.useMutation({
      onSuccess: () => {
        refetch()
        setIsModalOpen(false)
      },
    })

  const handleEditPaymentMethod = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = (data: BillingAddressDomainInsertModel) => {
    assertExists(
      billingProfile?.name,
      'Billing profile name is required in InvoiceAddressPreview'
    )
    upsertBillingAddress({
      billingProfileId: billingProfileId,
      billingProfileName: billingProfile.name,
      billingAddress: data,
    })
  }

  return (
    <>
      <Surface border padding="8">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Heading fontSize="xl">
              {t('finance:invoiceAddress.header')}
            </Heading>
            <div className="h-24">
              <LoadingCenter />
            </div>
          </div>
        ) : (
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-4">
              <Heading fontSize="xl">
                {t('finance:invoiceAddress.header')}
              </Heading>
              {billingAddress ? (
                <Stack gap="2" direction="col">
                  <Text fontSize="sm">{billingAddress.name}</Text>
                  <Text fontSize="sm">{billingAddress.address1}</Text>
                  {billingAddress.address2 && (
                    <Text fontSize="sm">{billingAddress.address2}</Text>
                  )}
                  <Text fontSize="sm">{`${billingAddress.city}, ${billingAddress.state} ${billingAddress.zip}`}</Text>
                </Stack>
              ) : (
                <Text textColor="caution">
                  {t('finance:invoiceAddress.noAddressAvailable')}
                </Text>
              )}
            </div>
            <Button
              size="sm"
              disabled={
                !(
                  meOrganizationId === billingProfile?.organizationId ||
                  hasPermission('customer-organization:administer')
                )
              }
              variant="secondary"
              onClick={handleEditPaymentMethod}
            >
              {t('generic:edit')}
            </Button>
          </div>
        )}
      </Surface>

      <InvoiceAddressModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        financeEntityId={billingProfileId}
        defaultValues={billingAddress}
        onSave={handleSubmit}
        isSaving={isPending}
      />
    </>
  )
}
