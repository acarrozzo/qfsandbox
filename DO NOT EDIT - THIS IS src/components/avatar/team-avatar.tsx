'use client'

import { useMemo } from 'react'

import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import type { TeamDomainSelectModel } from '@mntn-dev/domain-types'
import type {
  AvatarEntityProps,
  AvatarProps,
  TestIds,
} from '@mntn-dev/ui-components'
import { Avatar, getTestProps } from '@mntn-dev/ui-components'

import { organizationTypeBorderColorMap, teamToAvatarEntity } from './helper.ts'

type TeamAvatarProps = AvatarProps &
  Pick<AvatarEntityProps, 'loading'> &
  TestIds & {
    showOrganizationTypeIndicator?: boolean
    team: TeamDomainSelectModel
  }

const TeamAvatar = ({
  borderColor,
  dataTestId,
  dataTrackingId,
  loading,
  showOrganizationTypeIndicator,
  team,
  ...props
}: TeamAvatarProps) => {
  const entity = useMemo(() => teamToAvatarEntity(team), [team])

  return (
    <Avatar
      borderColor={
        showOrganizationTypeIndicator
          ? organizationTypeBorderColorMap[team.organizationType]
          : borderColor
      }
      {...getTestProps({ dataTestId, dataTrackingId })}
      {...props}
    >
      <Avatar.Entity
        entity={entity}
        image={NextImage({ unoptimized: true })}
        loading={loading}
      />
    </Avatar>
  )
}

export { TeamAvatar }
