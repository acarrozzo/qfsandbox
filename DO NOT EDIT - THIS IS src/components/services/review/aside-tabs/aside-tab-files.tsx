'use client'

import { useTranslation } from '@mntn-dev/i18n'
import { LoadingSpinner, Table, Text } from '@mntn-dev/ui-components'
import { isNilOrEmptyArray } from '@mntn-dev/utilities'

import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'
import { FileThumbnail } from '~/components/files/thumbnail/file-thumbnail.tsx'

const AsideTabFiles = () => {
  const { files, filesLoading, onSelectPreviewFile } =
    usePreProductionReviewContext()
  const { t } = useTranslation('edit-service')

  if (filesLoading) {
    return (
      <div className="flex size-full justify-center items-center">
        <LoadingSpinner className="text-brand size-24" />
      </div>
    )
  }

  if (isNilOrEmptyArray(files)) {
    return (
      <div className="flex size-full justify-center items-center">
        <Text
          textColor="secondary"
          dataTestId="service-files-no-files"
          dataTrackingId="service-files-no-files"
        >
          {t('no-files', { ns: 'edit-service' })}
        </Text>
      </div>
    )
  }

  return (
    <Table
      width="full"
      dataTestId="service-files-table"
      dataTrackingId="service-files-table"
      className="rounded-none border-b border-subtle"
    >
      <Table.Body className="[&>tr]:bg-black/0">
        {files.map((file) => (
          <Table.Row
            key={file.fileId}
            onClick={() => onSelectPreviewFile(file.fileId)}
            dataTestId={`service-files-row-${file.fileId}`}
            dataTrackingId={`service-files-row-${file.fileId}`}
          >
            <Table.Cell
              className="px-8 py-6"
              dataTestId={`service-files-row-column-name-${file.fileId}`}
              dataTrackingId={`service-files-row-column-name-${file.fileId}`}
            >
              <Text
                textColor="primary"
                dataTestId={`service-files-name-${file.fileId}`}
                dataTrackingId={`service-files-name-${file.fileId}`}
              >
                {file.name}
              </Text>
            </Table.Cell>
            <Table.Cell
              className="py-3 w-24 pr-8"
              dataTestId={`service-files-row-column-image-${file.fileId}`}
              dataTrackingId={`service-files-row-column-image-${file.fileId}`}
            >
              <FileThumbnail canUpload={false} file={file} size="3xs" />
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export { AsideTabFiles }
