'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { FileId } from '@mntn-dev/domain-types'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import { Stack, useModalContext } from '@mntn-dev/ui-components'

import { FilePreview } from '~/components/files/file-preview.tsx'
import { FilePreviewHeader } from '~/components/files/file-preview-header.tsx'

export function FilePage({
  project,
  fileId,
}: {
  project: ProjectWithAcl
  fileId: FileId
}) {
  const { projectId } = project
  const router = useRouter()

  const context = useModalContext()

  const handleClose = () => {
    if (context?.isInModal) {
      router.back()
    } else {
      router.backOrPush(
        route('/projects/:projectId/files').params({ projectId })
      )
    }
  }

  return (
    <Stack
      direction="col"
      height="screen"
      paddingTop="16"
      paddingX="12"
      paddingBottom="12"
      width="full"
    >
      <FilePreviewHeader onClose={handleClose} />
      <FilePreview key={fileId} fileId={fileId} />
    </Stack>
  )
}
