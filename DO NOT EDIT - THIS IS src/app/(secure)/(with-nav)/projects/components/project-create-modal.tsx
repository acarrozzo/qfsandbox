'use client'

import { useEffect } from 'react'

import {
  hasMultipleTeams,
  type PackageId,
  TeamId,
} from '@mntn-dev/domain-types'
import { Controller, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { CreateProjectInput } from '@mntn-dev/project-service'
import {
  AutoInput,
  Form,
  FormField,
  FormModal,
  type ModalProps,
} from '@mntn-dev/ui-components'
import { usePreviousDistinct } from '@mntn-dev/ui-utilities'
import { first } from '@mntn-dev/utilities'

import { MyOrganizationTeamSelect } from '~/components/team/team-select.tsx'
import { useMe } from '~/hooks/secure/use-me.ts'

type ProjectCreateModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    packageId: PackageId
    onCreate: (input: CreateProjectInput) => void
    isCreating: boolean
  }>

const ProjectCreateModal = ({
  packageId,
  onCreate,
  isCreating,
  ...props
}: ProjectCreateModalProps) => {
  const { t } = useTranslation(['project-create', 'validation'])
  const { me } = useMe()

  const {
    formState: { errors },
    register,
    handleSubmit,
    getValues,
    control,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      packageId,
      brandTeamId: first(me.teams)?.teamId ?? TeamId.Empty,
    },
  })

  const { name } = getValues()

  const { onClose } = props
  const wasCreating = usePreviousDistinct(isCreating)
  const isBusy = isCreating || wasCreating

  useEffect(() => {
    reset({
      name: '',
      packageId,
      brandTeamId: first(me.teams)?.teamId ?? TeamId.Empty,
    })
  }, [packageId, reset, me.teams])

  return (
    <FormModal {...props}>
      <FormModal.Form
        onSubmit={handleSubmit(onCreate)}
        id="project-create"
        className="h-full"
      >
        <FormModal.Header
          icon={{ name: 'video', size: '6xl' }}
          title={t('project-create:title')}
        />
        <FormModal.Body>
          <Form.Layout>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.name}
            >
              <FormField.Label>
                {t('project-create:field.name.label')}
              </FormField.Label>
              <FormField.Control>
                <AutoInput
                  {...register('name', {
                    required: t('validation:field.required', {
                      field: t('project-create:field.name.name'),
                    }),
                  })}
                  dataTestId="start-project-title-input"
                  defaultValue={name}
                  disabled={isBusy}
                  autoFocus
                />
              </FormField.Control>
              <FormField.Error>{errors.name?.message}</FormField.Error>
            </FormField>
            {hasMultipleTeams(me) && (
              <FormField
                columnSpan={6}
                className="w-full"
                hasError={!!errors.brandTeamId}
              >
                <FormField.Label>
                  {t('project-create:field.brandTeamId')}
                </FormField.Label>
                <FormField.Control>
                  <Controller
                    name="brandTeamId"
                    control={control}
                    rules={{
                      required: t('validation:field.required', {
                        field: t('project-create:field.brandTeamId'),
                      }),
                    }}
                    render={({ field }) => (
                      <MyOrganizationTeamSelect {...field} disabled={isBusy} />
                    )}
                  />
                  <FormField.Error>
                    {errors.brandTeamId?.message}
                  </FormField.Error>
                </FormField.Control>
              </FormField>
            )}
          </Form.Layout>
        </FormModal.Body>
        <FormModal.Footer>
          <FormModal.AcceptButton
            type="submit"
            loading={isBusy}
            disabled={isBusy}
          >
            {t('project-create:action.create')}
          </FormModal.AcceptButton>
          <FormModal.CancelButton onClick={onClose} disabled={isBusy}>
            {t('project-create:action.cancel')}
          </FormModal.CancelButton>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}

export { ProjectCreateModal, type ProjectCreateModalProps }
