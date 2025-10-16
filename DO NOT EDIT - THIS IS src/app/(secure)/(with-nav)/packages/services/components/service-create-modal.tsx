'use client'

import { useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Form,
  FormField,
  FormModal,
  Input,
  type ModalProps,
  TextEditor,
  useEditorController,
} from '@mntn-dev/ui-components'
import { usePrevious } from '@mntn-dev/ui-utilities'

import type { PartialCreateServiceInput } from './types.ts'

type ServiceCreateModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    onCreate: (value: PartialCreateServiceInput) => void
    isCreating: boolean
  }>

const ServiceCreateModal = ({
  onCreate,
  isCreating,
  ...props
}: ServiceCreateModalProps) => {
  const { t } = useTranslation(['service-create', 'validation'])

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ defaultValues: { name: '', description: '' } })

  const { field } = useEditorController({
    control,
    name: 'description',
    rules: {
      required: t('validation:field.required', {
        field: t('service-create:field.description'),
      }),
    },
  })

  const { onClose } = props
  const wasCreating = usePrevious(isCreating)
  const disabled = isCreating || wasCreating

  return (
    <FormModal {...props}>
      <FormModal.Form
        onSubmit={handleSubmit(onCreate)}
        id="service-create"
        className="h-full"
      >
        <FormModal.Header title={t('service-create:title')} />
        <FormModal.Body>
          <Form.Layout>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.name}
            >
              <FormField.Label>
                {t('service-create:field.name')}
              </FormField.Label>
              <FormField.Control>
                <Input
                  {...register('name', {
                    required: t('validation:field.required', {
                      field: t('service-create:field.name'),
                    }),
                  })}
                  disabled={disabled}
                  autoFocus
                />
              </FormField.Control>
              <FormField.Error>{errors.name?.message}</FormField.Error>
            </FormField>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.description}
            >
              <FormField.Label>
                {t('service-create:field.description')}
              </FormField.Label>
              <FormField.Control>
                <TextEditor
                  ref={field.ref}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  defaultValue={field.value}
                  className="h-40"
                  disabled={disabled}
                />
              </FormField.Control>
              <FormField.Error>{errors.description?.message}</FormField.Error>
            </FormField>
          </Form.Layout>
        </FormModal.Body>
        <FormModal.Footer orientation="horizontal">
          <FormModal.CancelButton onClick={onClose} disabled={disabled}>
            {t('service-create:action.cancel')}
          </FormModal.CancelButton>
          <FormModal.AcceptButton
            type="submit"
            loading={disabled}
            disabled={disabled}
          >
            {t('service-create:action.create')}
          </FormModal.AcceptButton>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}

export { ServiceCreateModal, type ServiceCreateModalProps }
