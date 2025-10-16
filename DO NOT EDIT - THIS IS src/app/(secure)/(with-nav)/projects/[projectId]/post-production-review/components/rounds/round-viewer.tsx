import {
  Button,
  Heading,
  Icon,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'

import type { ViewableFile } from '#components/files/viewer/types.ts'
import { ViewerContainer } from '#projects/[projectId]/post-production-review/components/viewer-container.tsx'
import { usePostProductionReviewContext } from '#projects/[projectId]/post-production-review/use-post-production-review.tsx'
import { formatBytes } from '#utils/format-bytes.ts'
import { handleFileDownload } from '~/lib/files/file-helpers.ts'

export const RoundViewer = ({ upload }: { upload: ViewableFile }) => {
  const { selectedDeliverableName } = usePostProductionReviewContext()

  const handleDownload = async () => {
    upload && (await handleFileDownload(upload))
  }

  return (
    <Surface.Body
      dataTestId="final-asset-viewer-container"
      dataTrackingId="final-asset-viewer-container"
    >
      {upload.category === 'video' ? (
        <ViewerContainer upload={upload} />
      ) : (
        <Stack
          direction="col"
          gap="2"
          padding="16"
          alignItems="center"
          dataTestId="round-archive-file-info"
          dataTrackingId="round-archive-file-info"
        >
          <Icon name="check" size="xl" color="positive" />
          <Heading fontSize="2xl" className="text-center">
            {selectedDeliverableName}
          </Heading>
          <Text textColor="positive" fontSize="base" className="text-center">
            <Stack gap="1" justifyContent="center" alignItems="center">
              {upload.name}

              <Button size="xs" variant="text" onClick={handleDownload}>
                <Icon size="xs" name="download" color="positive" />
              </Button>
            </Stack>
          </Text>
          <Text fontSize="sm" textColor="tertiary">
            {formatBytes(upload.size)}
          </Text>
        </Stack>
      )}
    </Surface.Body>
  )
}
