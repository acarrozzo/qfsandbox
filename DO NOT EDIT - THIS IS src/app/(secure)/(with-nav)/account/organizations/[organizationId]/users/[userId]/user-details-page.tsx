'use client'

import { useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { OrganizationId, UserId } from '@mntn-dev/domain-types'
import { NarrowTFunction, useTranslation } from '@mntn-dev/i18n'
import {
  LoadingOverlay,
  SidebarLayoutContent,
  Stack,
  useToast,
} from '@mntn-dev/ui-components'
import type { UpdateUserInput } from '@mntn-dev/user-service/client'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client'
import { useBreadcrumbs } from '~/components/breadcrumbs/index.ts'

import { UserEditForm } from '../components/user-edit-form.tsx'
import { useRefreshUsers } from '../hooks/use-refresh-users.ts'

type UserDetailsPageProps = { organizationId: OrganizationId; userId: UserId }

export const UserDetailsPage = ({
  organizationId,
  userId,
}: UserDetailsPageProps) => {
  const router = useRouter()
  const { t } = useTranslation(['user-details', 'toast', 'certification'])
  const { showToast } = useToast()
  const refreshUser = useRefreshUsers()

  const { data: user } = trpcReactClient.users.getUser.useQuery({
    userId,
  })

  const { data: organization } =
    trpcReactClient.organizations.getOrganization.useQuery({
      organizationId,
    })

  const [teams] = trpcReactClient.teams.listCompactTeams.useSuspenseQuery({
    organizationId,
  })

  const { mutateAsync: updateUser, isPending: isUserUpdating } =
    trpcReactClient.users.updateUser.useMutation()

  const { setBreadcrumbTokens } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbTokens({
      '/account/organizations/:organizationId/users/:userId': user?.displayName,
      '/account/organizations/:organizationId': organization?.name,
    })
    return () => setBreadcrumbTokens({})
  }, [user, organization, setBreadcrumbTokens])

  const handleUserUpdate = async (input: UpdateUserInput) => {
    await updateUser(input)
    await refreshUser(input)

    showToast.info({
      title: t('toast:user.updated.title'),
      body: t('toast:user.updated.body'),
      dataTestId: 'user-updated-info-toast',
      dataTrackingId: 'user-updated-info-toast',
    })

    router.push(
      route('/account/organizations/:organizationId/users').params({
        organizationId,
      })
    )
  }

  const handleAvatarChanged = () => {
    refreshUser({ organizationId, userId })
  }

  return user ? (
    <SidebarLayoutContent>
      <Stack gap="8" width="full">
        <Stack direction="col" gap="16" grow>
          <UserEditForm
            user={user}
            isUpdating={isUserUpdating}
            onUpdate={handleUserUpdate}
            onAvatarChanged={handleAvatarChanged}
            tEdit={NarrowTFunction<['user-details']>(t)}
            teams={teams}
          />
        </Stack>
      </Stack>
    </SidebarLayoutContent>
  ) : (
    <LoadingOverlay />
  )
}
