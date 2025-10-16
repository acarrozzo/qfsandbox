import { TagFormField } from 'node_modules/@mntn-dev/app-ui-components/src/components/tag/tag-form-field.tsx'
import { useMemo } from 'react'
import type { SetOptional } from 'type-fest'

import {
  filterTagsByCategory,
  TagId,
  toTagsByCategoryMap,
} from '@mntn-dev/domain-types'
import { Controller, FormProvider, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ServiceDomainQueryModelWithAcl,
  UpdateServiceInput,
} from '@mntn-dev/package-service/client'
import {
  Button,
  Checkbox,
  Form,
  FormField,
  Heading,
  Input,
  Stack,
  Surface,
  Text,
  TextEditor,
  transformOnChange,
  useEditorController,
  useToast,
} from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { InlineInput } from '~/components/form/index.ts'
import { useTags } from '~/components/tag/use-tags.ts'
import { isPositiveNumber, valueAs } from '~/utils/form/index.ts'

import { DeliverablesEditor } from '../../components/deliverables-editor.tsx'
import { isServiceReadonly } from '../helpers/service-helper.ts'
import { useRefreshService } from '../hooks/use-refresh-service.ts'

type ServiceDetailsProps = {
  service: ServiceDomainQueryModelWithAcl
  onServiceUpdated: () => void
}

type ServiceDetailsUpdateForm = UpdateServiceInput

const formId = 'service-details'

const ServiceDetails = ({ service, onServiceUpdated }: ServiceDetailsProps) => {
  const { t } = useTranslation([
    'service-details',
    'service-types',
    'validation',
    'toast',
  ])
  const { showToast } = useToast()
  const refreshService = useRefreshService()

  const { mutateAsync: updateService, isPending: isUpdating } =
    trpcReactClient.packages.updateService.useMutation()

  const { mutateAsync: publishService, isPending: isPublishing } =
    trpcReactClient.packages.publishService.useMutation()

  const { allTags } = useTags()

  const serviceUpdateModel: ServiceDetailsUpdateForm = useMemo(() => {
    return {
      ...service,
      tags: { skill: [], ...toTagsByCategoryMap(service.tags) },
    }
  }, [service])

  const methods = useForm({
    defaultValues: serviceUpdateModel,
    mode: 'onChange',
  })

  const {
    formState: { errors, isSubmitted },
    register,
    handleSubmit,
    getValues,
    control,
  } = methods

  const { field: descriptionField } = useEditorController({
    control,
    name: 'description',
    rules: {
      required: t('validation:field.required', {
        field: t('service-details:field.description'),
      }),
    },
  })

  const { deliverables, serviceId } = getValues()

  const onUpdate = async (value: UpdateServiceInput) => {
    const updatedService = await updateService(value)
    await refreshService()

    onServiceUpdated()

    showToast.success({
      title: t('toast:service.saved.title'),
      body: t('toast:service.saved.body', { name: updatedService.name }),
      dataTestId: 'service-saved-success-toast',
      dataTrackingId: 'service-saved-success-toast',
    })
  }

  const isSaving = isUpdating
  const isBusy = isSaving || isPublishing
  const isReadonly = isServiceReadonly(service)
  const isDisabled = isBusy || isReadonly
  const isPublished = service.status === 'published'

  const handlePublishClick = async () => {
    await publishService({ serviceId })
    await refreshService()

    onServiceUpdated()

    showToast.success({
      title: t('toast:service.published.title'),
      body: t('toast:service.published.body', { name: service.name }),
      dataTestId: 'service-published-success-toast',
      dataTrackingId: 'service-published-success-toast',
    })
  }

  return (
    <FormProvider {...methods}>
      <Surface divide={false} padding="8" className="flex-1 h-full">
        <Surface.Header className="flex-none">
          <FormField
            columnSpan={6}
            className="w-full"
            hasError={isSubmitted && !!errors.name}
          >
            <FormField.Control>
              <InlineInput
                {...register('name', {
                  required: t('validation:field.required', {
                    field: t('service-details:field.name'),
                  }),
                })}
                disabled={isDisabled}
              />
            </FormField.Control>
            {isSubmitted && (
              <FormField.Error>{errors.name?.message}</FormField.Error>
            )}
          </FormField>
        </Surface.Header>
        <Surface.Body className="flex-1 overflow-y-hidden flex px-0 flex-col py-0">
          <div className="flex-1 px-8 overflow-y-auto scroll-thin">
            <form onSubmit={handleSubmit(onUpdate)} id="service-details" />
            <Form.Layout>
              <FormField
                columnSpan={6}
                className="w-full"
                hasError={isSubmitted && !!errors.description}
              >
                <FormField.Label>
                  {t('service-details:field.description')}
                </FormField.Label>
                <FormField.Control>
                  <TextEditor
                    ref={descriptionField.ref}
                    onBlur={descriptionField.onBlur}
                    onChange={descriptionField.onChange}
                    defaultValue={descriptionField.value}
                    className="h-40"
                    disabled={isDisabled}
                  />
                </FormField.Control>
                {isSubmitted && (
                  <FormField.Error>
                    {errors.description?.message}
                  </FormField.Error>
                )}
              </FormField>
              <FormField
                columnSpan={6}
                className="w-full"
                hasError={isSubmitted && !!errors.max}
              >
                <FormField.Label>
                  {t('service-details:field.max')}
                </FormField.Label>
                <FormField.Control>
                  <Input
                    type="number"
                    {...register('max', {
                      validate: {
                        positive: isPositiveNumber(
                          t('validation:field.positive-integer', {}),
                          true
                        ),
                      },
                      setValueAs: valueAs.NumberOrNull,
                    })}
                    disabled={isDisabled}
                  />
                </FormField.Control>
                {isSubmitted && (
                  <FormField.Error>{errors.max?.message}</FormField.Error>
                )}
              </FormField>
              <FormField columnSpan={6} className="w-full">
                <FormField.Control>
                  <Controller
                    name="preProductionReview"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isDisabled}
                      >
                        <Text
                          fontSize="sm"
                          textColor="secondary"
                          fontWeight="medium"
                        >
                          {t('service-details:field.preProductionReview')}
                        </Text>
                      </Checkbox>
                    )}
                  />
                </FormField.Control>
              </FormField>
            </Form.Layout>
            <Stack gap="4" direction="col" className="my-8">
              <Stack gap="1" direction="col">
                <Heading fontSize="xl" fontWeight="bold" textColor="primary">
                  {t('service-details:tags.title')}
                </Heading>
                <Text fontSize="sm" textColor="secondary">
                  {t('service-details:tags.subtitle')}
                </Text>
              </Stack>
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
                      service.tags,
                      'skill'
                    ).map((tag) => ({ id: tag.tagId, name: tag.value }))}
                  />
                )}
              />
            </Stack>
            <Stack gap="8" direction="col" className="my-8">
              <DeliverablesEditor
                deliverables={deliverables}
                isDisabled={isDisabled}
                isReadonly={isReadonly}
              />
            </Stack>
          </div>
        </Surface.Body>
        <Surface.Footer className="flex-none">
          <Stack width="full" gap="8">
            {!isReadonly && (
              <Button
                width="full"
                onClick={handlePublishClick}
                loading={isPublishing}
                disabled={isDisabled || isPublished}
                variant="secondary"
              >
                {t('service-details:action.publish')}
              </Button>
            )}

            <Button
              width="full"
              type="submit"
              loading={isSaving}
              disabled={isDisabled}
              form={formId}
            >
              {t('service-details:action.save')}
            </Button>
          </Stack>
        </Surface.Footer>
      </Surface>
    </FormProvider>
  )
}

const ServiceDetailsMain = ({
  service,
  ...props
}: SetOptional<ServiceDetailsProps, 'service'>) => {
  const { t } = useTranslation('service-details')

  return service ? (
    <ServiceDetails {...props} service={service} />
  ) : (
    <Surface divide={false} padding="8" className="flex-1 h-full">
      <Surface.Header className="flex-none">
        <Heading fontSize="3xl">{t('empty.title')}</Heading>
      </Surface.Header>
      <Surface.Body className="flex-1 min-h-40">
        <Text
          className="h-full content-center text-center"
          as="div"
          textColor="tertiary"
        >
          {t('empty.content')}
        </Text>
      </Surface.Body>
    </Surface>
  )
}

export default ServiceDetailsMain
