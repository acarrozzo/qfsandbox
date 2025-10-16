'use client'

import type { OrganizationDomainSelectModel } from '@mntn-dev/domain-types'
import { Controller, useForm, zodResolver } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  type CreateTeamInput,
  CreateTeamInputSchema,
} from '@mntn-dev/team-service/client'
import {
  Form,
  FormField,
  FormModal,
  Input,
  type ModalProps,
  Text,
} from '@mntn-dev/ui-components'
import { usePreviousDistinct } from '@mntn-dev/ui-utilities'

import { AllOrganizationSelect } from '~/components/organization/organization-select.tsx'
import { useMyOrganization } from '~/hooks/secure/use-my-organization.ts'
import { usePermissions } from '~/hooks/secure/use-permissions'

type TeamCreateModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    onCreate: (input: CreateTeamInput) => Promise<void>
    isCreating: boolean
    organization: OrganizationDomainSelectModel
  }>

const TeamCreateModal = ({
  onCreate,
  isCreating,
  organization: { organizationId, organizationType },
  ...props
}: TeamCreateModalProps) => {
  const { t } = useTranslation(['team-create'])
  const { t: tValidation } = useTranslation('validation')
  const { hasPermission } = usePermissions()
  const { multiTeam } = useMyOrganization()

  const { onClose } = props
  const wasCreating = usePreviousDistinct(isCreating)

  const {
    formState: { errors, isValidating },
    register,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      organizationId,
      organizationType,
      name: '',
    },
    resolver: zodResolver(CreateTeamInputSchema, tValidation),
  })

  const isBusy = isCreating || wasCreating || isValidating

  return (
    <FormModal {...props}>
      <FormModal.Form id="team-create" onSubmit={handleSubmit(onCreate)}>
        <FormModal.Header
          icon={{ name: 'team' }}
          title={t(`team-create:title.${organizationType}`)}
        />
        <FormModal.Body>
          <Form.Layout>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.name}
            >
              <FormField.Label>
                {t(`team-create:field.name.label.${organizationType}`)}
              </FormField.Label>
              <FormField.Control>
                <Input
                  {...register('name')}
                  disabled={isBusy}
                  autoFocus
                  placeholder={t(
                    `team-create:field.name.placeholder.${organizationType}`
                  )}
                />
              </FormField.Control>
              <FormField.Error>{errors.name?.message}</FormField.Error>
            </FormField>
            {hasPermission('customer-team:administer') && (
              <FormField
                columnSpan={6}
                className="w-full"
                hasError={!!errors.organizationId}
              >
                <FormField.Label>
                  {t('team-create:field.organizationId.label')}
                </FormField.Label>
                <FormField.Control>
                  <Controller
                    name="organizationId"
                    control={control}
                    rules={{
                      required: tValidation('field.required', {
                        field: t('team-create:field.organizationId.label'),
                      }),
                    }}
                    render={({ field }) => (
                      <AllOrganizationSelect {...field} disabled={isBusy} />
                    )}
                  />
                  <FormField.Error>
                    {errors.organizationId?.message}
                  </FormField.Error>
                </FormField.Control>
              </FormField>
            )}
            {!multiTeam && (
              <FormField columnSpan={6} className="w-full">
                <Text fontWeight="medium" textColor="tertiary">
                  {t(`team-create:info.${organizationType}`)}
                </Text>
              </FormField>
            )}
          </Form.Layout>
        </FormModal.Body>
        <FormModal.Footer orientation="horizontal">
          <FormModal.CancelButton onClick={onClose} disabled={isBusy}>
            {t('team-create:action.cancel')}
          </FormModal.CancelButton>
          <FormModal.AcceptButton
            type="submit"
            disabled={isBusy}
            loading={isBusy}
          >
            {t(`team-create:action.create.${organizationType}`)}
          </FormModal.AcceptButton>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}

export { TeamCreateModal, type TeamCreateModalProps }
