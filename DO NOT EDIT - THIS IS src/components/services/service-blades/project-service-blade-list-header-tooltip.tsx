import { showArticle } from '@intercom/messenger-js-sdk'

import { getBrandArticle, getMakerArticle } from '@mntn-dev/app-assets'
import type { OrganizationType, ProjectStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, List, Stack, Text } from '@mntn-dev/ui-components'
import {
  themeBackgroundMap,
  themeHoverBackgroundMap,
  themeTextColorMap,
} from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

import { IconInfoTooltip } from '#components/shared/icon-info-tooltip.tsx'

export const ProjectServiceBladeListHeaderTooltip = ({
  status,
  organizationType,
}: {
  status: ProjectStatus
  organizationType?: OrganizationType
}) => {
  const { t } = useTranslation(['project-services'])

  const onLearnMoreClick = () => {
    if (organizationType === 'agency' && status === 'pre_production') {
      showArticle(getMakerArticle('pre-production'))
    }

    if (organizationType === 'brand' && status === 'pre_production') {
      showArticle(getBrandArticle('pre-production'))
    }
  }

  const getContent = (status: ProjectStatus) => {
    switch (status) {
      case 'draft':
        return (
          <Stack direction="col" width="64" gap="2">
            <Text fontWeight="bold" textColor="primary-inverse">
              {t('project-services:services-subheading.tooltip.draft')}
            </Text>
            <List className={themeTextColorMap['primary-inverse']}>
              <List.Item>
                {t('project-services:services-subheading.tooltip.list-item1')}
              </List.Item>
              <List.Item>
                {t('project-services:services-subheading.tooltip.list-item2')}
                {t('project-services:services-subheading.tooltip.list-item2')}
              </List.Item>
              <List.Item>
                {t('project-services:services-subheading.tooltip.list-item3')}
              </List.Item>
            </List>
          </Stack>
        )
      default:
        return (
          <Stack direction="col" width="64" gap="2">
            <Text textColor="primary-inverse">
              {t(
                'project-services:services-subheading.tooltip.production-process',
                {
                  user: t(
                    organizationType === 'agency'
                      ? 'project-services:services-subheading.tooltip.the-brand'
                      : 'project-services:services-subheading.tooltip.your-maker'
                  ),
                }
              )}
            </Text>
            {organizationType &&
              ['brand', 'agency'].includes(organizationType) && (
                <Button
                  width="min"
                  variant="secondary"
                  onClick={onLearnMoreClick}
                  className={cn(
                    themeBackgroundMap['page-secondary'],
                    themeHoverBackgroundMap['secondary-inverse']
                  )}
                >
                  {t(
                    'project-services:services-subheading.tooltip.button-learn-more'
                  )}
                </Button>
              )}
          </Stack>
        )
    }
  }

  return <IconInfoTooltip>{getContent(status)}</IconInfoTooltip>
}
