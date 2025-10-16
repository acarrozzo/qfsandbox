import type { TFunction } from 'i18next'
import { useCallback, useEffect } from 'react'
import { z } from 'zod'

import type { OrganizationId } from '@mntn-dev/domain-types'
import { useForm, zodResolver } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Form,
  FormField,
  FormModal,
  Heading,
  Input,
  Stack,
} from '@mntn-dev/ui-components'
import { usePrevious } from '@mntn-dev/ui-utilities'
import type { ZodInfer } from '@mntn-dev/utility-types'

import {
  UniqueBillingProfileEmailSchemaBuilder,
  UniqueBillingProfileNameSchemaBuilder,
} from '~/schemas/billing-profile.schema.ts'

import { useCreateBillingProfile } from '../hooks/use-create-billing-profile.ts'

const createBillingProfileFormSchema = (tValidation: TFunction<'validation'>) =>
  z.object({
    emailAddress: z
      .string()
      .min(1, tValidation('billing-profile.emailAddress.required')),
    name: z.string().min(1, tValidation('billing-profile.name.required')),
    firstName: z
      .string()
      .min(1, tValidation('billing-profile.firstName.required')),
    lastName: z
      .string()
      .min(1, tValidation('billing-profile.lastName.required')),
  })

type BillingProfileCreateFormData = ZodInfer<
  ReturnType<typeof createBillingProfileFormSchema>
>

type BillingProfileCreateModalProps = {
  organizationId: OrganizationId
  open: boolean
  onClose: () => void
}

const defaultValues = {
  emailAddress: '',
  name: '',
  firstName: '',
  lastName: '',
}

export const BillingProfileCreateModal = ({
  organizationId,
  open,
  onClose,
}: BillingProfileCreateModalProps) => {
  const { t } = useTranslation(['billing', 'validation', 'billing-profile'])
  const { t: tValidation } = useTranslation('validation')

  const { handleCreate, isCreating } = useCreateBillingProfile({
    organizationId,
  })

  const {
    formState: { errors, isValidating, isSubmitted },
    handleSubmit,
    register,
    reset,
    trigger,
  } = useForm({
    reValidateMode: 'onSubmit',
    mode: 'onSubmit',
    defaultValues,
    resolver: zodResolver(
      createBillingProfileFormSchema(tValidation).extend({
        emailAddress: UniqueBillingProfileEmailSchemaBuilder({
          t: tValidation,
          field: t('billing:billing-profile.create.field.emailAddress'),
          organizationId,
        }),
        name: UniqueBillingProfileNameSchemaBuilder({
          t: tValidation,
          field: t('billing:billing-profile.create.field.name'),
          organizationId,
        }),
      }),
      tValidation,
      {},
      { mode: 'async' }
    ),
  })

  const wasCreating = usePrevious(isCreating)
  const isBusy = isCreating || wasCreating || isValidating

  // Create custom register functions that trigger validation on blur
  const registerWithValidation = useCallback(
    (name: keyof BillingProfileCreateFormData) => {
      const registerResult = register(name)
      return {
        ...registerResult,
        onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
          registerResult.onBlur(e)
          if (isSubmitted) {
            trigger(name)
          }
        },
      }
    },
    [register, trigger, isSubmitted]
  )

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      reset({ emailAddress: '', name: '', firstName: '', lastName: '' })
    }
  }, [open, reset])

  const handleFormSubmit = async (data: BillingProfileCreateFormData) => {
    await handleCreate(
      data.emailAddress,
      data.name,
      data.firstName,
      data.lastName
    )
  }

  return (
    <FormModal open={open} onClose={onClose}>
      <FormModal.Form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormModal.Header title={t('billing:billing-profile.create.title')} />
        <FormModal.Body>
          <Stack gap="6" direction="col">
            {/* Profile Information Section */}
            <Stack gap="4" direction="col">
              <Heading fontWeight="semibold" textColor="primary">
                {t('billing-profile:section.profileInformation')}
              </Heading>
              <Form.Layout>
                <FormField
                  columnSpan={6}
                  className="w-full"
                  hasError={!!errors.name}
                >
                  <FormField.Label>
                    {t('billing:billing-profile.create.field.name')}
                  </FormField.Label>
                  <FormField.Control>
                    <Input
                      {...registerWithValidation('name')}
                      disabled={isBusy}
                      placeholder={t(
                        'billing-profile:placeholder.billingProfileName'
                      )}
                    />
                  </FormField.Control>
                  <FormField.Error>{errors.name?.message}</FormField.Error>
                </FormField>
              </Form.Layout>
            </Stack>

            {/* Billing Contact Information Section */}
            <Stack gap="4" direction="col">
              <Heading fontWeight="semibold" textColor="primary">
                {t('billing-profile:section.billingContactInformation')}
              </Heading>
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
                    <Input
                      {...registerWithValidation('firstName')}
                      disabled={isBusy}
                      placeholder={t('billing-profile:placeholder.firstName')}
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
                    <Input
                      {...registerWithValidation('lastName')}
                      disabled={isBusy}
                      placeholder={t('billing-profile:placeholder.lastName')}
                    />
                  </FormField.Control>
                  <FormField.Error>{errors.lastName?.message}</FormField.Error>
                </FormField>
                <FormField
                  columnSpan={6}
                  className="w-full"
                  hasError={!!errors.emailAddress}
                >
                  <FormField.Label>
                    {t('billing:billing-profile.create.field.emailAddress')}
                  </FormField.Label>
                  <FormField.Control>
                    <Input
                      {...registerWithValidation('emailAddress')}
                      disabled={isBusy}
                      type="email"
                      placeholder={t(
                        'billing-profile:placeholder.emailAddress'
                      )}
                    />
                  </FormField.Control>
                  <FormField.Error>
                    {errors.emailAddress?.message}
                  </FormField.Error>
                </FormField>
              </Form.Layout>
            </Stack>
          </Stack>
        </FormModal.Body>
        <FormModal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isBusy}
          >
            {t('billing:cancel')}
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isBusy}
            loading={isBusy}
          >
            {t('billing:billing-profile.create.action.create')}
          </Button>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}
