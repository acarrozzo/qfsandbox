import { DualAuthenticationProvider } from '~/app/(secure)/(providers)/authentication-provider.tsx'

import {
  HydrateClient,
  trpcServerSideClient,
} from '../../_trpc/trpc-server-side-client.ts'
import { SignUpPage } from './sign-up-page.tsx'

export default async function Page() {
  await Promise.all([
    trpcServerSideClient.public.getAgreements.prefetch({
      type: ['client-terms', 'maker-terms'],
    }),
    trpcServerSideClient.session.unauthenticatedSession.prefetch(),
  ])

  return (
    <DualAuthenticationProvider>
      <HydrateClient>
        <SignUpPage />
      </HydrateClient>
    </DualAuthenticationProvider>
  )
}
