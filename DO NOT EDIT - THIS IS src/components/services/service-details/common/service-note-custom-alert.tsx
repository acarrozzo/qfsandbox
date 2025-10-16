'use client'

import { useTranslation } from '@mntn-dev/i18n'
import { Icon, Stack, Text } from '@mntn-dev/ui-components'

export const ServiceNoteCustomAlert = () => {
  const { t } = useTranslation(['edit-service'])
  return (
    <Stack gap="2" alignItems="center">
      <Icon name="error-warning" size="2xl" color="notice" />
      <Text fontWeight="bold">
        {t('edit-service:custom-service-note-alert')}
      </Text>
    </Stack>
  )
}
