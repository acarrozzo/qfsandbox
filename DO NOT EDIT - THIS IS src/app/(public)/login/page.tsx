import { env } from '@mntn-dev/env'

import { Auth0OnlyAuthenticationProvider } from '~/app/(secure)/(providers)/authentication-provider.tsx'

import { LoginPage } from './login-page.tsx'
import { LoginPageAuth0 } from './login-page-auth0.tsx'

export default function Page() {
  return env.NEXT_PUBLIC_MNTN_PASS ? (
    <LoginPage />
  ) : (
    <Auth0OnlyAuthenticationProvider>
      <LoginPageAuth0 />
    </Auth0OnlyAuthenticationProvider>
  )
}
