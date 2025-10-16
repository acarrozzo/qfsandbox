'use client'

import type { ButtonHTMLAttributes } from 'react'

import {
  Avatar,
  type AvatarPersonProps,
  getTestProps,
  type TestIds,
} from '@mntn-dev/ui-components'

function getAvatarProps<T>(
  props: AvatarPersonProps & T
): { avatarProps: AvatarPersonProps } & T {
  const { person, image, ...rest } = props
  return { avatarProps: { person, image }, ...(rest as T) }
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>
type UserAvatarButtonProps = ButtonProps & AvatarPersonProps

export const UserAvatarButton = (props: UserAvatarButtonProps & TestIds) => {
  const { dataTestId, dataTrackingId } = props
  const { avatarProps, ...buttonProps } = getAvatarProps<ButtonProps>(props)

  return (
    <button
      type="button"
      {...buttonProps}
      {...getTestProps({ dataTestId, dataTrackingId })}
    >
      <Avatar.Person {...avatarProps} />
    </button>
  )
}
