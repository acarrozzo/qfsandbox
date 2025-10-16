'use client'

import { forwardRef } from 'react'

import type {
  TeamId,
  UserDomainSelectModel,
  UserId,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Select, type SelectProps } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

type UserSelectProps = Omit<
  SelectProps<UserId>,
  'placeholder' | 'deselectable' | 'options'
> & { users: UserDomainSelectModel[] }

export const UserSelect = forwardRef<HTMLDivElement, UserSelectProps>(
  ({ users, ...selectProps }, ref) => {
    const { t } = useTranslation('users')

    return (
      <Select
        {...selectProps}
        ref={ref}
        placeholder={t('select.placeholder')}
        deselectable={false}
        options={users.map((user) => ({
          value: user.userId,
          label: user.displayName,
        }))}
      />
    )
  }
)

type TeamUserSelectProps = Omit<UserSelectProps, 'users'> & {
  teamId: TeamId
}

export const TeamUserSelect = forwardRef<HTMLDivElement, TeamUserSelectProps>(
  ({ teamId, ...selectProps }, ref) => {
    const [team] = trpcReactClient.teams.getTeamWithUsers.useSuspenseQuery({
      teamId,
    })

    return (
      <UserSelect
        key={teamId}
        {...selectProps}
        users={team.users ?? []}
        ref={ref}
      />
    )
  }
)
