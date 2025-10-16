import { useEffect, useState } from 'react'

import { type PackageId, PackageUrn } from '@mntn-dev/domain-types'
import type { FileListItem } from '@mntn-dev/file-service'
import { useTranslation } from '@mntn-dev/i18n'
import { Heading, Stack, Text } from '@mntn-dev/ui-components'

import { PackageAddFile } from './package-add-file.tsx'
import { PackageFile } from './package-file.tsx'

type Props = {
  packageId: PackageId
  files: FileListItem[]
  isError: boolean
  onChange: () => void
}

const MAX_FILES = 3

export const PackageFiles = ({
  packageId,
  files,
  isError,
  onChange,
}: Props) => {
  const { t } = useTranslation('package-details')
  const folderUrn = PackageUrn(packageId)
  const [count, setCount] = useState(files.length)
  const canAddMore = count < MAX_FILES

  useEffect(() => {
    setCount(files.length)
  }, [files])

  const handleAfterUpload = () => {
    // Optimistically update the count to hide the add file button right away
    setCount((c) => c + 1)
    onChange()
  }

  return (
    <>
      <Heading fontSize="xl" fontWeight="bold">
        {t('quickview.header')}
      </Heading>

      {isError && (
        <Text textColor="negative">{t('quickview.error-loading-files')}</Text>
      )}

      <Stack gap="6">
        {files.map((file, index) => (
          <PackageFile
            key={file.fileId}
            file={file}
            index={index}
            onChange={onChange}
          />
        ))}

        {canAddMore && (
          <PackageAddFile
            folderUrn={folderUrn}
            isFirst={count === 0}
            onAfterUpload={handleAfterUpload}
          />
        )}
      </Stack>
    </>
  )
}
