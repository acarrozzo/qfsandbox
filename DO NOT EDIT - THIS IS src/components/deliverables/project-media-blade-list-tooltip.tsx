import { showArticle } from '@intercom/messenger-js-sdk'

import { getBrandArticle, getMakerArticle } from '@mntn-dev/app-assets'
import type { OrganizationType, ProjectStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, List, Stack } from '@mntn-dev/ui-components'
import {
  themeBackgroundMap,
  themeHoverBackgroundMap,
  themeTextColorMap,
} from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

import { IconInfoTooltip } from '#components/shared/icon-info-tooltip.tsx'

export const ProjectMediaBladeListTooltip = ({
  status,
  organizationType,
}: {
  status: ProjectStatus
  organizationType?: OrganizationType
}) => {
  const { t } = useTranslation(['project-deliverables'])

  const onLearnMoreClick = () => {
    if (organizationType === 'agency' && status === 'post_production') {
      showArticle(getMakerArticle('post-production'))
    }

    if (organizationType === 'brand' && status === 'post_production') {
      showArticle(getBrandArticle('post-production'))
    }
  }

  const getContent = (status: ProjectStatus) => {
    if (status === 'post_production') {
      return (
        <Stack direction="col" width="64" gap="2">
          <List className={themeTextColorMap['primary-inverse']}>
            <List.Item>
              {organizationType === 'agency' &&
                t('project-deliverables:tooltip.maker-list-1')}
              {organizationType === 'brand' &&
                t('project-deliverables:tooltip.brand-list-1')}
            </List.Item>
            <List.Item>
              {organizationType === 'agency' &&
                t('project-deliverables:tooltip.maker-list-2')}
              {organizationType === 'brand' &&
                t('project-deliverables:tooltip.brand-list-2')}
            </List.Item>
          </List>
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
                {t('project-deliverables:tooltip.button-learn-more')}
              </Button>
            )}
        </Stack>
      )
    }
  }

  const content = getContent(status)
  return content && <IconInfoTooltip> {content} </IconInfoTooltip>
}
