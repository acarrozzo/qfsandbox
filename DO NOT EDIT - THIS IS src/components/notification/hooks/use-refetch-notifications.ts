'use client'

import { useMe } from '~/hooks/secure/use-me.ts'
import { useQueryPlan } from '~/hooks/use-query-plan'

export const useRefetchNotifications = () => {
  const queryPlan = useQueryPlan()
  const { me } = useMe()

  return () =>
    me &&
    queryPlan
      .include(({ notifications }) =>
        notifications.getNotificationsForUser.refetch({
          userId: me.userId,
        })
      )
      .apply()
}
