import { useTranslation } from '@mntn-dev/i18n'
import { List, Stack, Text } from '@mntn-dev/ui-components'
import { themeTextColorMap } from '@mntn-dev/ui-theme'

import { IconInfoTooltip } from '#components/shared/icon-info-tooltip.tsx'

export const ProjectPackageBrowserCustomPriceTooltip = () => {
  const { t } = useTranslation(['service-checkout'])

  return (
    <IconInfoTooltip>
      <Stack gap="2" direction="col" width="64">
        <Text fontWeight="bold" textColor="primary-inverse" fontSize="base">
          {t('service-checkout:custom-priced-services')}
        </Text>
        <List className={themeTextColorMap['primary-inverse']}>
          <List.Item>
            {t('service-checkout:custom-priced-services-disclaimer')}
          </List.Item>
        </List>
      </Stack>
    </IconInfoTooltip>
  )
}
