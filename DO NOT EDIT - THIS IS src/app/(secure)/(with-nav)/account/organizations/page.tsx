import { notFound } from '@mntn-dev/app-navigation'
import { logger } from '@mntn-dev/logger'
import { canAdministerOrganization } from '@mntn-dev/policy'
import { s } from '@mntn-dev/session'

import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'

import { OrganizationListPage } from './organization-list-page.tsx'

export default async function Page() {
  const session = await s.getAuthorizedSessionOrLogout()

  if (!canAdministerOrganization(session)) {
    logger.error('Not allowed to view organizations')
    notFound()
  }

  await trpcServerSideClient.organizations.listOrganizations.prefetch({})

  return (
    <HydrateClient>
      <OrganizationListPage />
    </HydrateClient>
  )
}
