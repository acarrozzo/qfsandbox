import type { ProjectId } from '@mntn-dev/domain-types'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

import { FilesPage } from './components/files-page.tsx'

export default async function Page({
  params: { projectId },
}: {
  params: { projectId: ProjectId }
}) {
  const { project } = await trpcServerSideClient.projects.get(projectId)

  return <FilesPage project={project} />
}
