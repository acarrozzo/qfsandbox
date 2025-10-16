'use client'

import { Controller, useForm, zodResolver } from '@mntn-dev/forms'
import { NarrowTFunction, useTranslation } from '@mntn-dev/i18n'
import {
  type CreateOrganizationInput,
  CreateOrganizationInputSchema,
} from '@mntn-dev/organization-service/client'
import {
  Form,
  FormField,
  FormModal,
  Input,
  type ModalProps,
} from '@mntn-dev/ui-components'
import { usePreviousDistinct } from '@mntn-dev/ui-utilities'

import { OrganizationTypeSelect } from '~/components/organization/organization-type-select.tsx'
import { UniqueOrganizationNameSchemaBuilder } from '~/schemas/public.schema.ts'

type OrganizationCreateModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    onCreate: (input: CreateOrganizationInput) => Promise<void>
    isCreating: boolean
  }>

const OrganizationCreateModal = ({
  onCreate,
  isCreating,
  ...props
}: OrganizationCreateModalProps) => {
  const { t } = useTranslation(['organization-create', 'validation'])
  const { t: tValidation } = useTranslation('validation')

  const { onClose } = props
  const wasCreating = usePreviousDistinct(isCreating)

  const {
    formState: { errors, isValidating },
    register,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      name: '',
      websiteUrl: '',
      organizationType: undefined,
    },
    reValidateMode: 'onSubmit', // The default onChange is a bad experience because the latency involved with server-side validation.
    resolver: zodResolver(
      CreateOrganizationInputSchema.extend({
        name: UniqueOrganizationNameSchemaBuilder({
          t: NarrowTFunction<['validation']>(t),
          field: t('organization-create:field.name.label'),
        }),
      }),
      tValidation,
      {},
      { mode: 'async' }
    ),
  })

  const isBusy = isCreating || wasCreating || isValidating

  return (
    <FormModal {...props}>
      <FormModal.Form
        id="organization-create"
        onSubmit={handleSubmit(onCreate)}
      >
        <FormModal.Header title={t('organization-create:title')} />
        <FormModal.Body>
          <Form.Layout>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.name}
            >
              <FormField.Label>
                {t('organization-create:field.name.label')}
              </FormField.Label>
              <FormField.Control>
                <Input
                  {...register('name')}
                  disabled={isBusy}
                  autoFocus
                  placeholder={t('organization-create:field.name.placeholder')}
                />
              </FormField.Control>
              <FormField.Error>{errors.name?.message}</FormField.Error>
            </FormField>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.websiteUrl}
            >
              <FormField.Label>
                {t('organization-create:field.websiteUrl.label')}
              </FormField.Label>
              <FormField.Control>
                <Input
                  {...register('websiteUrl')}
                  disabled={isBusy}
                  autoFocus
                  placeholder={t(
                    'organization-create:field.websiteUrl.placeholder'
                  )}
                />
              </FormField.Control>
              <FormField.Error>{errors.websiteUrl?.message}</FormField.Error>
            </FormField>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.organizationType}
            >
              <FormField.Label>
                {t('organization-create:field.organizationType.label')}
              </FormField.Label>
              <FormField.Control>
                <Controller
                  name="organizationType"
                  control={control}
                  render={({ field }) => (
                    <OrganizationTypeSelect
                      {...field}
                      disabled={isBusy}
                      placeholder={t(
                        'organization-create:field.organizationType.placeholder'
                      )}
                    />
                  )}
                />
                <FormField.Error>
                  {errors.organizationType?.message}
                </FormField.Error>
              </FormField.Control>
            </FormField>
          </Form.Layout>
        </FormModal.Body>
        <FormModal.Footer orientation="horizontal">
          <FormModal.CancelButton onClick={onClose} disabled={isBusy}>
            {t('organization-create:action.cancel')}
          </FormModal.CancelButton>
          <FormModal.AcceptButton
            type="submit"
            disabled={isBusy}
            loading={isBusy}
          >
            {t('organization-create:action.create')}
          </FormModal.AcceptButton>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}

export { OrganizationCreateModal, type OrganizationCreateModalProps }
