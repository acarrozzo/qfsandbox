import { motion } from 'motion/react'
import { useState } from 'react'

import type { BillingProfileId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Heading,
  LoadingCenter,
  Surface,
  Text,
} from '@mntn-dev/ui-components'
import { assertExists, isNonEmptyArray } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useMe } from '~/hooks/secure/use-me.ts'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { InvoiceContactCard } from './invoice-contact-card-v2.tsx'
import { InvoiceContactForm } from './invoice-contact-form.tsx'

export type InvoiceContactsListProps = {
  billingProfileId: BillingProfileId
}

export const InvoiceContactsList = ({
  billingProfileId,
}: InvoiceContactsListProps) => {
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
  const { t } = useTranslation(['generic', 'finance'])
  const [isAddingContact, setIsAddingContact] = useState(false)

  const {
    me: { organizationId: meOrganizationId },
  } = useMe()

  const {
    data: invoiceContacts,
    refetch,
    isLoading,
  } = trpcReactClient.financeCoordinator.listBillingProfileContacts.useQuery({
    billingProfileId: billingProfileId,
  })

  const { mutate: deleteBillingProfileContact, isPending: isDeleting } =
    trpcReactClient.financeCoordinator.deleteBillingProfileContact.useMutation({
      onSuccess: () => {
        refetch()
      },
    })

  const { mutate: addBillingProfileContact, isPending: isCreating } =
    trpcReactClient.financeCoordinator.addBillingProfileContact.useMutation({
      onSuccess: () => {
        refetch()
        setIsAddingContact(false)
      },
    })

  const { mutate: updateBillingContact, isPending: isUpdating } =
    trpcReactClient.financeCoordinator.updateBillingContact.useMutation({
      onSuccess: () => {
        refetch()
      },
    })

  const handleDeleteContact = (contactId: string) => {
    deleteBillingProfileContact({
      billingProfileId: billingProfileId,
      billingContactId: contactId,
    })
  }

  const handleAddContact = (
    firstName: string,
    lastName: string,
    email: string
  ) => {
    assertExists(
      billingProfile.name,
      'Billing profile name is required in InvoiceContactsList'
    )
    addBillingProfileContact({
      billingProfileId: billingProfileId,
      billingProfileName: billingProfile.name,
      billingContact: {
        firstName,
        lastName,
        email,
      },
    })
  }

  const handleCancelAdd = () => {
    setIsAddingContact(false)
  }

  const handleUpdateContact = (
    contactId: string,
    firstName: string,
    lastName: string,
    email: string
  ) => {
    updateBillingContact({
      billingProfileId: billingProfileId,
      billingContact: {
        billingContactId: contactId,
        firstName,
        lastName,
        email,
      },
    })
  }

  const canUpdate =
    meOrganizationId === billingProfile.organizationId ||
    hasPermission('customer-organization:administer')
  const isDisabled = !canUpdate || isDeleting || isCreating || isUpdating

  return (
    <Surface border padding="8">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Heading fontSize="xl">{t('finance:invoiceContacts.header')}</Heading>
        </div>

        {isLoading ? (
          <div className="h-32">
            <LoadingCenter />
          </div>
        ) : (
          <div className="flex flex-col gap-3 list-none">
            {invoiceContacts && isNonEmptyArray(invoiceContacts) ? (
              invoiceContacts.map((contact) => (
                <motion.li key={contact.billingContactId} layout>
                  <InvoiceContactCard
                    key={contact.billingContactId}
                    name={`${contact.firstName} ${contact.lastName}`}
                    email={contact.email}
                    contactId={contact.billingContactId}
                    firstName={contact.firstName}
                    lastName={contact.lastName}
                    onDelete={handleDeleteContact}
                    onUpdate={handleUpdateContact}
                    disabled={isDisabled}
                  />
                </motion.li>
              ))
            ) : (
              <Text textColor="caution">
                {t('finance:invoiceContacts.noContacts')}
              </Text>
            )}

            {isAddingContact && (
              <InvoiceContactForm
                onSubmit={handleAddContact}
                onCancel={handleCancelAdd}
                isSubmitting={isCreating}
              />
            )}
          </div>
        )}

        {!isAddingContact && (
          <div>
            <Button
              variant="secondary"
              size="sm"
              disabled={isDisabled}
              onClick={() => setIsAddingContact(true)}
              className="w-full"
            >
              {t('finance:invoiceContacts.addContact')}
            </Button>
          </div>
        )}
      </div>
    </Surface>
  )
}
