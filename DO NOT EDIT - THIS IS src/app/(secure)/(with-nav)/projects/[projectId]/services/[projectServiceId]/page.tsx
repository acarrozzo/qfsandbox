import { redirect } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectServiceId } from '@mntn-dev/domain-types'
import { isDefined } from '@mntn-dev/utilities'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'
import { ProjectServicePage } from '~/app/(secure)/(with-nav)/projects/[projectId]/services/[projectServiceId]/project-service-page'

export default async function Page({
  params: { projectServiceId },
}: Readonly<{
  params: { projectServiceId: ProjectServiceId }
}>) {
  const projectService =
    await trpcServerSideClient.projects.getProjectServiceByIdWithProject(
      projectServiceId
    )

  const { review } =
    await trpcServerSideClient.reviews.preProduction.selectReview({
      projectServiceId,
    })

  if (isDefined(review)) {
    redirect(
      route('/projects/:projectId/services/:projectServiceId/review')
        .params({ projectId: projectService.projectId, projectServiceId })
        .toRelativeUrl()
    )
  }

  return <ProjectServicePage initialService={projectService} />
}
