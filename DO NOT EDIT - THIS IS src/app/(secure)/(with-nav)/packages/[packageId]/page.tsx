import { type PackageId, PublicTagCategories } from '@mntn-dev/domain-types'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'
import { getPackageFileQueryInputs } from '~/lib/packages/package-query-helpers.ts'

import { PackageDetails } from './components/package-details.tsx'

export default async function Page({
  params: { packageId },
}: Readonly<{
  params: { packageId: PackageId }
}>) {
  await Promise.all([
    trpcServerSideClient.files.list.prefetch(
      getPackageFileQueryInputs(packageId)
    ),
    trpcServerSideClient.packages.getPackageDetails.prefetch({
      packageId,
    }),
    trpcServerSideClient.tags.discover.prefetch({
      category: PublicTagCategories,
    }),
  ])

  return <PackageDetails packageId={packageId} />
}
