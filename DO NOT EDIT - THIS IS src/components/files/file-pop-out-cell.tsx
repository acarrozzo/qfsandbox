import type { FileListItem } from '@mntn-dev/file-service'
import { useTranslation } from '@mntn-dev/i18n'
import { PopoutMenu } from '@mntn-dev/ui-components'

type Props = {
  file: FileListItem
  onArchiveFile: () => void
  onPreviewFile: () => void
}

export const FilePopOutCell = ({
  file,
  onArchiveFile,
  onPreviewFile,
}: Props) => {
  const { t } = useTranslation(['generic', 'file-manager'])
  const { fileId } = file

  return (
    <PopoutMenu dataTestId={`popout-file-id-${fileId}`}>
      <PopoutMenu.Item
        dataTestId={`popout-file-id-${fileId}-view`}
        leftIcon={{ name: 'eye', color: 'brand', fill: 'solid' }}
        onClick={onPreviewFile}
      >
        {t('preview', { ns: 'file-manager' })}
      </PopoutMenu.Item>
      {file.acl.canArchiveFile && (
        <PopoutMenu.Item
          dataTestId={`popout-file-id-${fileId}-archive`}
          leftIcon={{ name: 'delete-bin', color: 'negative', fill: 'solid' }}
          label={t('archive', { ns: 'generic' })}
          onClick={onArchiveFile}
        >
          {t('archive', { ns: 'file-manager' })}
        </PopoutMenu.Item>
      )}
    </PopoutMenu>
  )
}
