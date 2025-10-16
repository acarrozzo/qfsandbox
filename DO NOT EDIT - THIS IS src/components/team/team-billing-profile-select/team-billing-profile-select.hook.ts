'use client'

import type { BillingProfileId, TeamId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export type UseTeamBillingProfileSelectProps = {
  teamId: TeamId
  onChange?: (value: BillingProfileId) => { skipDefault?: boolean } | undefined
}

export const useTeamBillingProfileSelect = ({
  teamId,
  onChange,
}: UseTeamBillingProfileSelectProps) => {
  const { t } = useTranslation('billing')
  const utils = trpcReactClient.useUtils()

  const [team] = trpcReactClient.teams.getTeamWithProfile.useSuspenseQuery(
    { teamId },
    { refetchOnMount: false }
  )

  const updateTeam = trpcReactClient.teams.updateTeam.useMutation({
    onSuccess: () => {
      utils.teams.getTeamWithProfile.invalidate({ teamId })
    },
  })

  const [billingProfiles] =
    trpcReactClient.financeCoordinator.listBillingProfiles.useSuspenseQuery({
      organizationId: team.organizationId,
    })

  const value = team.billingProfileId

  const options = billingProfiles.map((profile) => ({
    value: profile.billingProfileId,
    label: profile.name,
  }))

  const handleChange: (value: BillingProfileId) => Promise<void> = async (
    value
  ) => {
    let skipDefault = false
    if (onChange) {
      const result = onChange(value)
      if (result?.skipDefault) {
        skipDefault = true
      }
    }
    if (!skipDefault) {
      await updateTeam.mutate({
        organizationId: team.organizationId,
        teamId: team.teamId,
        billingProfileId: value,
      })
    }
  }

  return {
    t,
    value,
    options,
    handleChange,
  }
}
