import { Button, Heading, Icon, RichText, Stack } from '@mntn-dev/ui-components'

import type { ViewableFile } from '#components/files/viewer/types.ts'
import { useBidContext } from '#projects/[projectId]/bid/hooks/use-bid.ts'

export const ExampleVideoDetails = ({
  video,
  canEdit,
}: {
  video: ViewableFile
  canEdit: boolean
}) => {
  const { bid, handleDeleteVideo, setEditingFileId } = useBidContext()
  const dataTestIdPrefix = `example-video-fileId-${video.fileId}`

  const showActions = canEdit && bid.acl.canSubmitBid

  return (
    <Stack direction="col" gap="2" className="flex-1 overflow-hidden">
      <Stack gap="1" justifyContent="between">
        <Heading
          fontSize="xl"
          className="line-clamp-2 overflow-ellipsis break-words"
          dataTrackingId={`${dataTestIdPrefix}-title`}
          dataTestId={`${dataTestIdPrefix}-title`}
        >
          {video.title || video.name}
        </Heading>
        {showActions && (
          <div className="group-hover:visible flex gap-1">
            <Button
              variant="secondary"
              size="xs"
              className="p-2 invisible group-hover:visible"
              dataTrackingId={`${dataTestIdPrefix}-edit-video-button`}
              dataTestId={`${dataTestIdPrefix}-edit-video-button`}
              onClick={() => setEditingFileId(video.fileId)}
            >
              <Icon name="pencil" fill="solid" size="sm" color="primary" />
            </Button>
            <Button
              variant="secondary"
              size="xs"
              className="p-2 invisible group-hover:visible"
              dataTrackingId={`${dataTestIdPrefix}-delete-video-button`}
              dataTestId={`${dataTestIdPrefix}-delete-video-button`}
              onClick={() => handleDeleteVideo(video.fileId)}
            >
              <Icon name="delete-bin" fill="solid" size="sm" color="negative" />
            </Button>
          </div>
        )}
      </Stack>
      <RichText
        dataTrackingId={`${dataTestIdPrefix}-description`}
        dataTestId={`${dataTestIdPrefix}-description`}
        value={video.description}
      />
    </Stack>
  )
}
