'use client'

import { forwardRef } from 'react'

import type {
  OrganizationId,
  TeamDomainSelectModel,
  TeamId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Select, type SelectProps } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useMe } from '~/hooks/secure/use-me.ts'

type TeamSelectProps = Omit<
  SelectProps<TeamId>,
  'placeholder' | 'deselectable' | 'options'
> & { teams: TeamDomainSelectModel[] }

export const TeamSelect = forwardRef<HTMLDivElement, TeamSelectProps>(
  ({ teams, ...props }, ref) => {
    const {
      me: { organizationType },
    } = useMe()
    const { t } = useTranslation('teams')

    return (
      <Select
        {...props}
        searchable={false}
        deselectable={false}
        ref={ref}
        placeholder={t(`select.placeholder.${organizationType}`)}
        options={teams.map((team) => ({
          value: team.teamId,
          label: team.name,
        }))}
      />
    )
  }
)

type OrganizationTeamSelectProps = Omit<TeamSelectProps, 'teams'> & {
  organizationId: OrganizationId
}

export const OrganizationTeamSelect = forwardRef<
  HTMLDivElement,
  OrganizationTeamSelectProps
>(({ organizationId, ...props }, ref) => {
  const [teams] = trpcReactClient.teams.listCompactTeams.useSuspenseQuery({
    organizationId,
  })

  return <TeamSelect key={organizationId} {...props} teams={teams} ref={ref} />
})

type MyOrganizationTeamSelectProps = Omit<
  OrganizationTeamSelectProps,
  'organizationId'
>

export const MyOrganizationTeamSelect = forwardRef<
  HTMLDivElement,
  MyOrganizationTeamSelectProps
>((props, ref) => {
  const {
    me: { organizationId },
  } = useMe()

  return (
    <OrganizationTeamSelect
      key={organizationId}
      {...props}
      organizationId={organizationId}
      ref={ref}
    />
  )
})
