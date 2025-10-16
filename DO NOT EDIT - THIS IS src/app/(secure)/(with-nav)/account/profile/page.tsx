import { s } from '@mntn-dev/session'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

import { ProfileDetailsPage } from './profile-details-page.tsx'

export default async function Page() {
  const session = await s.getAuthorizedSessionOrLogout()

  await trpcServerSideClient.teams.listCompactTeams.prefetch({
    organizationId: session.authz.organizationId,
  })

  return <ProfileDetailsPage />
}
