import { type CSSProperties, forwardRef, type PropsWithChildren } from 'react'

import { Blade, type VirtualItemProps } from '@mntn-dev/ui-components'

import { AccountBladeChevronButtonColumn } from './account-blade-chevron-button-column.tsx'
import { AccountBladeTeamsColumn } from './account-blade-teams-column.tsx'

type AccountBladePublicProps = PropsWithChildren<
  {
    onClick?: () => void
    disabled?: boolean
    muted?: boolean
    style?: CSSProperties
    className?: string
  } & VirtualItemProps
>

type AccountBladeProtectedProps = AccountBladePublicProps & {
  id: string
}

const AccountBlade = forwardRef<HTMLDivElement, AccountBladeProtectedProps>(
  (
    { onClick, disabled, muted, id, children, index, style, className },
    ref
  ) => (
    <Blade
      type="account"
      onClick={onClick}
      hasHoverState
      dataTestId={`${id}-blade`}
      dataTrackingId={`${id}-blade`}
      disabled={disabled}
      muted={muted}
      border={true}
      ref={ref}
      index={index}
      style={style}
      className={className}
    >
      {children}
    </Blade>
  )
)

const AccountBladeComponent = Object.assign(AccountBlade, {
  ChevronButtonColumn: AccountBladeChevronButtonColumn,
  TeamsColumn: AccountBladeTeamsColumn,
})

export {
  AccountBladeComponent as AccountBlade,
  type AccountBladeProtectedProps,
  type AccountBladePublicProps,
}
