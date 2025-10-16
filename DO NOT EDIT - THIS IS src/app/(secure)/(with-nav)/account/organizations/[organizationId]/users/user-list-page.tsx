'use client'

import { useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { OrganizationId, UserId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Heading,
  LoadingOverlay,
  PageHeader,
  SidebarLayoutContent,
  Stack,
  Text,
  useOpenState,
} from '@mntn-dev/ui-components'
import type { CreateUserInput } from '@mntn-dev/user-service/client'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useBreadcrumbs } from '~/components/breadcrumbs/index.ts'
import { EmptyState } from '~/components/empty/empty-state.tsx'
import { SingleColumn } from '~/components/layout/single-column/single-column.tsx'
import { useMe } from '~/hooks/secure/use-me.ts'

import { UserBlade } from './components/user-blade.tsx'
import { UserCreateModal } from './components/user-create-modal.tsx'
import { useRefreshUsers } from './hooks/use-refresh-users.ts'

type UserListPageProps = { organizationId: OrganizationId }

export const UserListPage = ({ organizationId }: UserListPageProps) => {
  const { me } = useMe()
  const router = useRouter()
  const { t } = useTranslation(['user-list', 'toast', 'organizations'])
  const refreshUsers = useRefreshUsers()

  const [users] = trpcReactClient.users.listUsers.useSuspenseQuery({
    organizationId,
  })

  const [organization] =
    trpcReactClient.organizations.getOrganization.useSuspenseQuery({
      organizationId,
    })

  const [teams] = trpcReactClient.teams.listCompactTeams.useSuspenseQuery({
    organizationId,
  })

  const { mutateAsync: patchUser } =
    trpcReactClient.users.patchUser.useMutation()

  const { mutateAsync: createUser, isPending: isUserCreating } =
    trpcReactClient.users.createUser.useMutation()

  const { setBreadcrumbTokens } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbTokens({
      '/account/organizations/:organizationId': organization?.name,
    })
    return () => setBreadcrumbTokens({})
  }, [organization, setBreadcrumbTokens])

  const handleUserClicked = (userId: UserId) => () => {
    router.push(
      me.userId === userId
        ? route('/account/profile')
        : route('/account/organizations/:organizationId/users/:userId').params({
            organizationId,
            userId,
          })
    )
  }

  const handleUserActiveToggleChanged =
    (userId: UserId) => async (value: boolean) => {
      await patchUser({ userId, isActive: value })
      await refreshUsers({ userId, organizationId })
    }

  const handleUserCreate = async (input: CreateUserInput) => {
    const { userId, organizationId } = await createUser(input)
    await refreshUsers({ userId, organizationId })

    router.push(
      route('/account/organizations/:organizationId/users/:userId').params({
        organizationId,
        userId,
      })
    )
  }

  const userCreateOpenState = useOpenState()

  return (
    <SidebarLayoutContent>
      <PageHeader
        dataTestId="user-list-page-header"
        dataTrackingId="user-list-page-header"
      >
        <PageHeader.Main>
          <PageHeader.Title title={t('user-list:title')} />
        </PageHeader.Main>
        <PageHeader.Controls>
          {organization?.acl.canUpdateOrganization && (
            <Button
              onClick={userCreateOpenState.onToggle}
              iconRight="add"
              variant="secondary"
            >
              {t('user-list:actions.create')}
            </Button>
          )}
        </PageHeader.Controls>
      </PageHeader>
      {organization ? (
        <>
          <SingleColumn>
            <Stack gap="2" width="full" direction="col">
              {users.length > 0 ? (
                users.map((user) => (
                  <UserBlade
                    key={user.userId}
                    user={user}
                    onClick={
                      user.isActive ? handleUserClicked(user.userId) : undefined
                    }
                    onToggleChanged={
                      user.acl.canToggleUserActiveStatus
                        ? handleUserActiveToggleChanged(user.userId)
                        : undefined
                    }
                    self={me.userId === user.userId}
                  />
                ))
              ) : (
                <EmptyState border id="user-list">
                  <EmptyState.CallToAction
                    heading={
                      <>
                        <Text
                          textColor="brand"
                          fontWeight="semibold"
                          fontSize="lg"
                        >
                          {t('empty.info')}
                        </Text>
                        <Heading fontWeight="bold" fontSize="3xl">
                          {t('empty.cta')}
                        </Heading>
                      </>
                    }
                    button={
                      organization?.acl.canUpdateOrganization ? (
                        <Button
                          variant="primary"
                          onClick={userCreateOpenState.onToggle}
                          width="fit"
                          iconRight="add"
                        >
                          {t('user-list:actions.create')}
                        </Button>
                      ) : (
                        <div />
                      )
                    }
                  />
                </EmptyState>
              )}
            </Stack>
          </SingleColumn>
          {userCreateOpenState.open && (
            <UserCreateModal
              {...userCreateOpenState}
              organization={organization}
              onCreate={handleUserCreate}
              isCreating={isUserCreating}
              teams={teams}
            />
          )}
        </>
      ) : (
        <LoadingOverlay />
      )}
    </SidebarLayoutContent>
  )
}
