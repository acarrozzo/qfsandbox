'use client'

import { useEffect } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { hasOrganizationType, type TeamId } from '@mntn-dev/domain-types'
import type { CreateTeamInput } from '@mntn-dev/team-service/client'
import {
  LoadingModal,
  SidebarLayoutContent,
  useOpenState,
} from '@mntn-dev/ui-components'
import { themeDivideColorMap } from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useBreadcrumbs } from '~/components/breadcrumbs/breadcrumb-provider.tsx'

import { TeamCreateModal } from '../components/team-create-modal.tsx'
import { useRefreshTeams } from '../hooks/use-refresh-teams.ts'
import { TeamProfileForm } from './components/profile/team-profile-form.tsx'
import { TeamProfileVideos } from './components/profile/team-profile-videos.tsx'
import {
  TeamProfileEditorProvider,
  useTeamProfileEditor,
} from './hooks/use-team-profile-editor.ts'
import type { TeamDetailsPageProps } from './types.ts'

const TeamDetailsPage = ({ organizationId, teamId }: TeamDetailsPageProps) => {
  const context = useTeamProfileEditor({ organizationId, teamId })
  const router = useRouter()
  const refreshTeams = useRefreshTeams()

  const { data: organization } =
    trpcReactClient.organizations.getOrganization.useQuery({
      organizationId,
    })

  const handleTeamChanged = (teamId: TeamId) => {
    router.push(
      route('/account/organizations/:organizationId/teams/:teamId').params({
        organizationId,
        teamId,
      })
    )
  }

  const { open, onOpen, onClose } = useOpenState()

  const { mutateAsync: createTeam, isPending: isTeamCreating } =
    trpcReactClient.teams.createTeam.useMutation()

  const handleCreateTeamClicked = () => {
    onOpen()
  }

  const handleTeamCreate = async (input: CreateTeamInput) => {
    const { teamId } = await createTeam(input)
    await refreshTeams({ teamId, organizationId })

    router.push(
      route('/account/organizations/:organizationId/teams/:teamId').params({
        organizationId,
        teamId,
      })
    )
  }

  const { setBreadcrumbTokens } = useBreadcrumbs()

  useEffect(() => {
    setBreadcrumbTokens({
      '/account/organizations/:organizationId': organization?.name,
      '/account/organizations/:organizationId/teams/:teamId': context.team.name,
    })
    return () => setBreadcrumbTokens({})
  }, [setBreadcrumbTokens, context.team, organization])

  return (
    <TeamProfileEditorProvider value={context}>
      <SidebarLayoutContent>
        <div
          className={cn(
            'flex flex-col items-center divide-y',
            themeDivideColorMap.muted
          )}
        >
          <TeamProfileForm
            organizationId={organizationId}
            teamId={teamId}
            canUpdateOrganization={organization?.acl.canUpdateOrganization}
            onTeamChange={handleTeamChanged}
            onCreateTeamClicked={handleCreateTeamClicked}
          />
          {hasOrganizationType(context.team, 'agency') && <TeamProfileVideos />}
        </div>
        <LoadingModal open={context.isLoading} />
      </SidebarLayoutContent>
      {organization && (
        <TeamCreateModal
          open={open}
          onClose={onClose}
          organization={organization}
          onCreate={handleTeamCreate}
          isCreating={isTeamCreating}
        />
      )}
    </TeamProfileEditorProvider>
  )
}

export { TeamDetailsPage }
