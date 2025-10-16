import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export function useQueryPlan() {
  const _utils = trpcReactClient.useUtils()

  const promiseBuffer: (false | Promise<void> | undefined)[] = []

  const queryPlan = {
    include: (
      input: (utils: typeof _utils) => false | Promise<void> | undefined,
      options?: { disabled?: boolean }
    ) => {
      if (options?.disabled || input === undefined) {
        return queryPlan
      }

      promiseBuffer.push(input(_utils))

      return queryPlan
    },
    includeMany: (
      input: (utils: typeof _utils) => (false | Promise<void> | undefined)[],
      options?: { disabled?: boolean }
    ) => {
      if (options?.disabled || input === undefined) {
        return queryPlan
      }

      const promises = input(_utils)
      promiseBuffer.push(...promises)

      return queryPlan
    },
    apply: async () => {
      await Promise.all(promiseBuffer)
    },
  }

  return queryPlan
}
