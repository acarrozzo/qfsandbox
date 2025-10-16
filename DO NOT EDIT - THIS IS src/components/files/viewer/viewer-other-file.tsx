import { useTranslation } from '@mntn-dev/i18n'
import { Button, Text } from '@mntn-dev/ui-components'

import type { ComponentProps } from '~/types/props.ts'

import { FileIcon } from '../file-icon.tsx'
import type { ViewableFile } from './types.ts'

type Props = ComponentProps<{
  file: ViewableFile
  onDownload?: () => void
}>

export const ViewerOtherFile = ({ file, onDownload }: Props) => {
  const { t } = useTranslation('file-manager')

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <FileIcon file={file} size="7xl" />
      <Text
        fontSize="lg"
        fontWeight="bold"
        dataTestId={`file-name-${file.fileId}`}
        dataTrackingId={`file-name-${file.fileId}`}
      >
        {file.name}
      </Text>
      {onDownload && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onDownload}
          dataTestId={`download-button-${file.fileId}`}
          dataTrackingId={`download-button-${file.fileId}`}
        >
          {t('download')}
        </Button>
      )}
    </div>
  )
}
