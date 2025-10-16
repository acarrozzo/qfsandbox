'use client'

import { useEffect } from 'react'

import { Controller, useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import {
  Form,
  FormField,
  FormModal,
  Input,
  type ModalProps,
} from '@mntn-dev/ui-components'
import { usePreviousDistinct } from '@mntn-dev/ui-utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { OrganizationSelect } from '~/components/organization/organization-select.tsx'
import { OrganizationTeamSelect } from '~/components/team/team-select.tsx'
import { TeamUserSelect } from '~/components/user/user-select.tsx'

import type { TransferProjectForm } from '../hooks/use-project-transfer.ts'
import { useValidateProjectTransferrable } from '../hooks/use-validate-project-transferrable.ts'

type ProjectTransferModalProps = Pick<ModalProps, 'open' | 'onClose'> &
  Readonly<{
    project: ProjectWithAcl
    onTransferProject: (input: TransferProjectForm) => void
    isProjectTransferring: boolean
    isProjectTransferError: boolean
  }>

export type ProjectTransferModalExternalProps = Pick<
  ProjectTransferModalProps,
  'onTransferProject' | 'isProjectTransferring'
>

const ProjectTransferModal = ({
  project,
  onTransferProject,
  isProjectTransferring,
  isProjectTransferError,
  ...props
}: ProjectTransferModalProps) => {
  const { t } = useTranslation(['project-transfer', 'validation'])

  const { projectId, name } = project

  const defaultValues: TransferProjectForm = {
    projectId,
  }

  const [organizations] =
    trpcReactClient.organizations.listCompactOrganizations.useSuspenseQuery({
      organizationType: 'brand',
    })

  const validateProjectTransferrable = useValidateProjectTransferrable()

  const {
    formState: { errors, isSubmitting },
    setValue,
    handleSubmit,
    watch,
    control,
  } = useForm({
    defaultValues,
  })

  const { brandTeamId, organizationId } = watch()

  // biome-ignore lint/correctness/useExhaustiveDependencies: organizationId is the trigger.
  useEffect(() => {
    setValue('brandTeamId', undefined)
  }, [organizationId, setValue])

  // biome-ignore lint/correctness/useExhaustiveDependencies: brandTeamId is the trigger.
  useEffect(() => {
    setValue('ownerId', undefined)
  }, [brandTeamId, setValue])

  const { onClose } = props
  const wasProjectTransferring = usePreviousDistinct(isProjectTransferring)
  const isBusy = isProjectTransferring || wasProjectTransferring || isSubmitting

  return (
    <FormModal {...props}>
      <FormModal.Form
        onSubmit={(e) => {
          // This form is nested inside of the "project-form" so we should not let it bubble up to the parent form.
          e.preventDefault()
          e.stopPropagation()
          return handleSubmit(onTransferProject)(e)
        }}
        id="project-transfer"
        className="h-full"
      >
        <FormModal.Header
          icon={{ name: 'video', size: '6xl' }}
          title={t('project-transfer:title')}
        />
        <FormModal.Body>
          <Form.Layout>
            <FormField columnSpan={6} className="w-full">
              <FormField.Label>
                {t('project-transfer:field.name')}
              </FormField.Label>
              <FormField.Control>
                <Input readOnly defaultValue={name} />
              </FormField.Control>
            </FormField>
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.organizationId}
            >
              <FormField.Label>
                {t('project-transfer:field.organizationId')}
              </FormField.Label>
              <FormField.Control>
                <Controller
                  name="organizationId"
                  control={control}
                  rules={{
                    validate: async (value) => {
                      if (!value) {
                        return t('validation:field.required', {
                          field: t('project-transfer:field.organizationId'),
                        })
                      }

                      return await validateProjectTransferrable(project, value)
                    },
                  }}
                  render={({ field }) => (
                    <OrganizationSelect
                      {...field}
                      disabled={isBusy}
                      organizations={organizations}
                    />
                  )}
                />
              </FormField.Control>
              <FormField.Error>
                {errors.organizationId?.message}
              </FormField.Error>
            </FormField>
            {organizationId && (
              <FormField
                columnSpan={6}
                className="w-full"
                hasError={!!errors.brandTeamId}
              >
                <FormField.Label>
                  {t('project-transfer:field.brandTeamId')}
                </FormField.Label>
                <FormField.Control>
                  <Controller
                    name="brandTeamId"
                    control={control}
                    rules={{
                      required: t('validation:field.required', {
                        field: t('project-transfer:field.brandTeamId'),
                      }),
                    }}
                    render={({ field }) => (
                      <OrganizationTeamSelect
                        {...field}
                        disabled={isBusy}
                        organizationId={organizationId}
                      />
                    )}
                  />
                </FormField.Control>
                <FormField.Error>{errors.brandTeamId?.message}</FormField.Error>
              </FormField>
            )}
            {organizationId && brandTeamId && (
              <FormField
                columnSpan={6}
                className="w-full"
                hasError={!!errors.ownerId}
              >
                <FormField.Label>
                  {t('project-transfer:field.ownerId')}
                </FormField.Label>
                <FormField.Control>
                  <Controller
                    name="ownerId"
                    control={control}
                    rules={{
                      required: t('validation:field.required', {
                        field: t('project-transfer:field.ownerId'),
                      }),
                    }}
                    render={({ field }) => (
                      <TeamUserSelect
                        {...field}
                        disabled={isBusy}
                        teamId={brandTeamId}
                      />
                    )}
                  />
                </FormField.Control>
                <FormField.Error>{errors.ownerId?.message}</FormField.Error>
              </FormField>
            )}
          </Form.Layout>
        </FormModal.Body>
        <FormModal.Footer>
          <FormField hasError={isProjectTransferError}>
            <FormModal.AcceptButton
              type="submit"
              form="project-transfer"
              loading={isBusy}
              disabled={isBusy}
            >
              {t('project-transfer:action.transfer')}
            </FormModal.AcceptButton>

            <FormField.Error>
              {t('project-transfer:error.unknown')}
            </FormField.Error>
          </FormField>
          <FormModal.CancelButton onClick={onClose} disabled={isBusy}>
            {t('project-transfer:action.cancel')}
          </FormModal.CancelButton>
        </FormModal.Footer>
      </FormModal.Form>
    </FormModal>
  )
}

export { ProjectTransferModal, type ProjectTransferModalProps }
