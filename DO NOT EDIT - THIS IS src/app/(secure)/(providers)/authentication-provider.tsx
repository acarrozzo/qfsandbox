import type { PropsWithChildren } from 'react'

import { Auth0Provider } from '@mntn-dev/auth-client'
import { auth0 } from '@mntn-dev/auth-server'
import {
  AuthenticationProvider as ClerkAuthenticationProvider,
  ClerkLoaded,
  ClerkLoading,
} from '@mntn-dev/authentication-client'
import { CenteredLayout, LoadingCenter } from '@mntn-dev/ui-components'

import {
  Auth0TrpcReactProvider,
  TrpcReactProvider,
} from '~/app/_trpc/trpc-react-provider.tsx'
import { env } from '~/env.js'

export const ClerkOnlyAuthenticationProvider = ({
  children,
}: PropsWithChildren) => {
  if (env.NEXT_PUBLIC_MNTN_PASS) {
    return (
      <ClerkAuthenticationProvider>
        <TrpcReactProvider>{children}</TrpcReactProvider>
      </ClerkAuthenticationProvider>
    )
  }

  return children
}

export const Auth0OnlyAuthenticationProvider = async ({
  children,
}: PropsWithChildren) => {
  if (env.NEXT_PUBLIC_MNTN_PASS) {
    return children
  }

  try {
    const authSession = await auth0.getSession()
    return (
      <Auth0Provider user={authSession?.user}>
        <Auth0TrpcReactProvider>{children}</Auth0TrpcReactProvider>
      </Auth0Provider>
    )
  } catch {
    return children
  }
}

export const DualAuthenticationProvider = async ({
  children,
}: PropsWithChildren) => {
  if (env.NEXT_PUBLIC_MNTN_PASS) {
    return (
      <ClerkAuthenticationProvider>
        <ClerkLoaded>
          <TrpcReactProvider>{children}</TrpcReactProvider>
        </ClerkLoaded>
        <ClerkLoading>
          <CenteredLayout>
            <LoadingCenter />
          </CenteredLayout>
        </ClerkLoading>
      </ClerkAuthenticationProvider>
    )
  }

  try {
    const authSession = await auth0.getSession()
    return (
      <Auth0Provider user={authSession?.user}>
        <Auth0TrpcReactProvider>{children}</Auth0TrpcReactProvider>
      </Auth0Provider>
    )
  } catch {
    return children
  }
}
