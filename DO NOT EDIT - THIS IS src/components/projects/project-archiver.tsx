import type { ProjectListItemServiceModel } from '@mntn-dev/domain-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { ArchiveConfirmation } from '~/components/shared/archive-confirmation'

type Props = {
  project: ProjectListItemServiceModel
  onClose: () => void
  onConfirm: () => void
}

export const ProjectArchiver = ({ project, onClose, onConfirm }: Props) => {
  const archive = trpcReactClient.projects.archiveProject.useMutation()

  const handleConfirm = async () => {
    await archive.mutateAsync(project.projectId)
    onConfirm()
  }

  return (
    <ArchiveConfirmation
      open
      isError={archive.isError}
      isLoading={archive.isPending || archive.isSuccess}
      resourceName={project.name}
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  )
}
