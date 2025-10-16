import { useState } from 'react'

import { AppTrans } from '@mntn-dev/app-common'
import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'
import { useForm } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import {
  FormField,
  FormModal,
  Icon,
  Stack,
  Text,
  Textarea,
} from '@mntn-dev/ui-components'

import { ProjectCloseConfirmation } from '#components/projects/project-close-confirmation.tsx'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

type Props = {
  project: ProjectListItemServiceModel
  onClose: () => void
  onConfirm: () => void
}

export const ProjectCloseModal = ({
  project: { projectId, acl, name },
  onClose,
  onConfirm,
}: Props) => {
  const { t } = useTranslation(['project-close'])

  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState<{ reason: string } | null>(null)

  const setClosed = trpcReactClient.projects.setProjectClosed.useMutation()
  const isLoading = setClosed.isPending || setClosed.isSuccess

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { reason: '' },
  })

  const handleConfirm = async () => {
    if (acl.canSetProjectClosed && formData) {
      await setClosed.mutateAsync({ projectId, reason: formData.reason })
      onConfirm()
    }
  }

  return (
    <>
      <FormModal open={!showConfirm} onClose={onClose}>
        <FormModal.Form
          onSubmit={handleSubmit((data: { reason: string }) => {
            setFormData(data)
            setShowConfirm(true)
          })}
        >
          <Stack
            direction="col"
            paddingTop="8"
            justifyContent="center"
            alignItems="center"
          >
            <Icon name="close-circle" size="3xl" color="negative" />
            <FormModal.Header title={t('project-close:close-project')} />
          </Stack>

          <FormModal.Body className="flex flex-col gap-8">
            <FormField
              columnSpan={6}
              className="w-full"
              hasError={!!errors.reason}
            >
              <FormField.Label>
                {t('project-close:reason-for-cancellation')}
              </FormField.Label>
              <FormField.Control>
                <Textarea
                  {...register('reason', {
                    required: t('project-close:reason-required'),
                  })}
                  className="h-32 resize-none text-base font-normal"
                  disabled={isLoading}
                />
              </FormField.Control>
              <FormField.Error>{errors.reason?.message}</FormField.Error>
            </FormField>

            <Text textColor="secondary" fontSize="lg">
              <AppTrans
                t={t}
                i18nKey="project-close:disclaimer"
                values={{
                  name,
                }}
                components={{
                  negative: <Text textColor="negative" fontSize="lg" />,
                  'primary-bold': (
                    <Text textColor="primary" fontWeight="bold" fontSize="lg" />
                  ),
                }}
              />
            </Text>
          </FormModal.Body>
          <FormModal.Footer orientation="horizontal">
            <FormModal.CancelButton onClick={onClose} disabled={isLoading}>
              {t('project-close:action.cancel')}
            </FormModal.CancelButton>
            <FormModal.AcceptButton
              type="submit"
              variant="destructive"
              disabled={isLoading}
              loading={isLoading}
            >
              {t('project-close:action.close')}
            </FormModal.AcceptButton>
          </FormModal.Footer>
        </FormModal.Form>
      </FormModal>
      <ProjectCloseConfirmation
        open={showConfirm}
        isLoading={isLoading}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
      />
    </>
  )
}
