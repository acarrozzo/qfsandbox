import { TRPCClientError } from '@trpc/client'
import type { AnyRouter } from '@trpc/server'

export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AnyRouter> {
  return cause instanceof TRPCClientError
}
