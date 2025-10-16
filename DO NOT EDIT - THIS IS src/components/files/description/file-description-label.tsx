import { useTranslation } from '@mntn-dev/i18n'
import { Text } from '@mntn-dev/ui-components'

export const FileDescriptionLabel = () => {
  const { t } = useTranslation('file-manager')

  return (
    <Text
      fontWeight="medium"
      fontSize="base"
      textColor="secondary"
      dataTestId="file-description-label"
      dataTrackingId="file-description-label"
    >
      {t('description')}
    </Text>
  )
}
