import { Button, Icon, Stack, Surface, Text } from '@mntn-dev/ui-components'

export type InvoiceContactCardProps = {
  name: string
  email: string
  contactId: string
  onDelete: (id: string) => void
  disabled: boolean
}

export const InvoiceContactCard = ({
  name,
  email,
  contactId,
  onDelete,
  disabled,
}: InvoiceContactCardProps) => {
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
        <Button
          type="button"
          variant="secondary"
          onClick={() => onDelete(contactId)}
          disabled={disabled}
        >
          <Icon name="delete-bin" size="md" />
        </Button>
      </Stack>
    </Surface>
  )
}
