'use client'

import { useTranslation } from '@mntn-dev/i18n'
import { SidebarLayoutContent, Surface, Text } from '@mntn-dev/ui-components'

export const AccountEmptyState = () => {
  const { t } = useTranslation(['generic'])
  return (
    <SidebarLayoutContent className="max-w-full flex flex-1">
      <Surface className="flex-1 flex justify-center items-center">
        <Text>{t('no-results')}</Text>
      </Surface>
    </SidebarLayoutContent>
  )
}
