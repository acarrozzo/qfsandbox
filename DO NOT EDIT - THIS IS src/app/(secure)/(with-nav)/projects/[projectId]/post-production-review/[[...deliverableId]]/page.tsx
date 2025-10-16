import {
  type DeliverableId,
  type ProjectId,
  servicesWithDeliverables,
} from '@mntn-dev/domain-types'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { ErrorLayout } from '#components/error/error-layout.tsx'
import { Review } from '#projects/[projectId]/post-production-review/review.tsx'
import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

export default async function Page({
  params: { projectId, deliverableId },
}: {
  params: { projectId: ProjectId; deliverableId?: DeliverableId }
}) {
  const { project: initialProject } =
    await trpcServerSideClient.projects.get(projectId)

  const initialProjectServices =
    await trpcServerSideClient.projects.getProjectServicesByProjectId(projectId)

  const initialServicesWithDeliverables = servicesWithDeliverables(
    initialProjectServices
  )

  if (!isNonEmptyArray(initialServicesWithDeliverables)) {
    return <ErrorLayout code={404} />
  }

  const reviewV2Query =
    await trpcServerSideClient.reviews.postProduction.selectReview({
      projectId,
    })

  if (reviewV2Query.review) {
    return (
      <Review
        initialProject={initialProject}
        initialReview={reviewV2Query.review}
        initialServicesWithDeliverables={initialServicesWithDeliverables}
        selectedDeliverableId={deliverableId}
      />
    )
  }

  return <ErrorLayout code={404} />
}
