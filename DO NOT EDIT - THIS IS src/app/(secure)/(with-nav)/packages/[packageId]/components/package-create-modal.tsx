'use client'

import type { TFunction } from 'i18next'
import { useMemo } from 'react'

import { PackagePayoutMax, PackageSources } from '@mntn-dev/domain-types'
import { Controller, useForm } from '@mntn-dev/forms'
import { NarrowTFunction, useTranslation } from '@mntn-dev/i18n'
import {
  Form,
  FormField,
  FormModal,
  Input,
  type ModalProps,
  Select,
  TextEditor,
  useEditorController,
} from '@mntn-dev/ui-components'
import { usePreviousDistinct } from '@mntn-dev/ui-utilities'

import { useDollarsField } from '~/utils/form/use-dollars-field.ts'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'

import type { PartialCreatePackageInput } from './types.ts'

type PackageCreateModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    onCreate: (value: PartialCreatePackageInput) => void
    isCreating: boolean
  }>

const getPackageSourceOptions = (t: TFunction<['package-types']>) =>
  PackageSources.map((packageSource) => ({
    label: t(`package-types:packageSource.${packageSource}`),
    value: packageSource,
  }))

const PackageCreateModal = ({
  onCreate,
  isCreating,
  ...props
}: PackageCreateModalProps) => {
  const { t } = useTranslation([
    'package-create',
    'validation',
    'package-types',
  ])

  const { getPriceLabel } = usePricingUtilities()

  const dollarsField = useDollarsField({
    max: PackagePayoutMax,
    field: getPriceLabel('agency', 'price'),
  })

  const {
    formState: { errors },
    register,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      packageSource: undefined,
      cost: undefined,
    },
  })

  const { field } = useEditorController({
    control,
    name: 'description',
    rules: {
      required: t('validation:field.required', {
        field: t('package-create:field.description'),
      }),
    },
  })

  const { onClose } = props
  const wasCreating = usePreviousDistinct(isCreating)
  const isBusy = isCreating || wasCreating

  const packageSourceOptions = useMemo(
    () => getPackageSourceOptions(NarrowTFunction<['package-types']>(t)),
    [t]
  )

  return (
    <FormModal {...props}>
      <FormModal.Form id="package-create" onSubmit={handleSubmit(onCreate)}>
        <FormModal.Header title={t('package-create:title')} />
        <FormModal.Body>
          <Form.Layout>
            <FormField
              columnSpan={6}
              hasError={!!errors.name}
              className="w-full"
            >
              <FormField.Label>
                {t('package-create:field.name')}
              </FormField.Label>
              <FormField.Control>
                <Input
                  {...register('name', {
                    required: t('validation:field.required', {
                      field: t('package-create:field.name'),
                    }),
                  })}
                  disabled={isBusy}
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
                {t('package-create:field.description')}
              </FormField.Label>
              <FormField.Control>
                <TextEditor
                  ref={field.ref}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  defaultValue={field.value}
                  className="h-40"
                  disabled={isBusy}
                />
              </FormField.Control>
              <FormField.Error>{errors.description?.message}</FormField.Error>
            </FormField>
            <FormField
              columnSpan={3}
              hasError={!!errors.packageSource}
              className="w-full"
            >
              <FormField.Label>
                {t('package-create:field.packageSource')}
              </FormField.Label>
              <FormField.Control>
                <Controller
                  name="packageSource"
                  control={control}
                  rules={{
                    required: t('validation:field.required', {
                      field: t('package-create:field.packageSource'),
                    }),
                  }}
                  render={({ field }) => (
                    <Select
                      deselectable={false}
                      searchable={false}
                      disabled={isBusy}
                      options={packageSourceOptions}
                      {...field}
                    />
                  )}
                />
              </FormField.Control>
              <FormField.Error>{errors.packageSource?.message}</FormField.Error>
            </FormField>
            <FormField
              columnSpan={3}
              hasError={!!errors.cost}
              className="w-full"
            >
              <FormField.Label>
                {getPriceLabel('agency', 'price')}
              </FormField.Label>
              <FormField.Control>
                <Input
                  type="number"
                  {...register('cost', {
                    validate: dollarsField.validate,
                    valueAsNumber: true,
                  })}
                  disabled={isBusy}
                />
              </FormField.Control>
              <FormField.Error>{errors.cost?.message}</FormField.Error>
            </FormField>
          </Form.Layout>
        </FormModal.Body>
        <FormModal.Footer orientation="horizontal">
          <FormModal.CancelButton onClick={onClose} disabled={isBusy}>
            {t('package-create:action.cancel')}
          </FormModal.CancelButton>
          <FormModal.AcceptButton
            type="submit"
            disabled={isBusy}
            loading={isBusy}
          >
            {t('package-create:action.create')}
          </FormModal.AcceptButton>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}

export { PackageCreateModal, type PackageCreateModalProps }
