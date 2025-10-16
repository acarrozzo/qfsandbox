import type { RouterContextType } from '@mntn-dev/app-navigation'
import type { GetToken } from '@mntn-dev/authentication-client'
import type { SessionId } from '@mntn-dev/domain-types'
import { Logger } from '@mntn-dev/logger'
import type { RealtimeSchema } from '@mntn-dev/realtime-updates-service'
import type { RealtimeMessageHandlerFunction } from '@mntn-dev/realtime-updates-types'

import type { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { followInstructions } from '~/utils/realtime-update-follow-instructions.ts'

import { handleSessionChange } from './realtime-update-handle-session-change.ts'

const realtimeUpdateLogger = Logger('realtime')

type TrpcUtils = ReturnType<typeof trpcReactClient.useUtils>

const realtimeUpdateMessageHandler: (
  trpcUtils: TrpcUtils,
  sessionId: SessionId | null,
  router: RouterContextType,
  getToken: GetToken
) => RealtimeMessageHandlerFunction<RealtimeSchema> =
  (trpcUtils, sessionId, router, getToken) => async (message) => {
    if (!sessionId) {
      realtimeUpdateLogger.debug(
        'realtimeUpdateMessageHandler: no sessionId found.',
        { sessionId }
      )
    }

    // Took out self update check because it prevents tabs in the same browser from updating
    realtimeUpdateLogger.debug(
      'realtimeUpdateMessageHandler: processing refresh data',
      {
        message,
        sessionId,
        refreshData: message.data.refresh,
      }
    )

    if (message.name === 'session.updated') {
      await handleSessionChange(router, trpcUtils, getToken)
      return
    }

    await followInstructions(trpcUtils, message.data.refresh)
  }

export { realtimeUpdateMessageHandler }
