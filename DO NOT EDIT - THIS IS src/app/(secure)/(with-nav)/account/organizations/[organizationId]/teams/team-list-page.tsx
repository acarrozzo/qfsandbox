'use client'

import { useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { OrganizationId, TeamId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type { CreateTeamInput } from '@mntn-dev/team-service'
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

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useBreadcrumbs } from '~/components/breadcrumbs/index.ts'
import { EmptyState } from '~/components/empty/index.ts'
import { SingleColumn } from '~/components/layout/single-column/single-column.tsx'
import { useMe } from '~/hooks/secure/use-me.ts'

import { TeamBlade } from './components/team-blade.tsx'
import { TeamCreateModal } from './components/team-create-modal.tsx'
import { useRefreshTeams } from './hooks/use-refresh-teams.ts'

type TeamListPageProps = { organizationId: OrganizationId }

export const TeamListPage = ({ organizationId }: TeamListPageProps) => {
  const router = useRouter()
  const { t } = useTranslation(['team-list', 'toast', 'organizations'])
  const refreshTeams = useRefreshTeams()
  const {
    me: { organizationType },
  } = useMe()

  const [teams] = trpcReactClient.teams.listTeams.useSuspenseQuery({
    organizationId,
  })

  const { data: organization } =
    trpcReactClient.organizations.getOrganization.useQuery({
      organizationId,
    })

  const { mutateAsync: createTeam, isPending: isTeamCreating } =
    trpcReactClient.teams.createTeam.useMutation()

  const { setBreadcrumbTokens } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbTokens({
      '/account/organizations/:organizationId': organization?.name,
    })
    return () => setBreadcrumbTokens({})
  }, [organization, setBreadcrumbTokens])

  const handleTeamClicked = (teamId: TeamId) => () => {
    router.push(
      route('/account/organizations/:organizationId/teams/:teamId').params({
        organizationId,
        teamId,
      })
    )
  }

  const handleTeamCreate = async (input: CreateTeamInput) => {
    const { teamId, organizationId } = await createTeam(input)
    await refreshTeams({ teamId, organizationId })

    router.push(
      route('/account/organizations/:organizationId/teams/:teamId').params({
        organizationId,
        teamId,
      })
    )
  }

  const teamCreateOpenState = useOpenState()

  return (
    <SidebarLayoutContent>
      <PageHeader
        dataTestId="team-list-page-header"
        dataTrackingId="team-list-page-header"
      >
        <PageHeader.Main>
          <PageHeader.Title title={t(`team-list:title.${organizationType}`)} />
        </PageHeader.Main>
        <PageHeader.Controls>
          {organization?.acl.canUpdateOrganization && (
            <Button
              onClick={teamCreateOpenState.onToggle}
              variant="secondary"
              iconRight="add"
            >
              {t(`team-list:actions.create.${organizationType}`)}
            </Button>
          )}
        </PageHeader.Controls>
      </PageHeader>
      {organization ? (
        <>
          <SingleColumn>
            <Stack gap="2" width="full" direction="col">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <TeamBlade
                    key={team.teamId}
                    team={team}
                    userCount={
                      team.acl.canUpdateTeam ? team.users?.length : undefined
                    }
                    onClick={handleTeamClicked(team.teamId)}
                  />
                ))
              ) : (
                <EmptyState border id="team-list">
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
                          onClick={teamCreateOpenState.onToggle}
                          width="fit"
                          iconRight="add"
                        >
                          {t(`team-list:actions.create.${organizationType}`)}
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
          <TeamCreateModal
            {...teamCreateOpenState}
            organization={organization}
            onCreate={handleTeamCreate}
            isCreating={isTeamCreating}
          />
        </>
      ) : (
        <LoadingOverlay />
      )}
    </SidebarLayoutContent>
  )
}
