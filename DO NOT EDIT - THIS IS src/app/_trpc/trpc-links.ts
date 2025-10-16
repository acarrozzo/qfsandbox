import type { TRPCLink } from '@trpc/client'
import { observable } from '@trpc/server/observable'

import type { AppRouter } from '@mntn-dev/api'

export const errorLink =
  (opts: { onError: (err: Error) => void }): TRPCLink<AppRouter> =>
  () =>
  ({ next, op }) =>
    observable((observer) =>
      next(op).subscribe({
        ...observer,
        error(err) {
          observer.error(err)
          opts.onError(err)
        },
      })
    )
