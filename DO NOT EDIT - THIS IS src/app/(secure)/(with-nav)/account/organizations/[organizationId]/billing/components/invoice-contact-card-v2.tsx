import { useState } from 'react'

import { Button, Icon, Stack, Surface, Text } from '@mntn-dev/ui-components'

import { InvoiceContactEditForm } from './invoice-contact-edit-form.tsx'

export type InvoiceContactCardProps = {
  name: string
  email: string
  contactId: string
  firstName: string
  lastName: string
  onDelete: (id: string) => void
  onUpdate: (
    contactId: string,
    firstName: string,
    lastName: string,
    email: string
  ) => void
  disabled: boolean
}

export const InvoiceContactCard = ({
  name,
  email,
  contactId,
  firstName,
  lastName,
  onDelete,
  onUpdate,
  disabled,
}: InvoiceContactCardProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleUpdate = (
    updatedFirstName: string,
    updatedLastName: string,
    updatedEmail: string
  ) => {
    onUpdate(contactId, updatedFirstName, updatedLastName, updatedEmail)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <InvoiceContactEditForm
        firstName={firstName}
        lastName={lastName}
        email={email}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        isSubmitting={disabled}
      />
    )
  }

  return (
    <Surface
      border={true}
      borderColor="muted"
      padding="4"
      borderRadius="med"
      backgroundColor="container-tertiary"
    >
      <Stack direction="row" justifyContent="between" alignItems="center">
        <Stack direction="row" gap="4" alignItems="center">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary-800 rounded-full">
            <Icon name="user" color="brand" size="xl" />
          </div>
          <Stack direction="col">
            <Text fontSize="lg">{name}</Text>
            <Text fontSize="sm" textColor="secondary">
              {email}
            </Text>
          </Stack>
        </Stack>
        <Stack direction="row" gap="2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleEdit}
            disabled={disabled}
          >
            <Icon name="pencil" size="md" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onDelete(contactId)}
            disabled={disabled}
          >
            <Icon name="delete-bin" size="md" />
          </Button>
        </Stack>
      </Stack>
    </Surface>
  )
}
