import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'
import { TabsProvider } from '~/components/tabs/index.ts'

import type { PackageStatusTabKey } from './components/types.ts'
import { PackageList } from './packages-list.tsx'

export default async function Page() {
  const packages = await trpcServerSideClient.packages.getAllPackages()

  return (
    <TabsProvider<PackageStatusTabKey> initialTab="all">
      <PackageList initialData={packages} />
    </TabsProvider>
  )
}
