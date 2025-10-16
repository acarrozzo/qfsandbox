'use client'

import type { TFunction } from 'i18next'
import { useMemo, useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { TagFormField } from '@mntn-dev/app-ui-components'
import type {
  PackageId,
  PackageServiceDomainQueryModel,
  PackageServiceId,
} from '@mntn-dev/domain-types'
import {
  filterTagsByCategory,
  PackagePayoutMax,
  PackageSources,
  TagId,
  toTagsByCategoryMap,
} from '@mntn-dev/domain-types'
import {
  Controller,
  FormProvider,
  useController,
  useForm,
  zodResolver,
} from '@mntn-dev/forms'
import { NarrowTFunction, useTranslation } from '@mntn-dev/i18n'
import {
  type AddPackageServiceInput,
  type UpdatePackageInput,
  UpdatePackageInputSchema,
  type UpdatePackageServiceInput,
} from '@mntn-dev/package-service/client'
import {
  BladeList,
  Button,
  CurrencyContainer,
  Form,
  FormField,
  Heading,
  Input,
  LoadingOverlay,
  PageHeader,
  Select,
  SidebarLayoutContent,
  Stack,
  StickyDiv,
  Surface,
  Text,
  TextEditor,
  Toggle,
  transformOnChange,
  useEditorController,
  useOpenState,
  useToast,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { InlineInput } from '~/components/form/index.ts'
import { TwoColumn } from '~/components/layout/two-column/two-column.tsx'
import { useTags } from '~/components/tag/use-tags.ts'
import { getPackageFileQueryInputs } from '~/lib/packages/package-query-helpers.ts'
import { useDollarsField } from '~/utils/form/use-dollars-field.ts'
import { usePricingUtilities } from '~/utils/pricing/use-pricing-utilities.ts'
import { useCurrency } from '~/utils/use-currency.ts'

import { useRefreshPackage } from '../../hooks/use-refresh-package.ts'
import {
  hasPackageVideo,
  hasPackageVideoTitles,
  isPackageReadonly,
} from '../helpers/index.ts'
import { PackageFiles } from './package-assets/package-files.tsx'
import { PackageDeleteConfirmationModal } from './package-delete-confirmation-modal.tsx'
import { PackageServiceBlade } from './package-service/package-service-blade.tsx'
import PackageServiceDetails from './package-service/package-service-details.tsx'
import { PackageServiceModal } from './package-service/package-service-modal.tsx'

type PackageDetailsProps = {
  packageId: PackageId
}

const getPackageSourceOptions = (t: TFunction<['package-types']>) =>
  PackageSources.map((packageSource) => ({
    label: t(`package-types:packageSource.${packageSource}`),
    value: packageSource,
  }))

export const PackageDetails = ({ packageId }: PackageDetailsProps) => {
  const { t } = useTranslation([
    'package-details',
    'generic',
    'validation',
    'package-types',
    'toast',
    'tags',
  ])
  const { t: tValidation } = useTranslation('validation')

  const router = useRouter()
  const { currency } = useCurrency()
  const { showToast } = useToast()
  const { getPriceLabel, getPriceValue } = usePricingUtilities()

  const { allTags } = useTags()

  const [selectedPackageServiceId, setSelectedPackageServiceId] = useState<
    PackageServiceId | undefined
  >(undefined)

  const [
    pkg,
    { refetch: refetchPackageDetails, isRefetching: isRefetchingPackages },
  ] = trpcReactClient.packages.getPackageDetails.useSuspenseQuery({
    packageId,
  })

  const [files, filesQuery] = trpcReactClient.files.list.useSuspenseQuery(
    getPackageFileQueryInputs(packageId)
  )

  const isRefetching = isRefetchingPackages || filesQuery.isRefetching

  const { mutateAsync: updatePackage, isPending: isUpdating } =
    trpcReactClient.packages.updatePackage.useMutation()

  const { mutateAsync: deletePackage, isPending: isDeleting } =
    trpcReactClient.packages.archivePackage.useMutation()

  const refreshPackage = useRefreshPackage()

  const { mutateAsync: addPackageService, isPending: isAdding } =
    trpcReactClient.packages.addPackageService.useMutation()

  const { mutateAsync: removePackageService, isPending: isRemoving } =
    trpcReactClient.packages.removePackageService.useMutation()

  const {
    mutateAsync: updatePackageService,
    isPending: isPackageServiceUpdating,
  } = trpcReactClient.packages.updatePackageService.useMutation()

  const { mutateAsync: publishPackage, isPending: isPublishing } =
    trpcReactClient.packages.publishPackage.useMutation()

  const dollarsField = useDollarsField({
    max: PackagePayoutMax,
    field: getPriceLabel('agency', 'price'),
  })

  const methods = useForm({
    defaultValues: {
      ...pkg,
      tags: { skill: [], ...toTagsByCategoryMap(pkg.tags) },
    },
    resolver: zodResolver(UpdatePackageInputSchema, tValidation),
  })

  const {
    formState: { errors, isDirty },
    register,
    handleSubmit,
    control,
  } = methods

  const { field: visibilityField } = useController({
    control,
    name: 'visibility',
  })

  const { field: descriptionField } = useEditorController({
    control,
    name: 'description',
    rules: {
      required: t('validation:field.required', {
        field: t('package-details:field.description'),
      }),
    },
  })

  const handleGoBack = () => {
    router.push(route('/packages'))
  }

  const onUpdate = async (value: UpdatePackageInput) => {
    const updatedPackage = await updatePackage(value)

    refreshPackage(value)

    showToast.success({
      title: t('toast:package.saved.title'),
      body: t('toast:package.saved.body', { name: updatedPackage.name }),
      dataTestId: 'package-saved-success-toast',
      dataTrackingId: 'package-saved-success-toast',
    })
  }

  const isSaving = isUpdating
  const isBusy =
    isSaving || isPublishing || isRemoving || isAdding || isDeleting
  const isReadonly = isPackageReadonly(pkg)
  const isDisabled = isBusy || isReadonly
  const isPublished = pkg.status === 'published'

  const packageSourceOptions = useMemo(
    () => getPackageSourceOptions(NarrowTFunction<['package-types']>(t)),
    [t]
  )

  const { services: packageServices } = pkg

  const packagePrice = getPriceValue('agency', pkg)

  const selectedPackageService = useMemo(
    () =>
      packageServices
        ? packageServices.find(
            (packageService) =>
              packageService.packageServiceId === selectedPackageServiceId
          )
        : undefined,
    [packageServices, selectedPackageServiceId]
  )

  const handleServiceBladeClick =
    ({ packageServiceId }: PackageServiceDomainQueryModel) =>
    () => {
      setSelectedPackageServiceId(packageServiceId)
    }

  const {
    onClose: onPackageServiceModalClose,
    onToggle: onPackageServiceModalToggle,
    open: packageServiceModalOpen,
  } = useOpenState()

  const handlePackageServiceAdd = async (
    packageService: AddPackageServiceInput
  ) => {
    const { packageServiceId } = await addPackageService(packageService)
    await refreshPackage({ packageId })

    setSelectedPackageServiceId(packageServiceId)

    showToast.success({
      title: t('toast:package.service-added.title'),
      body: t('toast:package.service-added.body'),
      dataTestId: 'service-added-success-toast',
      dataTrackingId: 'service-added-success-toast',
    })

    onPackageServiceModalClose()
  }

  const handlePackageServiceDelete =
    ({ packageServiceId }: { packageServiceId: PackageServiceId }) =>
    async () => {
      await removePackageService({ packageServiceId })
      await refreshPackage({ packageId })

      if (selectedPackageServiceId === packageServiceId) {
        setSelectedPackageServiceId(undefined)
      }

      showToast.success({
        title: t('toast:package.service-removed.title'),
        body: t('toast:package.service-removed.body'),
        dataTestId: 'service-removed-success-toast',
        dataTrackingId: 'service-removed-success-toast',
      })
    }

  const handlePackageServiceUpdate = async (
    value: UpdatePackageServiceInput
  ) => {
    await updatePackageService(value)
    await refetchPackageDetails()

    showToast.success({
      title: t('toast:package-service.updated.title'),
      body: t('toast:package-service.updated.body'),
      dataTestId: 'package-service-updated-success-toast',
      dataTrackingId: 'package-service-updated-success-toast',
    })
  }

  const handlePublishClick = async () => {
    if (!hasPackageVideo(files)) {
      showToast.error({
        title: t('toast:package.video-required.title'),
        body: t('toast:package.video-required.body'),
        dataTestId: 'video-required-error-toast',
        dataTrackingId: 'video-required-error-toast',
      })
      return
    }

    if (!hasPackageVideoTitles(files)) {
      showToast.error({
        title: t('toast:package.video-title-required.title'),
        body: t('toast:package.video-title-required.body'),
        dataTestId: 'video-title-required-error-toast',
        dataTrackingId: 'video-title-required-error-toast',
      })
      return
    }

    await publishPackage({ packageId })
    await refreshPackage({ packageId })

    showToast.success({
      title: t('toast:package.published.title'),
      body: t('toast:package.published.body', { name: pkg.name }),
      dataTestId: 'package-published-success-toast',
      dataTrackingId: 'package-published-success-toast',
    })

    handleGoBack()
  }

  const deleteConfirmationOpenState = useOpenState()

  const handleDeleteConfirm = async () => {
    await deletePackage({ packageId })
    await refreshPackage({})

    showToast.success({
      title: t('toast:package.deleted.title'),
      body: t('toast:package.deleted.body', { name: pkg.name }),
      dataTestId: 'package-deleted-success-toast',
      dataTrackingId: 'package-deleted-success-toast',
    })

    handleGoBack()
  }

  const handleVisibilityChange = (value: boolean) => {
    visibilityField.onChange(value ? 'internal' : 'external')
  }

  return (
    <>
      <SidebarLayoutContent>
        <PageHeader
          dataTestId="package-details-page-header"
          dataTrackingId="package-details-page-header"
        >
          <PageHeader.Main>
            <PageHeader.Overline>
              <PageHeader.OverlineLink onClick={handleGoBack}>
                {t('back', { ns: 'generic' })}
              </PageHeader.OverlineLink>
            </PageHeader.Overline>

            <FormProvider {...methods}>
              <Form
                onSubmit={handleSubmit(onUpdate)}
                id="package-details"
                className="h-full w-full"
              >
                <div>
                  <FormField
                    columnSpan={6}
                    hasError={!!errors.name}
                    className="w-full"
                  >
                    <FormField.Control>
                      <InlineInput
                        heading={{ fontSize: '4xl' }}
                        {...register('name', {
                          required: t('validation:field.required', {
                            field: t('package-details:field.name'),
                          }),
                        })}
                        disabled={isDisabled}
                      />
                    </FormField.Control>
                    <FormField.Error>{errors.name?.message}</FormField.Error>
                  </FormField>
                </div>
                <div className="grow" />
              </Form>
            </FormProvider>
          </PageHeader.Main>
          <PageHeader.Controls>
            {packagePrice !== undefined && (
              <CurrencyContainer
                currency={currency(packagePrice)}
                label={{ text: t('starting-at', { ns: 'generic' }) }}
              />
            )}
            {!isReadonly && (
              <>
                <Button
                  onClick={deleteConfirmationOpenState.onToggle}
                  loading={isDeleting}
                  variant="secondary"
                >
                  {t('package-details:action.delete')}
                </Button>
                <Button
                  onClick={handlePublishClick}
                  loading={isPublishing}
                  disabled={isDisabled || isPublished}
                  variant="secondary"
                >
                  {t('package-details:action.publish')}
                </Button>
                <Button
                  type="submit"
                  loading={isSaving}
                  disabled={isDisabled || !isDirty}
                  form="package-details"
                >
                  {t('package-details:action.save')}
                </Button>
              </>
            )}
          </PageHeader.Controls>
        </PageHeader>
        <TwoColumn>
          <TwoColumn.Main>
            {isRefetching && <LoadingOverlay />}
            <Stack gap="8" direction="col">
              <Surface padding="6">
                <Toggle
                  checked={visibilityField.value === 'internal'}
                  disabled={isDisabled}
                  onChange={handleVisibilityChange}
                >
                  <Text fontSize="base">
                    {t('package-details:for-internal-use-only')}
                  </Text>
                </Toggle>
              </Surface>

              <Surface padding="6">
                <Form.Layout>
                  <FormField
                    columnSpan={6}
                    hasError={!!errors.description}
                    className="w-full"
                  >
                    <FormField.Label>
                      {t('package-details:field.description')}
                    </FormField.Label>
                    <FormField.Control>
                      <TextEditor
                        ref={descriptionField.ref}
                        onChange={descriptionField.onChange}
                        onBlur={descriptionField.onBlur}
                        defaultValue={descriptionField.value}
                        className="h-40"
                        disabled={isDisabled}
                      />
                    </FormField.Control>
                    <FormField.Error>
                      {errors.description?.message}
                    </FormField.Error>
                  </FormField>
                  <FormField
                    columnSpan={2}
                    hasError={!!errors.packageSource}
                    className="w-full"
                  >
                    <FormField.Label>
                      {t('package-details:field.packageSource')}
                    </FormField.Label>
                    <FormField.Control>
                      <Controller
                        name="packageSource"
                        control={control}
                        rules={{
                          required: t('validation:field.required', {
                            field: t('package-details:field.packageSource'),
                          }),
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            deselectable={false}
                            searchable={false}
                            disabled={isDisabled}
                            options={packageSourceOptions}
                          />
                        )}
                      />
                      <FormField.Error>
                        {errors.packageSource?.message}
                      </FormField.Error>
                    </FormField.Control>
                  </FormField>
                  <FormField
                    columnSpan={2}
                    hasError={!!errors.cost}
                    className="w-full"
                  >
                    <FormField.Label>
                      {getPriceLabel('agency', 'price')}
                    </FormField.Label>
                    <FormField.Control>
                      <Input
                        form="package-details"
                        type="number"
                        {...register('cost', {
                          validate: dollarsField.validate,
                          valueAsNumber: true,
                        })}
                        disabled={isDisabled}
                      />
                      <FormField.Error>{errors.cost?.message}</FormField.Error>
                    </FormField.Control>
                  </FormField>
                  <FormField
                    columnSpan={2}
                    hasError={!!errors.costMarginPercent}
                    className="w-full"
                  >
                    <FormField.Adornment>
                      <FormField.Label>
                        {t('package-details:field.costMarginPercent.label')}
                      </FormField.Label>
                      <FormField.InfoTooltip
                        content={t(
                          'package-details:field.costMarginPercent.tooltip'
                        )}
                      />
                    </FormField.Adornment>
                    <FormField.Control>
                      <Input
                        form="package-details"
                        type="number"
                        {...register('costMarginPercent', {
                          valueAsNumber: true,
                        })}
                        placeholder={t(
                          'package-details:field.costMarginPercent.placeholder'
                        )}
                        disabled={isDisabled}
                      />
                      <FormField.Error>
                        {errors.costMarginPercent?.message}
                      </FormField.Error>
                    </FormField.Control>
                  </FormField>
                </Form.Layout>
              </Surface>

              <Surface padding="6">
                <Surface.Header className="p-8">
                  <Heading fontSize="xl" fontWeight="bold" textColor="primary">
                    {t('package-details:tags.title')}
                  </Heading>
                  <Text fontSize="sm" textColor="secondary">
                    {t('package-details:tags.subtitle')}
                  </Text>
                </Surface.Header>
                <Surface.Body>
                  <Controller
                    name="tags.skill"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <TagFormField
                        disabled={isDisabled}
                        columnSpan={6}
                        {...field}
                        onChange={transformOnChange(onChange, (item) => ({
                          ...item,
                          tagId: TagId(item.id),
                        }))}
                        category="skill"
                        allTags={allTags}
                        initialSelectedItems={filterTagsByCategory(
                          pkg.tags,
                          'skill'
                        ).map((tag) => ({ id: tag.tagId, name: tag.value }))}
                      />
                    )}
                  />
                </Surface.Body>
              </Surface>

              <Surface padding="6" gap="6">
                <PackageFiles
                  packageId={packageId}
                  files={files}
                  isError={filesQuery.isError}
                  onChange={filesQuery.refetch}
                />
              </Surface>

              <Surface>
                <BladeList divide>
                  <Surface.Header className="p-8">
                    <Heading
                      fontSize="4xl"
                      fontWeight="bold"
                      textColor="primary"
                    >
                      {t('package-details:services.title')}
                    </Heading>
                    <Text fontSize="base" textColor="secondary">
                      {t('package-details:services.subtitle')}
                    </Text>
                  </Surface.Header>

                  {packageServices
                    ?.toSorted((a, b) => {
                      // Define the order for service types
                      const serviceTypeOrder = [
                        'included',
                        'standard',
                        'custom',
                      ]

                      const orderByServiceType =
                        serviceTypeOrder.indexOf(a.serviceType) -
                        serviceTypeOrder.indexOf(b.serviceType)

                      return orderByServiceType || a.name.localeCompare(b.name)
                    })
                    .map((packageService) => (
                      <PackageServiceBlade
                        key={packageService.packageServiceId}
                        packageService={packageService}
                        onClick={handleServiceBladeClick(packageService)}
                        scroll={
                          packageService.packageServiceId ===
                          selectedPackageServiceId
                        }
                        onDelete={handlePackageServiceDelete({
                          packageServiceId: packageService.packageServiceId,
                        })}
                        isDisabled={isDisabled}
                      />
                    )) ?? null}
                </BladeList>
                {packageServices && packageServices.length === 0 && (
                  <Stack className="w-full" padding="6">
                    <Text
                      className="h-full w-full content-center text-center"
                      textColor="tertiary"
                    >
                      {t('empty.content')}
                    </Text>
                  </Stack>
                )}

                <Stack padding="4" gap="4" direction="col">
                  <Button
                    disabled={isDisabled}
                    width="full"
                    iconLeft="add"
                    variant="secondary"
                    onClick={onPackageServiceModalToggle}
                  >
                    {t('action.add-services')}
                  </Button>
                </Stack>
                {packageServiceModalOpen && (
                  <PackageServiceModal
                    open={true}
                    onClose={onPackageServiceModalClose}
                    onPackageServiceAdd={handlePackageServiceAdd}
                    packageId={packageId}
                    isAdding={isAdding}
                  />
                )}
              </Surface>
            </Stack>
          </TwoColumn.Main>
          <TwoColumn.Aside className="static">
            <StickyDiv marginY="8">
              <PackageServiceDetails
                key={selectedPackageServiceId}
                isBusy={isBusy || isPackageServiceUpdating}
                isUpdating={isPackageServiceUpdating}
                isReadonly={isPackageReadonly(pkg)}
                isPublished={pkg.status === 'published'}
                packageService={selectedPackageService}
                onPackageServiceUpdate={handlePackageServiceUpdate}
              />
            </StickyDiv>
          </TwoColumn.Aside>
        </TwoColumn>
      </SidebarLayoutContent>
      <PackageDeleteConfirmationModal
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        {...deleteConfirmationOpenState}
      />
    </>
  )
}
