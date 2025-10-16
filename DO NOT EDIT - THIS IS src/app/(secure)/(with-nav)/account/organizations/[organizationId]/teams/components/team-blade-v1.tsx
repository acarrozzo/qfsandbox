import { forwardRef } from 'react'

import type { TeamDomainQueryModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Blade, Stack, Text } from '@mntn-dev/ui-components'

import { TeamAvatar } from '~/components/avatar/team-avatar.tsx'
import { OrganizationTypeTag } from '~/components/organization/organization-type-tag.tsx'
import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import {
  AccountBlade,
  type AccountBladePublicProps,
} from '../../../../components/blade/account-blade.tsx'

type TeamBladeProps = AccountBladePublicProps & {
  team: TeamDomainQueryModel
  userCount?: number
}

export const TeamBlade = forwardRef<HTMLDivElement, TeamBladeProps>(
  ({ team, userCount, ...props }, ref) => {
    const { onClick } = props
    const { t } = useTranslation(['teams'])
    const { hasPermission } = usePermissions()

    return (
      <AccountBlade {...props} id={`team-${team.teamId}`} ref={ref}>
        <Blade.Column
          justifyContent="start"
          alignItems="center"
          direction="row"
        >
          <TeamAvatar size="lg" team={team} />
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
            {hasPermission('customer-organization:administer') && (
              <div>
                <OrganizationTypeTag organizationType={team.organizationType} />
              </div>
            )}
            <Blade.Title>{team.name}</Blade.Title>
            {userCount !== undefined && (
              <Text textColor="secondary">
                {t('teams:blade.members', { count: userCount })}
              </Text>
            )}
          </Stack>
        </Blade.Column>

        <AccountBlade.ChevronButtonColumn onClick={onClick} />
      </AccountBlade>
    )
  }
)

TeamBlade.displayName = 'TeamBlade'
