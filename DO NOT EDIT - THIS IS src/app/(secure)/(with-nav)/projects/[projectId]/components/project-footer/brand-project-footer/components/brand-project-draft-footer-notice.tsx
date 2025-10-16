'use client'

import { useTranslation } from '@mntn-dev/i18n'
import { Text } from '@mntn-dev/ui-components'

import { ProjectFooterNotice } from '../../project-footer-notice.tsx'

export const BrandProjectDraftFooterNotice = ({
  customServiceCount = 0,
}: {
  customServiceCount?: number
}) => {
  const { t } = useTranslation('project-footer')

  return (
    <ProjectFooterNotice>
      <Text textColor="secondary">
        {t('brand.project-draft-footer.notice-description', {
          count: customServiceCount,
        })}
      </Text>
    </ProjectFooterNotice>
  )
}
