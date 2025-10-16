import { redirect } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectServiceId } from '@mntn-dev/domain-types'
import { isNotDefined } from '@mntn-dev/utilities'

import { ProjectServiceReviewPage } from '#projects/[projectId]/services/[projectServiceId]/review/project-service-review-page.tsx'
import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

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

  if (isNotDefined(review)) {
    redirect(
      route('/projects/:projectId/services/:projectServiceId')
        .params({ projectId: projectService.projectId, projectServiceId })
        .toRelativeUrl()
    )
  }

  return <ProjectServiceReviewPage initialReview={review} />
}
