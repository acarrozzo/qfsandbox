import { useTranslation } from '@mntn-dev/i18n'
import { Heading, Text } from '@mntn-dev/ui-components'

import { ProjectFooterLayout } from '../project-footer-layout.tsx'
import { ProjectFooterNotice } from '../project-footer-notice.tsx'

export const BrandProjectBiddingFooter = () => {
  const { t } = useTranslation('project-footer')

  return (
    <ProjectFooterLayout
      left={
        <ProjectFooterNotice>
          <Heading level="h3">
            {t('brand.project-bidding-footer.notice-header')}
          </Heading>

          <Text textColor="secondary">
            {t('brand.project-bidding-footer.notice-description')}
          </Text>
        </ProjectFooterNotice>
      }
      right={null}
    />
  )
}
