import type { ProjectId } from '@mntn-dev/domain-types'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

import { ChangeOrderDetails } from './components/change-order-details.tsx'

export default async function Page({
  params: { projectId },
}: {
  params: { projectId: ProjectId }
}) {
  await Promise.all([
    trpcServerSideClient.projects.get.prefetch(projectId),
    trpcServerSideClient.packages.getPackageDetails.prefetch({
      packageKey: 'change_order_package',
    }),
  ])

  return <ChangeOrderDetails projectId={projectId} />
}
