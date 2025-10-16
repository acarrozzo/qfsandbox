'use client'

import type { SurveyType, UserDomainQueryModel } from '@mntn-dev/domain-types'
import { Heading, Stack } from '@mntn-dev/ui-components'

import { organizationTypeBorderColorMap } from '~/components/avatar/helper.ts'
import { UserAvatar } from '~/components/avatar/user-avatar.tsx'

type Props = { surveyType: SurveyType; user: UserDomainQueryModel }

export const SurveyAvatar = ({ surveyType, user }: Props) => {
  return (
    <Stack direction="col" gap="4" width="64">
      <Stack justifyContent="center">
        <UserAvatar
          size="2xl"
          user={user}
          dataTestId={`${surveyType}-avatar-${user.userId}`}
          dataTrackingId={`${surveyType}-avatar-${user.userId}`}
          showOrganizationTypeIndicator
        />
      </Stack>

      <Heading
        fontSize="xl"
        textColor={organizationTypeBorderColorMap[user.organizationType]}
        className="text-center truncate"
        dataTestId={`${surveyType}-user-name-${user.userId}`}
        dataTrackingId={`${surveyType}-user-name-${user.userId}`}
      >
        {user.displayName}
      </Heading>
    </Stack>
  )
}
