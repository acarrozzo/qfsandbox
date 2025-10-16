'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { OrganizationId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, type ButtonProps } from '@mntn-dev/ui-components'

type TeamMembersButtonProps = Omit<
  ButtonProps,
  'children' | 'onClick' | 'variant' | 'iconRight'
> & {
  organizationId: OrganizationId
  count: number | undefined
}

export const TeamMembersButton = ({
  organizationId,
  count = 0,
  ...buttonProps
}: TeamMembersButtonProps) => {
  const { t } = useTranslation('teams')
  const router = useRouter()

  const handleClick = () => {
    router.push(
      route('/account/organizations/:organizationId/users').params({
        organizationId,
      })
    )
  }

  return (
    <Button
      {...buttonProps}
      onClick={handleClick}
      variant="secondary"
      iconRight="team"
    >
      {t('members-button.members', { count })}
    </Button>
  )
}
