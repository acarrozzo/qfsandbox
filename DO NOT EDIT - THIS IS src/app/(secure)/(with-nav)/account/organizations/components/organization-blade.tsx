import { type CSSProperties, forwardRef } from 'react'

import type { OrganizationDomainQueryModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Blade,
  RichText,
  Stack,
  Text,
  type VirtualItemProps,
} from '@mntn-dev/ui-components'

import { UserAvatarGroup } from '~/components/avatar/user-avatar-group.tsx'
import { OrganizationTypeTag } from '~/components/organization/organization-type-tag.tsx'

import {
  AccountBlade,
  type AccountBladePublicProps,
} from '../../components/blade/account-blade.tsx'

type OrganizationBladeProps = AccountBladePublicProps & {
  className?: string
  organization: OrganizationDomainQueryModel
  style?: CSSProperties
} & VirtualItemProps

export const OrganizationBlade = forwardRef<
  HTMLDivElement,
  OrganizationBladeProps
>(({ organization, style, className, ...props }, ref) => {
  const { onClick } = props
  const { t } = useTranslation(['organizations'])

  return (
    <AccountBlade
      {...props}
      id={`organization-${organization.organizationId}`}
      ref={ref}
      style={style}
      className={className}
    >
      <Blade.Column
        justifyContent="start"
        alignItems="center"
        direction="row"
        gap="4"
        grow
        shrink
      >
        <Stack direction="col" gap="2">
          <div>
            <OrganizationTypeTag
              organizationType={organization.organizationType}
            />
          </div>
          <Blade.Title fontSize="2xl">{organization.name}</Blade.Title>
          {organization.description && (
            <RichText
              value={organization.description}
              className="line-clamp-3 text-secondary"
              displayPlainText
            />
          )}
          <Text textColor="secondary">
            {t('organizations:blade.members', {
              count: organization.users?.length ?? 0,
            })}
          </Text>
          {organization.users && <UserAvatarGroup users={organization.users} />}
        </Stack>
      </Blade.Column>

      <AccountBlade.TeamsColumn teams={organization.teams} />

      <AccountBlade.ChevronButtonColumn onClick={onClick} />
    </AccountBlade>
  )
})

OrganizationBlade.displayName = 'OrganizationBlade'
