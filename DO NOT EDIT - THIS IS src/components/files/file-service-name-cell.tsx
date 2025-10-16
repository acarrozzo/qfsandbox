import type { FileListItem } from '@mntn-dev/file-service'
import { useTranslation } from '@mntn-dev/i18n'
import { Text } from '@mntn-dev/ui-components'

type Props = {
  file: FileListItem
}

export const FileServiceNameCell = ({ file }: Props) => {
  const { t } = useTranslation('file-manager')
  const isFinal = file.area === 'projects.services.assets.final'

  return (
    <Text textColor="secondary">
      {file.serviceName} {isFinal && t('service-suffix.final')}
    </Text>
  )
}
