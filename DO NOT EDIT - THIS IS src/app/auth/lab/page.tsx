import {
  HydrateClient,
  trpcServerSideClient,
} from '~/app/_trpc/trpc-server-side-client.ts'
import { DualAuthenticationProvider } from '~/app/(secure)/(providers)/authentication-provider.tsx'

import { AuthLab } from './auth-lab.tsx'

export default async function Page() {
  await trpcServerSideClient.users.getMe.prefetch()

  return (
    <DualAuthenticationProvider>
      <HydrateClient>
        <AuthLab />
      </HydrateClient>
    </DualAuthenticationProvider>
  )
}
