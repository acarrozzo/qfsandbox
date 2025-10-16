'use client'

import type { OrganizationId, TeamId } from '@mntn-dev/domain-types'

import { useMyOrganization } from '~/hooks/secure/use-my-organization.ts'

import { useTeamProfileEditorContext } from '../../hooks/use-team-profile-editor.ts'
import { ContactInfo } from './form/contact-info/contact-info.tsx'
import { TeamName } from './form/contact-info/team-name.tsx'
import { TeamOverview } from './form/contact-info/team-overview.tsx'
import { EditTeamAvatar } from './form/edit-team-avatar.tsx'
import { ProfileButtons } from './form/profile-buttons.tsx'
import { TeamProfileControls } from './form/team-profile-controls.tsx'

type TeamProfileFormProps = {
  organizationId: OrganizationId
  teamId: TeamId
  canUpdateOrganization?: boolean
  onTeamChange: (teamId: TeamId) => void
  onCreateTeamClicked: () => void
}

const TeamProfileForm = ({
  organizationId,
  teamId,
  canUpdateOrganization = false,
  onTeamChange,
  onCreateTeamClicked,
}: TeamProfileFormProps) => {
  const {
    editing,
    form: { handleSubmit },
    saveForm,
    team,
  } = useTeamProfileEditorContext()
  const { multiTeam } = useMyOrganization()

  return (
    <div className="relative w-full p-10">
      <form
        id="team-profile-form"
        onSubmit={handleSubmit(saveForm)}
        className="flex flex-col w-full gap-6 items-center"
      >
        <div className="absolute top-6 left-6 flex gap-2 items-center">
          <TeamProfileControls
            multiTeam={multiTeam}
            editing={editing}
            onTeamChange={onTeamChange}
            teamId={teamId}
            organizationId={organizationId}
            team={team}
          />
        </div>
        <div className="absolute top-6 right-6 flex gap-2 items-center">
          <ProfileButtons
            canUpdateOrganization={canUpdateOrganization}
            onCreateTeamClicked={onCreateTeamClicked}
          />
        </div>
        <div className="flex flex-col gap-2 items-center">
          <EditTeamAvatar />
          <TeamName />
        </div>
        {!editing && <div className="w-44 border-b border-brand" />}

        <TeamOverview />

        <div className="flex w-full justify-center max-w-4xl">
          <ContactInfo />
        </div>
      </form>
    </div>
  )
}

export { TeamProfileForm }
