import { useTranslation } from '@mntn-dev/i18n'
import { List } from '@mntn-dev/ui-components'
import { themeTextColorMap } from '@mntn-dev/ui-theme'

import { IconInfoTooltip } from '#components/shared/icon-info-tooltip.tsx'

export const ProjectDescriptionTooltip = () => {
  const { t } = useTranslation(['project-details'])

  return (
    <IconInfoTooltip>
      <List className={themeTextColorMap['primary-inverse']}>
        <List.Item>
          {t('project-details:project-description-tooltip.bullet-1')}
        </List.Item>
        <List.Item>
          {t('project-details:project-description-tooltip.bullet-2')}
        </List.Item>
        <List.Item>
          {t('project-details:project-description-tooltip.bullet-3')}
        </List.Item>
        <List.Item>
          {t('project-details:project-description-tooltip.bullet-4')}
        </List.Item>
        <List.Item>
          {t('project-details:project-description-tooltip.bullet-5')}
        </List.Item>
        <List.Item>
          {t('project-details:project-description-tooltip.bullet-6')}
        </List.Item>
        <List.Item>
          {t('project-details:project-description-tooltip.bullet-7')}
        </List.Item>
      </List>
    </IconInfoTooltip>
  )
}
