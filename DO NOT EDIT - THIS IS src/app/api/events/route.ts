export const dynamic = 'force-dynamic'

import { AsyncEventRouteHandler } from '@mntn-dev/async-event-handlers'

const asyncEventHandlerService = AsyncEventRouteHandler()

export const { GET, POST, PUT } = asyncEventHandlerService
