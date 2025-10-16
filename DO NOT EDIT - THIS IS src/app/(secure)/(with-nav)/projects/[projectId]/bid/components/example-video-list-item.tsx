import type { FileId } from '@mntn-dev/domain-types'
import { Checkbox, Stack, Surface } from '@mntn-dev/ui-components'
import { themeBackgroundMap, themeBorderColorMap } from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

import type { ViewableFile } from '#components/files/viewer/types.ts'
import { Viewer } from '#components/files/viewer/viewer.tsx'
import { ExampleVideoDetails } from '#projects/[projectId]/bid/components/example-video-details.tsx'
import { ExampleVideoEdit } from '#projects/[projectId]/bid/components/example-video-edit.tsx'
import { useBidContext } from '#projects/[projectId]/bid/hooks/use-bid.ts'

export const ExampleVideoListItem = ({
  video,
  handleCheck,
  isChecked,
  canEdit = false,
}: {
  video: ViewableFile
  handleCheck?: (fileId: FileId, checked: boolean) => void
  isChecked?: boolean
  canEdit?: boolean
}) => {
  const dataTestIdPrefix = `example-video-fileId-${video.fileId}`
  const { editingFileId } = useBidContext()
  const isEditing = editingFileId === video.fileId

  return (
    <Surface
      className={cn(
        'border group overflow-hidden p-6 w-full',
        themeBorderColorMap.muted,
        themeBackgroundMap['container-tertiary']
      )}
    >
      <Stack gap="6" className="relative w-full overflow-hidden">
        {handleCheck && (
          <Checkbox
            value={isChecked}
            onChange={(checked) => handleCheck(video.fileId, checked)}
            dataTrackingId={`${dataTestIdPrefix}-attach-checkbox`}
            dataTestId={`${dataTestIdPrefix}-attach-checkbox`}
          />
        )}
        <div className="w-80 min-w-80 max-w-80 h-full flex-none">
          <Viewer file={video} />
        </div>
        <div className="w-full overflow-hidden">
          {canEdit && isEditing ? (
            <ExampleVideoEdit video={video} />
          ) : (
            <ExampleVideoDetails video={video} canEdit={canEdit} />
          )}
        </div>
      </Stack>
    </Surface>
  )
}
