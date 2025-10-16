'use client'

import { userToPerson } from '@mntn-dev/app-common'
import type { UserDisplayModel } from '@mntn-dev/domain-types'
import type {
  AvatarPersonProps,
  AvatarProps,
  TestIds,
} from '@mntn-dev/ui-components'
import { Avatar, getTestProps } from '@mntn-dev/ui-components'

import { AvatarInterceptor as AvatarUser } from './avatar-interceptor.tsx'
import { getAvatarUrl, organizationTypeBorderColorMap } from './helper.ts'

type UserAvatarProps = Pick<AvatarProps, 'size' | 'borderColor' | 'selected'> &
  Pick<AvatarPersonProps, 'loading'> &
  TestIds & {
    showOrganizationTypeIndicator?: boolean
    user: UserDisplayModel
  }

const UserAvatar = ({
  borderColor,
  dataTestId,
  dataTrackingId,
  loading,
  selected,
  showOrganizationTypeIndicator,
  size,
  user,
}: UserAvatarProps) => (
  <Avatar
    borderColor={
      showOrganizationTypeIndicator
        ? organizationTypeBorderColorMap[user.organizationType]
        : borderColor
    }
    selected={selected}
    size={size}
    {...getTestProps({ dataTestId, dataTrackingId })}
  >
    <AvatarUser person={userToPerson(user, getAvatarUrl)} loading={loading} />
  </Avatar>
)

export { UserAvatar }
