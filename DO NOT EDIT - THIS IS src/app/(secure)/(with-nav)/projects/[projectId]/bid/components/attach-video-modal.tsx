import { useMemo, useState } from 'react'

import { BidUrn, type FileId, TeamUrn } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Heading, Modal, Stack, Text } from '@mntn-dev/ui-components'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import type { ViewableFile } from '#components/files/viewer/types.ts'
import { CenteredLoadingSpinner } from '#components/shared/centered-loading-spinner.tsx'
import { ExampleVideoListItem } from '#projects/[projectId]/bid/components/example-video-list-item.tsx'
import { useBidContext } from '#projects/[projectId]/bid/hooks/use-bid.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'

export const AttachVideoModal = ({
  isOpen,
  onClose,
  existingVideos = [],
}: {
  isOpen: boolean
  onClose: () => void
  existingVideos?: ViewableFile[]
}) => {
  const { bidId, agencyTeamId } = useBidContext()
  const { t } = useTranslation(['bids'])
  const [selectedFileIds, setSelectedFileIds] = useState<Set<FileId>>(new Set())
  const [isSaving, setIsSaving] = useState(false)

  const linkFile = trpcReactClient.files.linkFile.useMutation()
  const { data: exampleVideos, isLoading } =
    trpcReactClient.files.list.useQuery({
      where: {
        folderUrn: TeamUrn(agencyTeamId),
        area: 'teams.profiles.examples',
      },
    })

  const filteredExampleVideos = useMemo(() => {
    if (!exampleVideos) {
      return []
    }

    const existingFileIds = new Set(
      existingVideos.map((video) => video.linkSourceFileId)
    )

    return exampleVideos.filter((video) => !existingFileIds.has(video.fileId))
  }, [exampleVideos, existingVideos])

  const handleCheckboxChange = (fileId: FileId, isChecked: boolean) => {
    setSelectedFileIds((prev) => {
      const updated = new Set(prev)
      isChecked ? updated.add(fileId) : updated.delete(fileId)
      return updated
    })
  }

  const handleSaveAndClose = async () => {
    setIsSaving(true)
    try {
      await Promise.all(
        Array.from(selectedFileIds).map((fileId) =>
          linkFile.mutateAsync({
            source: { fileId },
            target: {
              folderUrn: BidUrn(bidId),
              area: 'bids.examples',
            },
          })
        )
      )
    } finally {
      setIsSaving(false)
      onClose()
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Modal.Dialog className="w-full max-w-screen-lg h-4/5 p-12">
        <Stack direction="col" width="full" gap="8">
          <Stack justifyContent="between">
            <Heading
              dataTrackingId="attach-videos-header"
              dataTestId="attach-videos-header"
            >
              {t('bids:attach-videos-with-count', {
                count: selectedFileIds.size,
              })}
            </Heading>
            <Button
              loading={isSaving}
              variant="primary"
              size="lg"
              onClick={handleSaveAndClose}
              dataTestId="attach-videos-save-and-close-button"
              dataTrackingId="attach-videos-save-and-close-button"
            >
              {t('bids:save-and-close')}
            </Button>
          </Stack>
          {isLoading ? (
            <CenteredLoadingSpinner />
          ) : isNonEmptyArray(filteredExampleVideos) ? (
            filteredExampleVideos.map((video) => (
              <ExampleVideoListItem
                key={video.fileId}
                video={video}
                isChecked={selectedFileIds.has(video.fileId)}
                handleCheck={handleCheckboxChange}
              />
            ))
          ) : (
            <Text
              textColor="secondary"
              dataTestId="no-videos-exist-text"
              dataTrackingId="no-videos-exist-text"
            >
              {t('bids:no-example-videos-available')}
            </Text>
          )}
        </Stack>
      </Modal.Dialog>
    </Modal>
  )
}
