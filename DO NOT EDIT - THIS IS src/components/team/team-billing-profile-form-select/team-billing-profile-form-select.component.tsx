import type { BillingProfileId, TeamId } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import { FormField, Icon, Text } from '@mntn-dev/ui-components'

import { useTeamBillingProfileFormSelect } from '~/components/team/team-billing-profile-form-select/team-billing-profile-form-select.hook.ts'

import { TeamBillingProfileSelect } from '../team-billing-profile-select/team-billing-profile-select.component.tsx'

type TeamBillingProfileFormSelectProps = {
  teamId: TeamId
  isEditing?: boolean
  onChange?: (value: BillingProfileId) => { skipDefault?: boolean } | undefined
}

// This component wraps the TeamBillingProfileSelect component and adds an edit mode and an optional label
export const TeamBillingProfileFormSelect = ({
  teamId,
  onChange,
  isEditing,
}: TeamBillingProfileFormSelectProps) => {
  const { billingProfile } = useTeamBillingProfileFormSelect({ teamId })

  if (!billingProfile) {
    logger.warn(
      `Billing profile not found for team ${teamId} in TeamBillingProfileFormSelect`,
      { teamId }
    )
    return null
  }

  if (!isEditing) {
    return (
      <div className="flex flex-wrap justify-center items-center gap-2 [grid-area:billing-profile]">
        <Icon name="bank" size="lg" color="brand" />
        <Text>{billingProfile.name}</Text>
      </div>
    )
  }

  return (
    <div className="[grid-area:billing-profile]">
      <div className="w-100">
        <FormField>
          <FormField.Label>Billing Profile</FormField.Label>
          <FormField.Control>
            <TeamBillingProfileSelect teamId={teamId} onChange={onChange} />
          </FormField.Control>
        </FormField>
      </div>
    </div>
  )
}

// display name is used in react devtools
TeamBillingProfileFormSelect.displayName = 'TeamBillingProfileFormSelect'
