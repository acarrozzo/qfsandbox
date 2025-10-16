import { ActivityFeed, ActivityViewModelsSchema } from '@mntn-dev/app-activity'
import { useQueryParams, useRouter } from '@mntn-dev/app-navigation'
import type { AnyRoute } from '@mntn-dev/app-routing'
import { NextImage } from '@mntn-dev/app-ui-components/next-image'
import { FeedId } from '@mntn-dev/domain-types'
import { logger } from '@mntn-dev/logger'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import { useRealtimeSubscription } from '@mntn-dev/realtime-updates-service'
import { Button, Feed, Stack, useOpenState } from '@mntn-dev/ui-components'

import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { getAvatarUrl } from '~/components/avatar/helper.ts'
import { useMeAsPerson } from '~/hooks/secure/use-me-as-person'

export const ProjectActivity = ({ project }: { project: ProjectWithAcl }) => {
  const { activityId } = useQueryParams<'/projects/:projectId'>()

  const feedId = FeedId(project.projectId)
  const { meAsPerson } = useMeAsPerson()
  const router = useRouter()

  const { data: activities, refetch: refetchActivity } =
    trpcReactClient.activity.getActivityByFeedId.useQuery({ feedId })

  useRealtimeSubscription(`feed:${feedId}`, 'feed.updated', async () => {
    await refetchActivity()
  })

  const { mutateAsync: createActivity, isPending } =
    trpcReactClient.activity.createActivity.useMutation()

  const handleComment = (jsonString: string) => {
    createActivity({
      feedId,
      details: {
        activityType: 'comment_created',
        data: {
          text: jsonString,
          target: { feed: { name: project.name, urn: project.projectUrn } },
        },
      },
    })
      .then((savedComment) => {
        if (savedComment) {
          onToggle()
          refetchActivity()
        }
      })
      .catch((err) => {
        logger.error('Error saving new comment', err)
      })
  }

  const { open, onToggle } = useOpenState()

  const handleNavigate = (route: AnyRoute) => {
    router.push(route)
  }

  return (
    <>
      {meAsPerson && project.acl.canCommentOnProject && (
        <>
          {!open && (
            <Stack>
              <div className="grow" />
              <Button
                iconLeft="add"
                width="48"
                variant="secondary"
                onClick={onToggle}
                dataTestId="activity-feed-add-comment-button"
              >
                Add Comment
              </Button>
            </Stack>
          )}
          {open && (
            <Feed.CommentInput
              user={meAsPerson}
              onSubmit={handleComment}
              onCancel={onToggle}
              submitting={isPending}
              image={NextImage({ unoptimized: true })}
              dataTestId="activity-feed-comment"
            />
          )}
        </>
      )}
      <ActivityFeed
        activities={
          activities
            ? ActivityViewModelsSchema(getAvatarUrl).parse(activities)
            : undefined
        }
        image={NextImage({ unoptimized: true })}
        onNavigate={handleNavigate}
        currentUrl={window.location.pathname}
        scrollActivityId={activityId}
        variant="feed"
      />
    </>
  )
}
