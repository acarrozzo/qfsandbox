import type { FileId, ProjectId } from '@mntn-dev/domain-types'
import { SidebarLayoutContent } from '@mntn-dev/ui-components'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

import { FilePage } from '../components/file-page.tsx'

export default async function Page({
  params: { projectId, fileId },
}: {
  params: { projectId: ProjectId; fileId: FileId }
}) {
  const { project } = await trpcServerSideClient.projects.get(projectId)

  return (
    <SidebarLayoutContent>
      <FilePage project={project} fileId={fileId} />
    </SidebarLayoutContent>
  )
}
