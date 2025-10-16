'use client'

import type { PropsWithChildren } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { useAuth } from '@mntn-dev/authentication-client'
import type { SessionId } from '@mntn-dev/domain-types'
import { useHandleAllMessages } from '@mntn-dev/realtime-updates-service'
import {
  OrganizationChannel,
  OrganizationTypeChannel,
  TeamChannel,
  UserChannel,
} from '@mntn-dev/realtime-updates-types'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { usePrincipal } from '~/hooks/secure/use-principal.ts'
import { realtimeUpdateMessageHandler } from '~/utils/realtime-update-message-handler.ts'

const RealtimeUpdatesHandler = ({
  children,
  sessionId,
}: PropsWithChildren<{ sessionId: SessionId }>) => {
  const {
    principal: {
      authz: { organizationType, teamIds, organizationId },
      profile: { userId },
    },
  } = usePrincipal()
  const router = useRouter()
  const { getToken } = useAuth()

  const channelNames = [
    OrganizationChannel(organizationId),
    OrganizationTypeChannel(organizationType),
    ...teamIds.map(TeamChannel),
    UserChannel(userId),
  ]

  const messageHandler = realtimeUpdateMessageHandler(
    trpcReactClient.useUtils(),
    sessionId,
    router,
    getToken
  )

  useHandleAllMessages(channelNames, messageHandler)

  return <>{children}</>
}

export { RealtimeUpdatesHandler }
