import { useEffect } from 'react'
import type { SetOptional } from 'type-fest'

import type {
  PackageServiceDomainQueryModel,
  ProjectDomainSelectModel,
} from '@mntn-dev/domain-types'
import type { CostLike, PriceContext } from '@mntn-dev/finance'
import { FormProvider, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Form, Stack, Surface } from '@mntn-dev/ui-components'

import {
  ServiceCountField,
  ServiceDescriptionField,
  ServicePreProductionReviewField,
} from '~/app/(secure)/(with-nav)/packages/[packageId]/components/package-service/form-fields/index.ts'
import { ServiceNameField } from '~/app/(secure)/(with-nav)/packages/[packageId]/components/package-service/form-fields/service-name-field.tsx'
import type { ServiceFieldProps } from '~/app/(secure)/(with-nav)/packages/[packageId]/components/package-service/form-fields/types.ts'
import { PackageServiceEmptyState } from '~/app/(secure)/(with-nav)/packages/[packageId]/components/package-service/package-service-empty-state.tsx'
import { DeliverablesEditor } from '~/app/(secure)/(with-nav)/packages/components/deliverables-editor.tsx'
import { isSystemService } from '~/app/(secure)/(with-nav)/packages/services/helpers/index.ts'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'

import type { ChangeOrderPackageServiceFormModel } from '../types.ts'
import { ChangeOrderCostField } from './form-fields/change-order-cost-field.tsx'
import { ChangeOrderNoteField } from './form-fields/change-order-notes-field.tsx'

type ChangeOrderPackageServiceDetailsProps = {
  isBusy: boolean
  isUpdating: boolean
  isReadonly: boolean
  packageService: PackageServiceDomainQueryModel
  onPackageServiceUpdate: (value: ChangeOrderPackageServiceFormModel) => void
  onCancel: () => void
} & { project: Pick<ProjectDomainSelectModel, 'costMarginPercent' | 'status'> }

const defaultValues = ({
  packageService,
  getPriceValue,
}: {
  packageService: PackageServiceDomainQueryModel
  getPriceValue: (context: PriceContext, cost: CostLike) => number
}): ChangeOrderPackageServiceFormModel => ({
  ...packageService,
  cost: getPriceValue('agency', packageService),
  notes: '',
})

const formId = 'change-order-package-service-details'

const ChangeOrderPackageServiceDetails = ({
  isBusy,
  isUpdating,
  isReadonly,
  packageService,
  onPackageServiceUpdate,
  project: { costMarginPercent, status },
  onCancel,
}: ChangeOrderPackageServiceDetailsProps) => {
  const { packageServiceId } = packageService
  const { t } = useTranslation([
    'package-service-details',
    'service-details',
    'toast',
    'validation',
    'generic',
    'change-order',
  ])
  const { getPriceValue } = usePricingUtilities()

  const methods = useForm({
    defaultValues: defaultValues({ packageService, getPriceValue }),
  })

  const { handleSubmit, reset, getValues } = methods

  useEffect(() => {
    reset(defaultValues({ packageService, getPriceValue }))
  }, [reset, packageService, getPriceValue])

  const { deliverables } = getValues()

  const isDisabled = isBusy || isReadonly

  const serviceFieldProps: ServiceFieldProps = {
    disabled: isDisabled,
    service: packageService,
  }

  return (
    <FormProvider {...methods}>
      <Surface divide={false} padding="8" className="flex-1 h-full">
        <Surface.Header className="flex-none">
          <ServiceNameField
            {...serviceFieldProps}
            readonly={isSystemService(packageService)}
          />
        </Surface.Header>
        <Surface.Body className="flex-1 overflow-y-hidden flex px-0 flex-col py-0">
          <div className="flex-1 px-8 overflow-y-auto scroll-thin">
            <form onSubmit={handleSubmit(onPackageServiceUpdate)} id={formId} />
            <Form.Layout>
              <ServiceDescriptionField {...serviceFieldProps} />
              <ServicePreProductionReviewField
                {...serviceFieldProps}
                disabled={status !== 'pre_production' || isDisabled}
              />
              <ChangeOrderNoteField {...serviceFieldProps} />
              <ServiceCountField {...serviceFieldProps} />
              <ChangeOrderCostField
                {...serviceFieldProps}
                costMarginPercent={costMarginPercent}
              />
            </Form.Layout>
            <Stack gap="8" direction="col" className="my-8">
              {!isSystemService(packageService) && (
                <DeliverablesEditor
                  key={packageServiceId}
                  deliverables={deliverables}
                  isDisabled={isDisabled}
                  isReadonly={false}
                />
              )}
            </Stack>
          </div>
        </Surface.Body>
        <Surface.Footer className="flex-none">
          <Stack width="full" direction="row" gap="4">
            <Button
              width="full"
              variant="text"
              disabled={isDisabled}
              onClick={onCancel}
            >
              {t('generic:cancel')}
            </Button>
            <Button
              width="full"
              type="submit"
              loading={isUpdating}
              disabled={isDisabled}
              form={formId}
            >
              {t('change-order:service.actions.submit')}
            </Button>
          </Stack>
        </Surface.Footer>
      </Surface>
    </FormProvider>
  )
}

const ChangeOrderPackageServiceDetailsMain = ({
  packageService,
  ...props
}: SetOptional<ChangeOrderPackageServiceDetailsProps, 'packageService'>) =>
  packageService ? (
    <ChangeOrderPackageServiceDetails
      {...props}
      packageService={packageService}
    />
  ) : (
    <PackageServiceEmptyState />
  )

export default ChangeOrderPackageServiceDetailsMain
