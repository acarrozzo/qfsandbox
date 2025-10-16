import { FilteredLogger, Logger } from '@mntn-dev/logger'

export const AuthenticationMiddlewareLogger = FilteredLogger(
  Logger('authentication-middleware')
)

export const AuthorizationMiddlewareLogger = FilteredLogger(
  Logger('authorization-middleware')
)

export const PrincipalMiddlewareLogger = FilteredLogger(
  Logger('principal-middleware')
)
