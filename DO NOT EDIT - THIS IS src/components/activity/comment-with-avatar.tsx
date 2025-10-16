import type { UserDomainQueryModel } from '@mntn-dev/domain-types'
import { Stack, Text } from '@mntn-dev/ui-components'

import { UserAvatar } from '#components/avatar/user-avatar.tsx'

export const CommentWithAvatar = ({
  actor,
  comment,
  showFullName = true,
}: {
  actor: UserDomainQueryModel
  comment: string
  showFullName?: boolean
}) => {
  return (
    <Stack gap="4">
      <UserAvatar user={actor} />
      <Stack direction="col" gap="1" shrink>
        <Text>{showFullName && `${actor.firstName} ${actor.lastName}`}</Text>
        <Text textColor="secondary" className="whitespace-pre-line">
          {comment}
        </Text>
      </Stack>
    </Stack>
  )
}
