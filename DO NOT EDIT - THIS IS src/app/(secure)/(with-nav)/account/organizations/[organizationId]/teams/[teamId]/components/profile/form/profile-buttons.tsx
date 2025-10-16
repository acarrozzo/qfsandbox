import type { MouseEvent } from 'react'

import { useTranslation } from '@mntn-dev/i18n'
import { Button, getChildTestIds } from '@mntn-dev/ui-components'

import { useMyOrganization } from '~/hooks/secure/use-my-organization.ts'

import { useTeamProfileEditorContext } from '../../../hooks/use-team-profile-editor.ts'

type ProfileButtonsProps = {
  canUpdateOrganization: boolean
  onCreateTeamClicked: () => void
}

export const ProfileButtons = ({
  canUpdateOrganization,
  onCreateTeamClicked,
}: ProfileButtonsProps) => {
  const {
    avatarLoading,
    dataTestId,
    dataTrackingId,
    editing,
    team,
    onToggleEditing,
    savingAgency,
  } = useTeamProfileEditorContext()
  const { organizationType } = useMyOrganization()

  const { t } = useTranslation(['team-profile', 'generic'])

  const handleEditTeamClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onToggleEditing()
  }

  return editing ? (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={handleEditTeamClick}
        disabled={savingAgency || avatarLoading}
        {...getChildTestIds(
          { dataTestId, dataTrackingId },
          'cancel-edit-profile'
        )}
      >
        {t('generic:cancel')}
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="sm"
        disabled={avatarLoading}
        loading={savingAgency}
        {...getChildTestIds({ dataTestId, dataTrackingId }, 'save-profile')}
      >
        {t(`team-profile:action.save-team.${organizationType}`)}
      </Button>
    </>
  ) : (
    <>
      {team.acl.canUpdateTeamProfile && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          iconLeft="pencil"
          iconFill="solid"
          onClick={handleEditTeamClick}
          {...getChildTestIds({ dataTestId, dataTrackingId }, 'edit-profile')}
        >
          {t(`team-profile:action.edit-team.${organizationType}`)}
        </Button>
      )}
      {organizationType !== 'agency' && canUpdateOrganization && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          iconLeft="add"
          onClick={onCreateTeamClicked}
          {...getChildTestIds({ dataTestId, dataTrackingId }, 'create-team')}
        >
          {t(`team-profile:action.create-team.${organizationType}`)}
        </Button>
      )}
    </>
  )
}
