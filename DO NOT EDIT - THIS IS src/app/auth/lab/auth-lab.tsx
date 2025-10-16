'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { type AnyRoute, logoutRoute, route } from '@mntn-dev/app-routing'
import { useAuth } from '@mntn-dev/authentication-client'
import { Button, CenteredLayout, Stack } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useMe } from '~/hooks/secure/use-me.ts'

export const AuthLab = () => {
  const {
    me: { userId },
  } = useMe()

  const router = useRouter()
  const { getToken } = useAuth()

  const { mutateAsync: simulateForbidden } =
    trpcReactClient.error.simulate.forbidden.useMutation()

  const { mutateAsync: simulateUnauthorized } =
    trpcReactClient.error.simulate.unauthorized.useMutation()

  const { mutateAsync: simulateUserDisabled } =
    trpcReactClient.error.simulate.userDisabled.useMutation()

  const { mutateAsync: patchUser } =
    trpcReactClient.users.patchUser.useMutation()

  const { refetch: getMe } = trpcReactClient.users.getMe.useQuery(undefined, {
    enabled: false,
  })

  const handleTRPCButtonClick = (status?: number) => async () => {
    if (status === 403) {
      await simulateForbidden()
    } else if (status === 401) {
      await simulateUnauthorized()
    } else if (status === 412) {
      await simulateUserDisabled()
    } else {
      await getMe()
    }
  }

  const handleClearCookiesClick = async () => {
    await fetch(route('/api/auth/clear').toRelativeUrl())
  }

  const handleNavigateClick = (route: AnyRoute) => () => {
    router.push(route)
  }

  const handleGetPrincipalClick = (withAuthorization: boolean) => async () => {
    await fetch(route('/api/auth/principal').toRelativeUrl(), {
      headers: {
        Authorization: withAuthorization ? `Bearer ${await getToken()}` : '',
      },
    })
  }

  const handleUpdateMeClick = async () => {
    await patchUser({ userId, lastLogin: new Date() })
  }

  return (
    <CenteredLayout>
      <Stack direction="col" gap="8">
        <Stack direction="row" gap="4">
          <Button onClick={handleTRPCButtonClick(401)}>
            Simulate tRPC 401
          </Button>
          <Button onClick={handleTRPCButtonClick(403)}>
            Simulate tRPC 403
          </Button>
          <Button onClick={handleTRPCButtonClick(412)}>
            Simulate tRPC 412
          </Button>
        </Stack>
        <Stack direction="row" gap="4">
          <Button onClick={handleGetPrincipalClick(true)}>
            Get Principal With Authorization
          </Button>
          <Button onClick={handleGetPrincipalClick(false)}>
            Get Principal Without Authorization
          </Button>
          <Button onClick={handleUpdateMeClick}>Update Me</Button>
        </Stack>
        <Stack direction="row" gap="4">
          <Button onClick={handleClearCookiesClick}>Clear Cookies</Button>
          <Button onClick={handleTRPCButtonClick(200)}>Call tRPC GetMe</Button>
        </Stack>
        <Stack direction="row" gap="4">
          <Button onClick={handleNavigateClick(route('/dashboard'))}>
            Dashboard
          </Button>
          <Button
            onClick={handleNavigateClick(
              route('/auth/callback').query({
                redirect_url: route('/auth/lab').toRelativeUrl(),
              })
            )}
          >
            /auth/callback
          </Button>
          <Button
            onClick={handleNavigateClick(
              logoutRoute(route('/auth/lab').toAbsoluteUrl())
            )}
          >
            /api/auth/logout
          </Button>
        </Stack>
      </Stack>
    </CenteredLayout>
  )
}
