import { showArticle } from '@intercom/messenger-js-sdk'

import { getBrandArticle } from '@mntn-dev/app-assets'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, List, Stack, Text } from '@mntn-dev/ui-components'
import {
  themeBackgroundMap,
  themeHoverBackgroundMap,
  themeTextColorMap,
} from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

import { IconInfoTooltip } from '#components/shared/icon-info-tooltip.tsx'

export const ProjectPackageBrowserHeaderTooltip = () => {
  const { t } = useTranslation(['service-checkout'])

  const onLearnMoreClick = () => {
    showArticle(getBrandArticle('add-services'))
  }

  return (
    <IconInfoTooltip>
      <Stack gap="2" direction="col" width="64">
        <Text fontWeight="bold" textColor="primary-inverse" fontSize="base">
          {t('service-checkout:services.add-services')}
        </Text>
        <List className={themeTextColorMap['primary-inverse']}>
          <List.Item>
            {t('service-checkout:services.tooltip.list-item1')}
          </List.Item>
          <List.Item>
            {t('service-checkout:services.tooltip.list-item2')}
          </List.Item>
        </List>

        {/* todo: try to make this (and all other tooltips with a "Learn More" button)
                  a new colorTheme for the button `dark` */}
        <Button
          width="min"
          variant="secondary"
          onClick={onLearnMoreClick}
          className={cn(
            themeBackgroundMap['page-secondary'],
            themeHoverBackgroundMap['secondary-inverse']
          )}
        >
          {t('service-checkout:services.tooltip.button-learn-more')}
        </Button>
      </Stack>
    </IconInfoTooltip>
  )
}
