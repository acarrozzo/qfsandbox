import { useTranslation } from '@mntn-dev/i18n'
import { Heading, Surface, Text } from '@mntn-dev/ui-components'

export const PackageServiceEmptyState = () => {
  const { t } = useTranslation('package-service-details')

  return (
    <Surface divide={false} padding="8" className="flex-1 h-full">
      <Surface.Header className="flex-none">
        <Heading fontSize="3xl">{t('empty.title')}</Heading>
      </Surface.Header>
      <Surface.Body className="flex-1 min-h-40">
        <Text
          className="h-full content-center text-center"
          as="div"
          textColor="tertiary"
        >
          {t('empty.content')}
        </Text>
      </Surface.Body>
    </Surface>
  )
}
