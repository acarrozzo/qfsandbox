import React, { useMemo } from 'react'

import type {
  BillingAddressDomainInsertModel,
  FinanceEntityId,
} from '@mntn-dev/domain-types'
import { useForm } from '@mntn-dev/forms'
import { Trans, useTranslation } from '@mntn-dev/i18n'
import {
  AutoInput,
  Form,
  FormField,
  FormModal,
  type ModalProps,
  Text,
} from '@mntn-dev/ui-components'
import { usePreviousDistinct } from '@mntn-dev/ui-utilities'

type InvoiceAddressModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    financeEntityId: FinanceEntityId
    defaultValues?: Partial<BillingAddressDomainInsertModel>
    onSave: (input: BillingAddressDomainInsertModel) => void
    isSaving: boolean
  }>

export const InvoiceAddressModal = ({
  financeEntityId,
  defaultValues: defaultValuesProp,
  onSave,
  isSaving,
  ...props
}: Readonly<InvoiceAddressModalProps>) => {
  const { t } = useTranslation(['finance', 'validation', 'generic'])

  const defaultValues = useMemo(
    () => ({
      financeEntityId,
      ...defaultValuesProp,
    }),
    [defaultValuesProp, financeEntityId]
  )

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
  })

  // Add this effect to update form values when defaultValues changes
  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const { onClose, open } = props
  const wasSaving = usePreviousDistinct(isSaving)

  // Reset busy state when modal opens
  const isBusy = open ? isSaving : isSaving || wasSaving

  return (
    <FormModal {...props}>
      <FormModal.Form onSubmit={handleSubmit(onSave)}>
        <FormModal.Header
          icon={{ name: 'bank-card' }}
          title={t('finance:invoiceAddress.header')}
        />
        <FormModal.Body>
          <Form.Layout>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.name}
            >
              <FormField.Label>
                {t('finance:invoiceAddress.name')}
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('name', {
                    required: t('validation:field.required', {
                      field: 'Name',
                    }),
                  })}
                  disabled={isBusy}
                />
              </FormField.Control>
              <FormField.Error>{errors.name?.message}</FormField.Error>
            </FormField>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.address1}
            >
              <FormField.Label>
                {t('finance:invoiceAddress.addressLine1')}
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('address1', {
                    required: t('validation:field.required', {
                      field: 'Address Line 1',
                    }),
                  })}
                  disabled={isBusy}
                />
              </FormField.Control>
              <FormField.Error>{errors.address1?.message}</FormField.Error>
            </FormField>

            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.address2}
            >
              <FormField.Label>
                <Trans t={t} i18nKey="finance:invoiceAddress.addressLine2">
                  <Text textColor="tertiary" />
                </Trans>
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('address2', {
                    setValueAs: (value) => value || undefined,
                  })}
                  disabled={isBusy}
                />
              </FormField.Control>
              <FormField.Error>{errors.address2?.message}</FormField.Error>
            </FormField>

            <FormField
              columnSpan={3}
              className="w-full"
              hasError={!!errors.city}
            >
              <FormField.Label>
                {t('finance:invoiceAddress.city')}
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('city', {
                    required: t('validation:field.required', {
                      field: 'City',
                    }),
                  })}
                  disabled={isBusy}
                />
              </FormField.Control>
              <FormField.Error>{errors.city?.message}</FormField.Error>
            </FormField>

            <FormField
              columnSpan={1}
              className="w-full"
              hasError={!!errors.state}
            >
              <FormField.Label>
                {t('finance:invoiceAddress.state')}
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('state', {
                    required: t('validation:field.required', {
                      field: 'State',
                    }),
                  })}
                  disabled={isBusy}
                />
              </FormField.Control>
              <FormField.Error>{errors.state?.message}</FormField.Error>
            </FormField>

            <FormField
              columnSpan={2}
              className="w-full"
              hasError={!!errors.zip}
            >
              <FormField.Label>
                {t('finance:invoiceAddress.zip')}
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('zip', {
                    required: t('validation:field.required', {
                      field: 'ZIP Code',
                    }),
                  })}
                  disabled={isBusy}
                />
              </FormField.Control>
              <FormField.Error>{errors.zip?.message}</FormField.Error>
            </FormField>
          </Form.Layout>
        </FormModal.Body>
        <FormModal.Footer orientation="horizontal">
          <FormModal.CancelButton
            onClick={onClose}
            disabled={isBusy}
            className="w-1/2"
          >
            {t('generic:cancel')}
          </FormModal.CancelButton>
          <FormModal.AcceptButton
            type="submit"
            disabled={isBusy}
            loading={isBusy}
            className="w-1/2"
          >
            {t('generic:save')}
          </FormModal.AcceptButton>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}
