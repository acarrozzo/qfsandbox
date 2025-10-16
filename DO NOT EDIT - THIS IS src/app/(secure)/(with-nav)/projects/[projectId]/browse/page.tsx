import { redirect } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectId } from '@mntn-dev/domain-types'

import { ProjectServiceBrowser } from '#projects/components/services/project-service-browser.tsx'
import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

export default async function Page({
  params: { projectId },
}: {
  params: { projectId: ProjectId }
}) {
  const { project: initialProject } =
    await trpcServerSideClient.projects.get(projectId)
  const initialPackageServices =
    await trpcServerSideClient.projects.getPackageServicesForProject(projectId)
  const initialProjectServices =
    await trpcServerSideClient.projects.getProjectServicesByProjectId(projectId)

  if (!initialProject.acl.canModifyProjectServices) {
    redirect(
      route('/projects/:projectId').params({ projectId }).toRelativeUrl()
    )
  }

  return (
    <ProjectServiceBrowser
      initialProject={initialProject}
      initialPackageServices={initialPackageServices}
      initialServices={initialProjectServices}
    />
  )
}
