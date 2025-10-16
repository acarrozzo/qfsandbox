import type { FileArea, FolderUrn } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Modal, PageHeader, useToast } from '@mntn-dev/ui-components'

import { FileUploadButton } from '~/components/projects/file-upload-button.tsx'
import type { ComponentProps } from '~/types/props.ts'

import { SearchBar } from '../search/search-bar.tsx'

type Props = ComponentProps<{
  folderUrn: FolderUrn
  isSearching: boolean
  uploadFileArea?: FileArea
  onAfterUpload: () => void
  onSearch: (searchText: string) => void
  onClose: () => void
  label: {
    close: string
  }
}>

export const FileManagerHeader = ({
  folderUrn,
  isSearching,
  uploadFileArea,
  onAfterUpload,
  onSearch,
  onClose,
  label,
}: Props) => {
  const { t } = useTranslation(['file-manager', 'toast'])
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

  return (
    <Modal.Overline>
      <PageHeader
        dataTestId="file-manager-header"
        dataTrackingId="file-manager-header"
      >
        <PageHeader.Main>
          <PageHeader.Overline>
            <PageHeader.OverlineLink onClick={onClose}>
              {label.close}
            </PageHeader.OverlineLink>
          </PageHeader.Overline>
          <PageHeader.Title title={t('file-manager:file-manager')} />
        </PageHeader.Main>
        <PageHeader.Controls>
          <SearchBar
            postpone={isSearching}
            onChange={onSearch}
            dataTestId="files-search"
            dataTrackingId="files-search"
          />

          {uploadFileArea && (
            <FileUploadButton
              fileArea={uploadFileArea}
              folderUrn={folderUrn}
              onAfterUpload={handleAfterUpload}
              iconLeft="add"
            >
              {t('file-manager:add-file')}
            </FileUploadButton>
          )}
        </PageHeader.Controls>
      </PageHeader>
    </Modal.Overline>
  )
}
