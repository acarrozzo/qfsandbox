import { OrganizationIdSchema } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { TransferProjectInputSchema } from '@mntn-dev/project-service/client'
import { useOpenState, useToast } from '@mntn-dev/ui-components'
import type { ZodInfer } from '@mntn-dev/utility-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefetchProject } from '~/components/projects/use-refetch-project.ts'

export const TransferProjectFormSchema = TransferProjectInputSchema.partial({
  brandTeamId: true,
  ownerId: true,
}).extend({ organizationId: OrganizationIdSchema.optional() })

export type TransferProjectForm = ZodInfer<typeof TransferProjectFormSchema>

export const useProjectTransfer = () => {
  const { t } = useTranslation(['toast'])
  const transferProject = trpcReactClient.projects.transferProject.useMutation()
  const refetchProject = useRefetchProject()
  const projectTransferModalOpenState = useOpenState()
  const { showToast } = useToast()

  const handleTransferProject = async (input: TransferProjectForm) => {
    await transferProject.mutateAsync(TransferProjectInputSchema.parse(input))
    await refetchProject(input)
    showToast.success({
      title: t('toast:project.transferred.title'),
      body: t('toast:project.transferred.body'),
    })
    projectTransferModalOpenState.onClose()
  }

  return {
    handleTransferProject,
    isProjectTransferring: transferProject.isPending,
    isProjectTransferError: transferProject.isError,
    projectTransferModalOpenState,
  }
}
