'use client'

import { useEffect, useMemo, useState } from 'react'

import type {
  PackageId,
  ServiceDomainSelectModel,
} from '@mntn-dev/domain-types'
import { Controller, FormProvider, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { AddPackageServiceInput } from '@mntn-dev/package-service/client'
import {
  Form,
  FormField,
  FormModal,
  type ModalProps,
  Select,
  Skeleton,
} from '@mntn-dev/ui-components'
import { usePrevious } from '@mntn-dev/ui-utilities'
import { keyBy } from '@mntn-dev/utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { ServiceCoreFields } from './form-fields/service-core-fields.tsx'

type PackageServiceModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    packageId: PackageId
    isAdding: boolean
    onPackageServiceAdd: (packageService: AddPackageServiceInput) => void
  }>

const PackageServiceModal = ({
  packageId,
  isAdding,
  onPackageServiceAdd,
  ...props
}: PackageServiceModalProps) => {
  const { onClose } = props
  const { t } = useTranslation(['package-service-modal', 'validation'])

  const { data: services, isLoading } =
    trpcReactClient.packages.getAllServices.useQuery({ status: 'published' })

  const serviceMap = useMemo(
    () => keyBy(services, (service) => service.serviceId),
    [services]
  )

  const [service, setService] = useState<ServiceDomainSelectModel | undefined>()

  const methods = useForm({
    defaultValues: { packageId } as AddPackageServiceInput,
  })

  // When service changes, use reset to update the form
  useEffect(
    () => methods.reset({ packageId, ...service }),
    [methods, packageId, service]
  )

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = methods

  const wasAdding = usePrevious(isAdding) ?? false
  const disabled = isLoading || isAdding || wasAdding

  return (
    <FormModal {...props}>
      <FormProvider {...methods}>
        <FormModal.Form
          onSubmit={handleSubmit(onPackageServiceAdd)}
          id="package-service-modal"
          className="h-full"
        >
          <FormModal.Header title={t('title')} />
          <FormModal.Body>
            <Form.Layout>
              <FormField columnSpan={6} hasError={!!errors.serviceId}>
                <FormField.Label>{t('field.serviceId')}</FormField.Label>
                <FormField.Control>
                  {services ? (
                    <Controller
                      name="serviceId"
                      control={control}
                      rules={{
                        required: t('validation:field.required', {
                          field: t('field.serviceId'),
                        }),
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          deselectable={false}
                          value={field.value}
                          onChange={(value) => {
                            setService(serviceMap[value])
                          }}
                          options={services.map(({ serviceId, name }) => ({
                            value: serviceId,
                            label: name,
                          }))}
                        />
                      )}
                    />
                  ) : (
                    <Skeleton className="h-6" />
                  )}
                </FormField.Control>
              </FormField>
              <ServiceCoreFields disabled={disabled} service={service} />
            </Form.Layout>
          </FormModal.Body>
          <FormModal.Footer orientation="horizontal">
            <FormModal.CancelButton onClick={onClose} disabled={disabled}>
              {t('action.cancel')}
            </FormModal.CancelButton>
            <FormModal.AcceptButton
              type="submit"
              loading={isAdding}
              disabled={disabled}
            >
              {t('action.add')}
            </FormModal.AcceptButton>
          </FormModal.Footer>
        </FormModal.Form>
      </FormProvider>
    </FormModal>
  )
}

export { PackageServiceModal, type PackageServiceModalProps }
