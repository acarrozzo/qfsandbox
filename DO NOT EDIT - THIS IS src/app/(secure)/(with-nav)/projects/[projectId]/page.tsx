import { projectTagCategories } from '@mntn-dev/app-common'
import { BrandBidStatuses, type ProjectId } from '@mntn-dev/domain-types'

import { ProjectPage } from '#projects/components/project-page.tsx'
import { ProjectInitialDataProvider } from '#projects/providers/project-initial-data-provider.tsx'
import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { ExpiredProjectPage } from './expired-project-page.tsx'
import { ProjectFormProvider } from './providers/project-form-provider.tsx'

export default async function Page({
  params: { projectId },
}: Readonly<{
  params: { projectId: ProjectId }
}>) {
  const { mode, project } =
    await trpcServerSideClient.projects.getProjectDetailsPayloadById({
      projectId,
    })

  if (mode === 'redacted') {
    return <ExpiredProjectPage project={project} />
  }

  const initialBids = project.acl.canViewProjectBidList
    ? await trpcServerSideClient.bids.listBids({
        projectId,
        status: BrandBidStatuses,
      })
    : { bids: [] }

  const initialProjectServices =
    await trpcServerSideClient.projects.getProjectServicesByProjectId(projectId)

  const initialPreProductionReviews =
    await trpcServerSideClient.reviews.preProduction.selectReviewsForProject({
      projectId,
    })

  await trpcServerSideClient.tags.discover.prefetch({
    category: projectTagCategories,
  })

  return (
    <HydrateClient>
      <ProjectInitialDataProvider
        initialProject={project}
        initialServices={initialProjectServices}
        initialBids={initialBids.bids}
        initialPreProductionReviews={initialPreProductionReviews}
      >
        <ProjectFormProvider>
          <ProjectPage />
        </ProjectFormProvider>
      </ProjectInitialDataProvider>
    </HydrateClient>
  )
}
