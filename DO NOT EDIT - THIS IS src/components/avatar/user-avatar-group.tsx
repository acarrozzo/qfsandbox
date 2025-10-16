'use client'

import type { UserDomainSelectModel } from '@mntn-dev/domain-types'
import {
  getTestProps,
  Stack,
  type StackProps,
  type TestIds,
} from '@mntn-dev/ui-components'

import { UserAvatar } from './user-avatar.tsx'

type UserAvatarGroupProps = StackProps & {
  users: UserDomainSelectModel[]
} & TestIds

export const UserAvatarGroup = ({
  users,
  dataTestId,
  dataTrackingId,
  ...props
}: UserAvatarGroupProps) => {
  // TODO: 1. Make the avatars overlap, 2. Add a max count with overflow circle
  return (
    <Stack
      direction="row"
      {...getTestProps({ dataTestId, dataTrackingId })}
      {...props}
    >
      {users.map((user) => (
        <UserAvatar key={user.userId} user={user} />
      ))}
    </Stack>
  )
}
