export const dynamic = 'force-dynamic'

import type { PropsWithChildren } from 'react'

import { Session, SignedIn, SignedOut } from '@mntn-dev/authentication-client'
import { env } from '@mntn-dev/env'
import { s } from '@mntn-dev/session'

import { RealtimeUpdatesHandler } from '~/app/(secure)/realtime-updates-handler.tsx'
import { CenteredLoadingSpinner } from '~/components/shared/centered-loading-spinner.tsx'

import {
  HydrateClient,
  trpcServerSideClient,
} from '../_trpc/trpc-server-side-client.ts'
import { AccountBoundary } from './(providers)/account-boundary.tsx'
import { DualAuthenticationProvider } from './(providers)/authentication-provider.tsx'
import IntercomWidget from './intercom-widget.tsx'

const SecureLayout = async ({ children }: PropsWithChildren) => {
  const session = await s.getAuthorizedSessionOrLogout()

  await Promise.all([
    trpcServerSideClient.users.getMe.prefetch(),
    trpcServerSideClient.session.principal.prefetch(),
    trpcServerSideClient.session.authenticatedSession.prefetch(),
    trpcServerSideClient.session.authorizedSession.prefetch(),
    trpcServerSideClient.organizations.getOrganization.prefetch({
      organizationId: session.authz.organizationId,
    }),
  ])

  return (
    <DualAuthenticationProvider>
      {env.NEXT_PUBLIC_MNTN_PASS ? (
        <>
          <SignedIn>
            <Session sessionId={session.authn.sessionId} />
            <HydrateClient>
              <RealtimeUpdatesHandler sessionId={session.authn.sessionId}>
                <AccountBoundary>{children}</AccountBoundary>
              </RealtimeUpdatesHandler>
              <IntercomWidget />
            </HydrateClient>
          </SignedIn>
          <SignedOut>
            <CenteredLoadingSpinner />
          </SignedOut>
        </>
      ) : (
        <HydrateClient>
          <RealtimeUpdatesHandler sessionId={session.authn.sessionId}>
            <AccountBoundary>{children}</AccountBoundary>
          </RealtimeUpdatesHandler>
          <IntercomWidget />
        </HydrateClient>
      )}
    </DualAuthenticationProvider>
  )
}

export default SecureLayout
