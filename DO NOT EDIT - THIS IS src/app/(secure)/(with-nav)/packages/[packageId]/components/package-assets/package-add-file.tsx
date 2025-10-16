import type { FolderUrn } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Input, MediaCard, useToast } from '@mntn-dev/ui-components'

import { useUploadWidget } from '~/app/file-tools.ts'

type Props = {
  folderUrn: FolderUrn
  isFirst: boolean
  onAfterUpload: () => void
}

export const PackageAddFile = ({
  folderUrn,
  isFirst,
  onAfterUpload,
}: Props) => {
  const { t } = useTranslation(['package-details', 'toast'])
  const { showToast } = useToast()

  const handleAfterUpload = () => {
    onAfterUpload()

    showToast.info({
      title: t('toast:file.added.title'),
      body: t('toast:file.added.body'),
      dataTestId: 'file-added-info-toast',
      dataTrackingId: 'file-added-info-toast',
    })
  }

  const { open } = useUploadWidget({
    fileArea: 'packages.examples',
    folderUrn,
    onAfterUpload: handleAfterUpload,
    options: {
      multiple: false,
      sources: ['local', 'camera', 'url', 'dropbox', 'google_drive'],
    },
  })

  return (
    <MediaCard width="1/3">
      <MediaCard.Main>
        <MediaCard.UploadButton
          background={isFirst ? undefined : 'container-tertiary'}
          onClick={open}
        >
          {t(
            isFirst
              ? 'package-details:quickview.upload-video'
              : 'package-details:quickview.upload-another-video'
          )}
        </MediaCard.UploadButton>
      </MediaCard.Main>

      {!isFirst && <Input className="invisible" disabled />}
    </MediaCard>
  )
}
