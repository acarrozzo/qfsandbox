'use client'

import type { TFunction } from 'i18next'
import { type PropsWithChildren, useEffect, useMemo } from 'react'

import {
  type TeamDomainSelectModel,
  TeamIdSchema,
} from '@mntn-dev/domain-types'
import { Controller, useForm, zodResolver } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Form, FormField, Input, Stack } from '@mntn-dev/ui-components'
import {
  type GetUserModel,
  type UpdateUserInput,
  UpdateUserInputSchema,
} from '@mntn-dev/user-service/client'

import { UserRoleFormField } from '~/components/user/user-role-form-field.tsx'
import { useAuthorizedSession } from '~/hooks/secure/use-authorized-session.ts'
import { useMyOrganization } from '~/hooks/secure/use-my-organization.ts'
import { UniqueUserEmailAddressSchemaBuilder } from '~/schemas/public.schema.ts'

import { TeamCheckboxList } from '../../teams/components/team-checkbox-list.tsx'
import { UserEditAvatar } from './user-edit-avatar.tsx'

type UserEditFormProps = PropsWithChildren<{
  user: GetUserModel
  isUpdating: boolean
  onUpdate: (input: UpdateUserInput) => Promise<void>
  onAvatarChanged: () => void
  tEdit: TFunction<['user-details' | 'profile-details']>
  teams: TeamDomainSelectModel[]
}>

type UserFormModel = UpdateUserInput

export const UserEditForm = ({
  user: userProp,
  isUpdating,
  onUpdate,
  onAvatarChanged,
  tEdit,
  teams,
  children,
}: UserEditFormProps) => {
  const { multiTeam } = useMyOrganization()
  const {
    authz: { organizationType },
  } = useAuthorizedSession()

  const user: UserFormModel = useMemo(
    () => ({
      ...userProp,
      teamIds: userProp.teams?.map((team) => team.teamId) ?? [],
    }),
    [userProp]
  )

  const { t: tRole } = useTranslation('role')
  const { t: tValidation } = useTranslation('validation')

  const defaultTeamIds = useMemo(
    () =>
      userProp.acl.canChangeUserTeams
        ? (userProp.teams?.map((team) => team.teamId) ?? [])
        : undefined,
    [userProp.acl.canChangeUserTeams, userProp.teams]
  )

  const defaultRoles = useMemo(
    () =>
      userProp.acl.canChangeUserRoles ? (userProp.roles ?? []) : undefined,
    [userProp.acl.canChangeUserRoles, userProp.roles]
  )

  const {
    formState: { errors, isValidating },
    register,
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {
      ...user,
      roles: defaultRoles,
      teamIds: defaultTeamIds,
    },
    resolver: zodResolver(
      UpdateUserInputSchema.extend({
        emailAddress: UniqueUserEmailAddressSchemaBuilder({
          t: tValidation,
          field: tEdit('field.emailAddress'),
          ignoreEmail: user.emailAddress,
        }),
        teamIds:
          userProp.organizationType === 'internal' ||
          !userProp.acl.canChangeUserTeams
            ? UpdateUserInputSchema.shape.teamIds
            : TeamIdSchema.array().min(1, tEdit('error.teamIds')),
      }),
      tValidation,
      {},
      { mode: 'async' }
    ),
  })

  useEffect(() => {
    reset({
      ...user,
      roles: defaultRoles,
      teamIds: defaultTeamIds,
    })
  }, [reset, user, defaultTeamIds, defaultRoles])

  const isBusy = isUpdating || isValidating

  return (
    <Form onSubmit={handleSubmit(onUpdate)}>
      <Stack justifyContent="end">
        <Button disabled={isBusy} loading={isBusy} type="submit" width="fit">
          {tEdit('action.save')}
        </Button>
      </Stack>
      <Stack justifyContent="center">
        <Stack direction="col" maxWidth="3xl" width="full">
          <Form.Layout>
            <FormField columnSpan={6}>
              <Stack justifyContent="center">
                <UserEditAvatar user={userProp} onChanged={onAvatarChanged} />
              </Stack>
            </FormField>

            <FormField hasError={!!errors.firstName} columnSpan={3}>
              <FormField.Label>{tEdit('field.firstName')}</FormField.Label>
              <FormField.Control>
                <Input {...register('firstName')} disabled={isBusy} />
              </FormField.Control>
              <FormField.Error>{errors.firstName?.message}</FormField.Error>
            </FormField>

            <FormField hasError={!!errors.lastName} columnSpan={3}>
              <FormField.Label>{tEdit('field.lastName')}</FormField.Label>
              <FormField.Control>
                <Input {...register('lastName')} disabled={isBusy} />
              </FormField.Control>
              <FormField.Error>{errors.lastName?.message}</FormField.Error>
            </FormField>

            <FormField hasError={!!errors.emailAddress} columnSpan={6}>
              <FormField.Label>{tEdit('field.emailAddress')}</FormField.Label>
              <FormField.Control>
                <Input
                  {...register('emailAddress')}
                  disabled={organizationType !== 'internal'}
                />
              </FormField.Control>
              <FormField.Error>{errors.emailAddress?.message}</FormField.Error>
            </FormField>

            {userProp.acl.canChangeUserRoles && (
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <UserRoleFormField
                    disabled={isBusy}
                    columnSpan={6}
                    {...field}
                    errorMessage={errors.roles?.message}
                    hasError={!!errors.roles}
                    label={tEdit('field.roles')}
                    selectedItems={field.value?.map((role) => ({
                      id: role,
                      name: tRole(role),
                    }))}
                  />
                )}
              />
            )}

            {multiTeam && userProp.acl.canChangeUserTeams && (
              <FormField columnSpan={6} hasError={!!errors.teamIds}>
                <FormField.Label>{tEdit('teams')}</FormField.Label>
                <FormField.Control>
                  <Controller
                    name="teamIds"
                    control={control}
                    render={({ field }) => (
                      <TeamCheckboxList
                        teams={teams}
                        {...field}
                        value={field.value ?? []}
                      />
                    )}
                  />
                </FormField.Control>
                <FormField.Error>{errors.teamIds?.message}</FormField.Error>
              </FormField>
            )}

            {children}
          </Form.Layout>
        </Stack>
      </Stack>
    </Form>
  )
}
