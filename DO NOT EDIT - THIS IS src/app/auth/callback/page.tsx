import { redirect } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { s } from '@mntn-dev/session'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'

export default async function Page({
  searchParams: { redirect_url },
}: {
  searchParams: { redirect_url?: string }
}) {
  const {
    profile: { userId },
  } = await s.getAuthorizedSessionOrLogout()

  await trpcServerSideClient.users.patchUser({ userId, lastLogin: new Date() })

  const redirectTo = redirect_url || route('/dashboard').toRelativeUrl()

  redirect(redirectTo)
}
