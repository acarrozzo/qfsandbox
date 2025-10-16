import type { FileListItem } from '@mntn-dev/file-service'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

import { ArchiveConfirmation } from '../shared/archive-confirmation.tsx'

type Props = {
  file: FileListItem
  onClose: () => void
  onConfirm: () => void
}

export const FileArchiver = ({ file, onClose, onConfirm }: Props) => {
  const archive = trpcReactClient.files.archiveFile.useMutation()

  const handleConfirm = async () => {
    await archive.mutateAsync({ fileId: file.fileId })
    onConfirm()
  }

  return (
    <ArchiveConfirmation
      open
      isError={archive.isError}
      isLoading={archive.isPending || archive.isSuccess}
      resourceName={file.name}
      onClose={onClose}
      onConfirm={handleConfirm}
    />
  )
}
