import { TRPCError } from '@trpc/server'

import { notFound, redirect } from '@mntn-dev/app-navigation'
import { activityLinkRoute } from '@mntn-dev/app-routing'
import type { NotificationId } from '@mntn-dev/domain-types'

import { trpcServerSideClient } from '~/app/_trpc/trpc-server-side-client.ts'
import { ErrorLayout } from '~/components/error/error-layout.tsx'

type PageProps = Readonly<{
  params: { notificationId: NotificationId }
}>

export default async function Page({ params: { notificationId } }: PageProps) {
  try {
    const notification =
      await trpcServerSideClient.notifications.getNotificationById({
        notificationId,
      })

    if (notification) {
      if (notification.status !== 'read') {
        await trpcServerSideClient.notifications.markNotificationRead(
          notification
        )
      }

      return redirect(activityLinkRoute(notification.activity).toAbsoluteUrl())
    }

    return notFound()
  } catch (error) {
    if (error instanceof TRPCError && error.code === 'FORBIDDEN') {
      return <ErrorLayout code={403} />
    }
    throw error
  }
}
