import { forwardRef } from 'react'

import type { UserDomainQueryModel } from '@mntn-dev/domain-types'
import { Blade, Stack, Text, Toggle } from '@mntn-dev/ui-components'

import { UserAvatar } from '~/components/avatar/user-avatar.tsx'

import {
  AccountBlade,
  type AccountBladePublicProps,
} from '../../../../components/blade/account-blade.tsx'

type UserBladeProps = AccountBladePublicProps & {
  user: UserDomainQueryModel
  self: boolean
  onToggleChanged?: (value: boolean) => void
}

export const UserBlade = forwardRef<HTMLDivElement, UserBladeProps>(
  ({ user, self, onToggleChanged, ...props }, ref) => {
    const { onClick, disabled } = props

    return (
      <AccountBlade
        {...props}
        id={`user-${user.userId}`}
        muted={!user.isActive}
        ref={ref}
      >
        <Blade.Column
          justifyContent="start"
          alignItems="center"
          direction="row"
        >
          <UserAvatar user={user} size="lg" />
        </Blade.Column>

        <Blade.Column
          justifyContent="start"
          alignItems="center"
          direction="row"
          gap="4"
          grow
          shrink
        >
          <Stack direction="col" gap="2">
            <Blade.Title>{user.displayName}</Blade.Title>
            <Text textColor="secondary">{user.emailAddress}</Text>
          </Stack>
        </Blade.Column>

        <AccountBlade.TeamsColumn teams={user.teams} />

        {onToggleChanged && (
          <Blade.Column
            justifyContent="center"
            alignItems="center"
            direction="row"
            gap="4"
            width="auto"
          >
            <Toggle
              checked={user.isActive}
              disabled={disabled || self}
              onChange={onToggleChanged}
            />
          </Blade.Column>
        )}

        <AccountBlade.ChevronButtonColumn onClick={onClick} />
      </AccountBlade>
    )
  }
)

UserBlade.displayName = 'UserBlade'
