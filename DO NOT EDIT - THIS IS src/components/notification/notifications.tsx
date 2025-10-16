'use client'

import { Activity, ActivityViewModelSchema } from '@mntn-dev/app-activity'
import { usePathname, useRouter } from '@mntn-dev/app-navigation'
import {
  NotificationModal,
  NotificationSurface,
} from '@mntn-dev/app-notification'
import type { AnyRoute } from '@mntn-dev/app-routing'
import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import type { NotificationId } from '@mntn-dev/domain-types'
import { useLanguage } from '@mntn-dev/i18n'
import { LoadingCenter, type ModalProps } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useMe } from '~/hooks/secure/use-me.ts'

import { getAvatarUrl } from '../avatar/helper.ts'
import { EmptyState } from '../empty/empty-state.tsx'
import { useNotificationsQuery } from './hooks/use-notifications-query.ts'

type NotificationsProps = Omit<ModalProps, 'children'>

const Notifications = (props: NotificationsProps) => {
  const { onClose, open } = props
  const { me } = useMe()
  const router = useRouter()
  const languageId = useLanguage()

  const { notifications, refetchNotifications, unreadNotificationCount } =
    useNotificationsQuery({ enabled: open })

  const { mutateAsync: markNotificationRead } =
    trpcReactClient.notifications.markNotificationRead.useMutation()

  const { mutateAsync: markNotificationsReadForUser } =
    trpcReactClient.notifications.markNotificationsReadForUser.useMutation()

  const handleMarkAllAsReadClick = async () => {
    if (me) {
      await markNotificationsReadForUser({ userId: me.userId })
      await refetchNotifications()
      onClose()
    }
  }

  const handleNotificationClick =
    (notificationId: NotificationId) => async () => {
      await markNotificationRead({ notificationId })
      await refetchNotifications()
    }

  const pathname = usePathname()

  const handleNavigate = (route: AnyRoute) => {
    onClose()
    if (pathname !== route.toRelativeUrl()) {
      router.push(route)
    }
  }

  return (
    <NotificationModal {...props}>
      <NotificationSurface
        {...{
          languageId,
          onClose,
          onMarkAllAsRead: handleMarkAllAsReadClick,
          unreadNotificationCount,
        }}
      >
        {notifications ? (
          notifications.length > 0 ? (
            notifications.map((notification) => {
              const { status, activityId, activity } = notification

              return (
                activity && (
                  <NotificationSurface.Section
                    key={activityId}
                    onClick={handleNotificationClick(
                      notification.notificationId
                    )}
                  >
                    <Activity
                      image={NextImage({ unoptimized: true })}
                      onNavigate={handleNavigate}
                      activity={ActivityViewModelSchema(getAvatarUrl).parse(
                        activity
                      )}
                      indicator={status === 'unread'}
                      variant="notification"
                    />
                  </NotificationSurface.Section>
                )
              )
            })
          ) : (
            <EmptyState id="notifications">
              <EmptyState.NothingToSee />
            </EmptyState>
          )
        ) : (
          <LoadingCenter />
        )}
      </NotificationSurface>
    </NotificationModal>
  )
}

export { Notifications, type NotificationsProps }
