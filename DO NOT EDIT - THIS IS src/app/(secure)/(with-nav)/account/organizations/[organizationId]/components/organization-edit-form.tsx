'use client'

import { type PropsWithChildren, type ReactNode, useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { TagFormField } from '@mntn-dev/app-ui-components'
import {
  DescriptionSchema,
  filterTagsByCategory,
  type OrganizationDomainQueryModel,
  TagId,
  toTagsByCategoryMap,
} from '@mntn-dev/domain-types'
import { Controller, useForm, zodResolver } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  type UpdateOrganizationInput,
  UpdateOrganizationInputSchema,
} from '@mntn-dev/organization-service/client'
import {
  Button,
  Form,
  FormField,
  Heading,
  Input,
  Stack,
  Surface,
  TextEditor,
  transformOnChange,
  useEditorController,
} from '@mntn-dev/ui-components'

import { OrganizationTypeTag } from '#components/organization/organization-type-tag.tsx'
import { useTags } from '~/components/tag/use-tags.ts'
import { usePermissions } from '~/hooks/secure/use-permissions'
import { usePrincipal } from '~/hooks/secure/use-principal'
import { UniqueOrganizationNameSchemaBuilder } from '~/schemas/public.schema.ts'

type OrganizationEditFormProps = PropsWithChildren<{
  organization: OrganizationDomainQueryModel
  isUpdating: boolean
  onUpdate: (input: UpdateOrganizationInput) => Promise<void>
  actions?: ReactNode
}>

type OrganizationFormModel = UpdateOrganizationInput

const defaultValues = (
  organization: OrganizationDomainQueryModel
): OrganizationFormModel => ({
  ...organization,
  tags: { certification: [], ...toTagsByCategoryMap(organization.tags) },
})

export const OrganizationEditForm = ({
  organization,
  isUpdating,
  onUpdate,
  actions,
  children,
}: OrganizationEditFormProps) => {
  const { t } = useTranslation(['organization-details', 'validation'])
  const { t: tValidation } = useTranslation('validation')
  const { hasPermission } = usePermissions()
  const { principal } = usePrincipal()
  const router = useRouter()

  const {
    formState: { errors, isValidating },
    register,
    handleSubmit,
    reset,
    control,
  } = useForm({
    reValidateMode: 'onSubmit', // The default onChange is a bad experience because the latency involved with server-side validation.
    defaultValues: defaultValues(organization),
    resolver: zodResolver(
      UpdateOrganizationInputSchema.extend({
        name: UniqueOrganizationNameSchemaBuilder({
          t: tValidation,
          field: t('organization-details:field.name.label'),
          ignoreName: organization.name,
        }),
        description: DescriptionSchema.optional(),
      }),
      tValidation,
      {},
      { mode: 'async' }
    ),
  })

  const { field } = useEditorController({
    control,
    name: 'description',
  })

  const handleAllProjectsClicked = () => {
    router.push(
      route('/dashboard').query({ organizationId: organization.organizationId })
    )
  }

  useEffect(() => {
    reset(defaultValues(organization))
  }, [reset, organization])

  const { allTags } = useTags()

  const isBusy = isUpdating || isValidating

  return (
    <Form onSubmit={handleSubmit(onUpdate)}>
      <Stack>
        {actions && (
          <Stack direction="row" gap="4" width="full">
            {actions}
          </Stack>
        )}
        <div className="grow" />
      </Stack>
      <Stack justifyContent="center">
        <Stack direction="col" gap="8" width="full">
          <Surface padding="6" border>
            <Form.Layout>
              <div className="col-span-6">
                <Stack gap="2" alignItems="end">
                  <FormField hasError={!!errors.name} className="flex-1">
                    <FormField.Label>
                      {t('organization-details:field.name.label')}
                    </FormField.Label>
                    <FormField.Control>
                      <Input
                        {...register('name')}
                        disabled={isBusy}
                        iconRight={
                          <OrganizationTypeTag
                            organizationType={organization.organizationType}
                          />
                        }
                      />
                    </FormField.Control>
                    <FormField.Error>{errors.name?.message}</FormField.Error>
                  </FormField>
                  {principal.authz.organizationType === 'internal' && (
                    <Button
                      iconRight="arrow-right"
                      onClick={handleAllProjectsClicked}
                      size="lg"
                      variant="secondary"
                    >
                      {t('organization-details:action.all-projects')}
                    </Button>
                  )}
                </Stack>
              </div>
              <FormField hasError={!!errors.description} columnSpan={6}>
                <FormField.Label>
                  {t('organization-details:field.description.label')}
                </FormField.Label>
                <FormField.Control>
                  <TextEditor
                    ref={field.ref}
                    placeholder={t(
                      'organization-details:field.description.placeholder'
                    )}
                    className="h-40 resize-none text-base font-normal"
                    disabled={isBusy}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    defaultValue={field.value}
                  />
                </FormField.Control>
                <FormField.Error>{errors.description?.message}</FormField.Error>
              </FormField>
              <FormField hasError={!!errors.websiteUrl} columnSpan={6}>
                <FormField.Label>
                  {t('organization-details:field.websiteUrl.label')}
                </FormField.Label>
                <FormField.Control>
                  <Input {...register('websiteUrl')} disabled={isBusy} />
                </FormField.Control>
                <FormField.Error>{errors.websiteUrl?.message}</FormField.Error>
              </FormField>

              {hasPermission('customer-organization:administer') &&
                organization?.organizationType === 'agency' && (
                  <FormField columnSpan={6}>
                    <FormField.Label>
                      {t('organization-details:internal.internal-only')}
                    </FormField.Label>
                    <FormField.Control>
                      <Surface padding="4">
                        <Surface.Header className="p-4">
                          <Heading
                            fontSize="xl"
                            fontWeight="bold"
                            textColor="primary"
                          >
                            {t('organization-details:internal.tags.title')}
                          </Heading>
                        </Surface.Header>
                        <Surface.Body>
                          <Controller
                            name="tags.certification"
                            control={control}
                            render={({ field: { onChange, ...field } }) => (
                              <TagFormField
                                disabled={isBusy}
                                columnSpan={6}
                                {...field}
                                onChange={transformOnChange(
                                  onChange,
                                  (item) => ({
                                    ...item,
                                    tagId: TagId(item.id),
                                  })
                                )}
                                category="certification"
                                allTags={allTags}
                                initialSelectedItems={filterTagsByCategory(
                                  organization.tags,
                                  'certification'
                                ).map((tag) => ({
                                  id: tag.tagId,
                                  name: tag.value,
                                }))}
                              />
                            )}
                          />
                        </Surface.Body>
                      </Surface>
                    </FormField.Control>
                  </FormField>
                )}

              <FormField columnSpan={6} className="items-end">
                <Button
                  disabled={isBusy}
                  loading={isBusy}
                  type="submit"
                  width="fit"
                >
                  {t('organization-details:action.save')}
                </Button>
              </FormField>
            </Form.Layout>
          </Surface>
          {children}
        </Stack>
      </Stack>
    </Form>
  )
}
