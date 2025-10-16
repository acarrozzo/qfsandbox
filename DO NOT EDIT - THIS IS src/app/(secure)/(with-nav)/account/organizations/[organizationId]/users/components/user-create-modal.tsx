'use client'

import {
  type TeamDomainQueryModel,
  TeamIdSchema,
  type UserRoleKey,
  withTeamIds,
} from '@mntn-dev/domain-types'
import { Controller, useForm, zodResolver } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { GetOrganizationOutput } from '@mntn-dev/organization-service'
import {
  Form,
  FormField,
  FormModal,
  Input,
  type ModalProps,
} from '@mntn-dev/ui-components'
import { usePreviousDistinct } from '@mntn-dev/ui-utilities'
import {
  type CreateUserInput,
  CreateUserInputSchema,
} from '@mntn-dev/user-service/client'
import { oneOrEmpty } from '@mntn-dev/utilities'

import { UserRoleFormField } from '~/components/user/user-role-form-field.tsx'
import { useMyOrganization } from '~/hooks/secure/use-my-organization.ts'
import { UniqueUserEmailAddressSchemaBuilder } from '~/schemas/public.schema.ts'

import { TeamCheckboxList } from '../../teams/components/team-checkbox-list.tsx'

type UserCreateModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    onCreate: (input: CreateUserInput) => Promise<void>
    isCreating: boolean
    organization: GetOrganizationOutput
    teams: TeamDomainQueryModel[]
  }>

const formId = 'user-create'

const UserCreateModal = ({
  onCreate,
  isCreating,
  organization: { organizationId, organizationType },
  organization,
  teams,
  ...props
}: UserCreateModalProps) => {
  const { t } = useTranslation(['role', 'user-create'])
  const { t: tValidation } = useTranslation('validation')
  const { multiTeam } = useMyOrganization()

  const { onClose } = props
  const wasCreating = usePreviousDistinct(isCreating)

  const defaultRoles: UserRoleKey[] = []
  const defaultTeamIds = oneOrEmpty(withTeamIds(organization).teamIds) // Automatically put users on all teams if there is exactly one in the org.

  const {
    control,
    formState: { errors, isValidating },
    register,
    handleSubmit,
  } = useForm({
    reValidateMode: 'onSubmit', // The default onChange is a bad experience because the latency involved with server-side validation.
    defaultValues: {
      organizationId,
      roles: defaultRoles,
      teamIds: defaultTeamIds,
      emailAddress: '',
      firstName: '',
      lastName: '',
    },
    resolver: zodResolver(
      CreateUserInputSchema.extend({
        emailAddress: UniqueUserEmailAddressSchemaBuilder({
          t: tValidation,
          field: t('user-create:field.emailAddress.label'),
        }),
        teamIds:
          organizationType === 'internal'
            ? CreateUserInputSchema.shape.teamIds
            : TeamIdSchema.array().min(1, t('user-create:field.teamIds.error')),
      }),
      tValidation,
      {},
      { mode: 'async' }
    ),
  })

  const isBusy = isCreating || wasCreating || isValidating

  return (
    <FormModal {...props}>
      <FormModal.Form id={formId} onSubmit={handleSubmit(onCreate)}>
        <FormModal.Header
          icon={{ name: 'user', size: '6xl' }}
          title={t('user-create:title')}
        />
        <FormModal.Body>
          <Form.Layout>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.emailAddress}
            >
              <FormField.Label>
                {t('user-create:field.emailAddress.label')}
              </FormField.Label>
              <FormField.Control>
                <Input
                  {...register('emailAddress')}
                  disabled={isBusy}
                  autoFocus
                  placeholder={t('user-create:field.emailAddress.placeholder')}
                />
              </FormField.Control>
              <FormField.Error>{errors.emailAddress?.message}</FormField.Error>
            </FormField>
            <FormField
              columnSpan={3}
              className="w-full"
              hasError={!!errors.firstName}
            >
              <FormField.Label>
                {t('user-create:field.firstName.label')}
              </FormField.Label>
              <FormField.Control>
                <Input
                  {...register('firstName')}
                  disabled={isBusy}
                  placeholder={t('user-create:field.firstName.placeholder')}
                />
              </FormField.Control>
              <FormField.Error>{errors.firstName?.message}</FormField.Error>
            </FormField>
            <FormField
              columnSpan={3}
              className="w-full"
              hasError={!!errors.lastName}
            >
              <FormField.Label>
                {t('user-create:field.lastName.label')}
              </FormField.Label>
              <FormField.Control>
                <Input
                  {...register('lastName')}
                  disabled={isBusy}
                  autoFocus
                  placeholder={t('user-create:field.lastName.placeholder')}
                />
              </FormField.Control>
              <FormField.Error>{errors.lastName?.message}</FormField.Error>
            </FormField>

            <Controller
              name="roles"
              control={control}
              render={({ field: { disabled, ...field } }) => (
                <UserRoleFormField
                  {...field}
                  disabled={disabled || isBusy}
                  columnSpan={6}
                  errorMessage={errors.roles?.message}
                  hasError={!!errors.roles}
                  label={t('user-create:field.roles.label')}
                  selectedItems={field.value?.map((role) => ({
                    id: role,
                    name: t(`role:${role}`),
                  }))}
                />
              )}
            />

            {multiTeam && (
              <FormField columnSpan={6} hasError={!!errors.teamIds}>
                <FormField.Label>
                  {t('user-create:field.teamIds.label')}
                </FormField.Label>
                <FormField.Control>
                  <Controller
                    name="teamIds"
                    control={control}
                    render={({ field: { disabled, ...field } }) => (
                      <TeamCheckboxList
                        {...field}
                        disabled={disabled || isBusy}
                        teams={teams}
                      />
                    )}
                  />
                </FormField.Control>
                <FormField.Error>{errors.teamIds?.message}</FormField.Error>
              </FormField>
            )}
          </Form.Layout>
        </FormModal.Body>
        <FormModal.Footer orientation="horizontal">
          <FormModal.CancelButton onClick={onClose} disabled={isBusy}>
            {t('user-create:action.cancel')}
          </FormModal.CancelButton>
          <FormModal.AcceptButton
            type="submit"
            form={formId}
            disabled={isBusy}
            loading={isBusy}
          >
            {t('user-create:action.create')}
          </FormModal.AcceptButton>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}

export { UserCreateModal, type UserCreateModalProps }
