import { useEffect } from 'react'
import type { SetOptional } from 'type-fest'

import type { PackageServiceDomainQueryModel } from '@mntn-dev/domain-types'
import type { CostLike, PriceContext } from '@mntn-dev/finance'
import { FormProvider, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { UpdatePackageServiceInput } from '@mntn-dev/package-service/client'
import {
  Button,
  Form,
  Heading,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'

import { TagList } from '~/components/tag-list/tag-list.tsx'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'

import { DeliverablesEditor } from '../../../components/deliverables-editor.tsx'
import { ServiceCoreFields } from './form-fields/service-core-fields.tsx'
import { ServiceDescriptionField } from './form-fields/service-description-field.tsx'
import { ServiceMaxField } from './form-fields/service-max-field.tsx'
import { ServiceNameField } from './form-fields/service-name-field.tsx'
import { ServicePreProductionReviewField } from './form-fields/service-pre-production-review-field.tsx'
import { PackageServiceEmptyState } from './package-service-empty-state.tsx'

type PackageServiceDetailsProps = {
  isBusy: boolean
  isUpdating: boolean
  isReadonly: boolean
  isPublished: boolean
  packageService: PackageServiceDomainQueryModel
  onPackageServiceUpdate: (value: UpdatePackageServiceInput) => void
}

const defaultValues = ({
  packageService,
  getPriceValue,
}: {
  packageService: PackageServiceDomainQueryModel
  getPriceValue: (context: PriceContext, cost: CostLike) => number
}) => ({
  ...packageService,
  max: packageService.max ?? 1,
  // undefined valued fields carry forward what ever value was in the field from another service. Must explicitly set null here to clear out the fields.
  cost: getPriceValue('agency', packageService) ?? null,
})

const formId = 'package-service-details'

const PackageServiceDetails = ({
  isBusy,
  isUpdating,
  isReadonly,
  packageService,
  onPackageServiceUpdate,
}: PackageServiceDetailsProps) => {
  const { packageServiceId } = packageService
  const { t } = useTranslation([
    'package-service-details',
    'service-details',
    'toast',
    'tags',
    'validation',
  ])
  const { getPriceValue } = usePricingUtilities()

  const hasServiceTags =
    (packageService.tags && packageService.tags.length > 0) ?? false

  const methods = useForm({
    defaultValues: defaultValues({ packageService, getPriceValue }),
  })

  const {
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
  } = methods

  useEffect(() => {
    reset(defaultValues({ packageService, getPriceValue }))
  }, [reset, packageService, getPriceValue])

  const { deliverables } = getValues()

  const isDisabled = isBusy || isReadonly

  return (
    <FormProvider {...methods}>
      <Surface divide={false} padding="8" className="flex-1 h-full">
        <Surface.Header className="flex-none">
          <ServiceNameField disabled={isDisabled} />
        </Surface.Header>
        <Surface.Body className="flex-1 overflow-y-hidden flex px-0 flex-col py-0">
          <div className="flex-1 px-8 overflow-y-auto scroll-thin">
            <form
              onSubmit={handleSubmit(onPackageServiceUpdate)}
              id={formId}
              className="flex-1 flex flex-col gap-4 overflow-hidden"
            />
            <Form.Layout>
              <ServiceCoreFields disabled={false} service={packageService} />
              <ServiceDescriptionField disabled={false} />
              <ServiceMaxField disabled={false} />
              <ServicePreProductionReviewField
                service={packageService}
                disabled={
                  true /* Always readonly. Preproduction review shouldn't change from the service definition. */
                }
              />
            </Form.Layout>
            {hasServiceTags && (
              <Stack gap="8" direction="col" className="my-8">
                <Heading fontSize="xl" fontWeight="bold" textColor="primary">
                  {t('service-details:tags.title')}
                </Heading>
                <Text fontSize="sm" textColor="secondary">
                  {t('service-details:tags.subtitle')}
                </Text>
                <TagList tags={packageService.tags} categories={['skill']} />
              </Stack>
            )}
            <Stack gap="8" direction="col" className="my-8">
              <DeliverablesEditor
                key={packageServiceId}
                deliverables={deliverables}
                isDisabled={isDisabled}
                isReadonly={
                  true /* Deliverables are always readonly in packages until we decide otherwise. */
                }
              />
            </Stack>
          </div>
        </Surface.Body>
        <Surface.Footer className="flex-none">
          <Button
            type="submit"
            loading={isUpdating}
            disabled={isDisabled || !isDirty}
            className="w-full"
            form={formId}
          >
            {t('package-service-details:action.save')}
          </Button>
        </Surface.Footer>
      </Surface>
    </FormProvider>
  )
}

const PackageServiceDetailsMain = ({
  packageService,
  ...props
}: SetOptional<PackageServiceDetailsProps, 'packageService'>) =>
  packageService ? (
    <PackageServiceDetails {...props} packageService={packageService} />
  ) : (
    <PackageServiceEmptyState />
  )

export default PackageServiceDetailsMain
