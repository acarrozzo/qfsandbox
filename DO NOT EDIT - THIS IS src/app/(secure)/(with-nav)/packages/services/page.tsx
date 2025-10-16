import { PublicTagCategories } from '@mntn-dev/domain-types'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'
import { TabsProvider } from '~/components/tabs/tabs-provider.tsx'

import type { ServiceStatusTabKey } from './components/types.ts'
import { ServiceList } from './service-list.tsx'

export default async function Page() {
  await Promise.all([
    trpcServerSideClient.packages.getAllServices.prefetch(),
    trpcServerSideClient.tags.discover.prefetch({
      category: PublicTagCategories,
    }),
  ])

  return (
    <TabsProvider<ServiceStatusTabKey> initialTab="all">
      <ServiceList />
    </TabsProvider>
  )
}
