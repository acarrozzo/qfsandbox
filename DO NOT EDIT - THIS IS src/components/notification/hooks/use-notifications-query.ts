import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useMe } from '~/hooks/secure/use-me.ts'

import { useRefetchNotifications } from './use-refetch-notifications.ts'

export const useNotificationsQuery = ({ enabled }: { enabled?: boolean }) => {
  const { me } = useMe()

  const refetchNotifications = useRefetchNotifications()

  const { data: notifications } =
    trpcReactClient.notifications.getNotificationsForUser.useQuery(
      {
        userId: me.userId,
      },
      {
        enabled,
      }
    )

  return {
    notifications,
    refetchNotifications,
    unreadNotificationCount: notifications?.filter(
      (notification) => notification.status === 'unread'
    ).length,
  }
}
