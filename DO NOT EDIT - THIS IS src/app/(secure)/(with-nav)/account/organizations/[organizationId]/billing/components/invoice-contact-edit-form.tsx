import { useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  AutoInput,
  Button,
  Form,
  FormField,
  Stack,
  Surface,
} from '@mntn-dev/ui-components'

type BillingContactFormData = {
  firstName: string
  lastName: string
  email: string
}

export type InvoiceContactEditFormProps = {
  firstName: string
  lastName: string
  email: string
  onSubmit: (firstName: string, lastName: string, email: string) => void
  onCancel: () => void
  isSubmitting: boolean
}

const emailRegex = /\S+@\S+\.\S+/

export const InvoiceContactEditForm = ({
  firstName,
  lastName,
  email,
  onSubmit,
  onCancel,
  isSubmitting,
}: InvoiceContactEditFormProps) => {
  const { t } = useTranslation([
    'generic',
    'finance',
    'validation',
    'billing',
    'user-create',
  ])

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      firstName,
      lastName,
      email,
    },
  })

  const handleFormSubmit = (data: BillingContactFormData) => {
    onSubmit(data.firstName, data.lastName, data.email)
  }

  return (
    <Surface border>
      <Form
        onSubmit={handleSubmit(handleFormSubmit)}
        id="invoice-contact-edit-form"
        className="p-4 rounded-md bg-secondary-900"
      >
        <Stack direction="col" gap="4">
          <Form.Layout>
            <FormField
              columnSpan={3}
              className="w-full"
              hasError={!!errors.firstName}
            >
              <FormField.Label>
                {t('billing:billing-profile.create.field.firstName')}
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('firstName', {
                    required: t('validation:field.required', {
                      field: t(
                        'billing:billing-profile.create.field.firstName'
                      ),
                    }),
                  })}
                  disabled={isSubmitting}
                  autoFocus
                  placeholder={t('user-create:field.firstName.placeholder')}
                />
              </FormField.Control>
              <FormField.Error>{errors.firstName?.message}</FormField.Error>
            </FormField>

            <FormField
              columnSpan={3}
              className="w-full"
              hasError={!!errors.lastName}
            >
              <FormField.Label>
                {t('billing:billing-profile.create.field.lastName')}
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('lastName', {
                    required: t('validation:field.required', {
                      field: t('billing:billing-profile.create.field.lastName'),
                    }),
                  })}
                  disabled={isSubmitting}
                  placeholder={t('user-create:field.lastName.placeholder')}
                />
              </FormField.Control>
              <FormField.Error>{errors.lastName?.message}</FormField.Error>
            </FormField>

            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.email}
            >
              <FormField.Label>
                {t('billing:billing-profile.create.field.emailAddress')}
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('email', {
                    required: t('validation:field.required', {
                      field: t(
                        'billing:billing-profile.create.field.emailAddress'
                      ),
                    }),
                    pattern: {
                      value: emailRegex,
                      message: t('validation:field.email'),
                    },
                  })}
                  disabled={isSubmitting}
                  placeholder={t('user-create:field.emailAddress.placeholder')}
                  type="email"
                />
              </FormField.Control>
              <FormField.Error>{errors.email?.message}</FormField.Error>
            </FormField>

            <FormField columnSpan={3} className="w-full">
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isSubmitting}
                className="w-full"
              >
                {t('generic:cancel')}
              </Button>
            </FormField>

            <FormField columnSpan={3} className="w-full">
              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="w-full"
              >
                {t('generic:save')}
              </Button>
            </FormField>
          </Form.Layout>
        </Stack>
      </Form>
    </Surface>
  )
}
