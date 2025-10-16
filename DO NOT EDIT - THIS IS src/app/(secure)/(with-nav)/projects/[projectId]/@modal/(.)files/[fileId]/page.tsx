import type { FileId, ProjectId } from '@mntn-dev/domain-types'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'
import { PageModal } from '~/components/page/index.ts'

import { FilePage } from '../../../files/components/file-page.tsx'

export default async function Page({
  params: { projectId, fileId },
}: {
  params: { projectId: ProjectId; fileId: FileId }
}) {
  const { project } = await trpcServerSideClient.projects.get(projectId)

  return (
    <PageModal>
      <FilePage project={project} fileId={fileId} />
    </PageModal>
  )
}
