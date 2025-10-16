import { useState } from 'react'

import { BidUrn } from '@mntn-dev/domain-types'
import type {
  AfterUploadEvent,
  AfterUploadHandler,
} from '@mntn-dev/files-adapter-client'
import { clientAllowedFormatsMap } from '@mntn-dev/files-shared'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Heading, Stack, Text } from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { FileUploadButton } from '#components/projects/file-upload-button.tsx'
import { CenteredLoadingSpinner } from '#components/shared/centered-loading-spinner.tsx'
import { AttachVideoModal } from '#projects/[projectId]/bid/components/attach-video-modal.tsx'
import { ExampleVideoListItem } from '#projects/[projectId]/bid/components/example-video-list-item.tsx'
import { useBidContext } from '#projects/[projectId]/bid/hooks/use-bid.ts'

export const ExampleVideoList = () => {
  const {
    bid,
    bidId,
    exampleVideos,
    exampleVideosLoading,
    refetchBid,
    setEditingFileId,
    refetchExampleVideos,
  } = useBidContext()
  const { t } = useTranslation(['bids'])
  const [addVideoModalOpen, setAddVideoModalOpen] = useState(false)

  const handleAfterUpload: AfterUploadHandler = async (
    event: AfterUploadEvent
  ) => {
    setEditingFileId(event.file.fileId)
    await refetchBid()
    await refetchExampleVideos()
  }

  const handleModalClose = async () => {
    await refetchBid()
    await refetchExampleVideos()
    setAddVideoModalOpen(false)
  }

  return (
    <>
      <Stack direction="col" gap="4">
        <Stack justifyContent="between" gap="8">
          <Stack direction="col" justifyContent="center">
            <Heading
              fontSize="xl"
              dataTestId="example-video-header"
              dataTrackingId="example-video-header"
            >
              {t('bids:video-examples-header')}
            </Heading>
          </Stack>
          {bid.acl.canSubmitBid && (
            <Stack gap="4" alignItems="center">
              <FileUploadButton
                fileArea="bids.examples"
                folderUrn={BidUrn(bidId)}
                options={{
                  resourceType: 'video',
                  maxFiles: 1,
                  showUploadMoreButton: false,
                  singleUploadAutoClose: true,
                  clientAllowedFormats: clientAllowedFormatsMap.video,
                }}
                onAfterUpload={handleAfterUpload}
                variant="secondary"
                iconRight="add"
              >
                Upload New
              </FileUploadButton>
              <Button
                iconRight="link"
                onClick={() => {
                  setAddVideoModalOpen(true)
                }}
                dataTestId="attach-video-button"
                dataTrackingId="attach-video-button"
              >
                {t('bids:attach-from-profile')}
              </Button>
            </Stack>
          )}
        </Stack>

        {exampleVideosLoading ? (
          <div className="py-16">
            <CenteredLoadingSpinner />
          </div>
        ) : (
          <Stack direction="col" width="full" gap="2" paddingTop="2">
            {isNonEmptyArray(exampleVideos) ? (
              exampleVideos?.map((video) => {
                return (
                  <ExampleVideoListItem
                    key={video.fileId}
                    video={video}
                    canEdit
                  />
                )
              })
            ) : (
              <Text
                textColor="secondary"
                dataTestId="no-videos-exist-text"
                dataTrackingId="no-videos-exist-text"
              >
                {bid.acl.canSubmitBid
                  ? t('add-example-videos-text')
                  : t('no-example-videos-added')}
              </Text>
            )}
          </Stack>
        )}
      </Stack>

      <AttachVideoModal
        isOpen={bid.acl.canSubmitBid && addVideoModalOpen}
        onClose={handleModalClose}
      />
    </>
  )
}
