import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

import { PackageList } from './package-list.tsx'

export default async function Page() {
  const principal = await trpcServerSideClient.session.principal()

  const financeEntityId =
    principal.authz.organizationType === 'internal'
      ? undefined
      : await trpcServerSideClient.organizations.getOrganizationFinanceEntityId(
          { organizationId: principal.authz.organizationId }
        )

  const packages =
    await trpcServerSideClient.packages.getCreditFilteredPackages({
      financeEntityId,
    })

  return (
    <PackageList
      initialData={packages}
      initialFinanceEntityId={financeEntityId}
    />
  )
}
