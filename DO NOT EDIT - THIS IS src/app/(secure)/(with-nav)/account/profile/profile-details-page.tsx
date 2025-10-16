'use client'

import { NarrowTFunction, useTranslation } from '@mntn-dev/i18n'
import { SidebarLayoutContent, Stack, useToast } from '@mntn-dev/ui-components'
import type { UpdateUserInput } from '@mntn-dev/user-service'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useMe } from '~/hooks/secure/use-me.ts'

import { UserEditForm } from '../organizations/[organizationId]/users/components/user-edit-form.tsx'

export const ProfileDetailsPage = () => {
  const { me, refetchMe } = useMe()
  const { t } = useTranslation(['profile-details', 'toast'])
  const { showToast } = useToast()

  const [teams] = trpcReactClient.teams.listCompactTeams.useSuspenseQuery({
    organizationId: me.organizationId,
  })

  const { mutateAsync: updateUser, isPending: isUserUpdating } =
    trpcReactClient.users.updateUser.useMutation()

  const handleUserUpdate = async (input: UpdateUserInput) => {
    await updateUser(input)
    await refetchMe()

    showToast.info({
      title: t('toast:profile.updated.title'),
      body: t('toast:profile.updated.body'),
      dataTestId: 'profile-updated-info-toast',
      dataTrackingId: 'profile-updated-info-toast',
    })
  }

  const handleAvatarChanged = () => {
    refetchMe()
  }

  return (
    <SidebarLayoutContent>
      <Stack gap="8" width="full">
        <Stack direction="col" gap="16" grow>
          <UserEditForm
            user={me}
            isUpdating={isUserUpdating}
            onUpdate={handleUserUpdate}
            onAvatarChanged={handleAvatarChanged}
            tEdit={NarrowTFunction<['profile-details']>(t)}
            teams={teams}
          />
        </Stack>
      </Stack>
    </SidebarLayoutContent>
  )
}
