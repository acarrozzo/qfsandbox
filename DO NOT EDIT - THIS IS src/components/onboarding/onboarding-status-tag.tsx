import type { OnboardingStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tag, type TagProps, type TagType } from '@mntn-dev/ui-components'

type OnboardingStatusTagProps = Omit<TagProps, 'children' | 'type'> & {
  onboardingStatus: OnboardingStatus
}

const onboardingStatusTagTypeMap: Record<OnboardingStatus, TagType> = {
  onboarded: 'success',
  onboarding: 'warning',
  'interview-failed': 'error',
}

export const OnboardingStatusTag = ({
  onboardingStatus,
  ...props
}: OnboardingStatusTagProps) => {
  const { t } = useTranslation('onboarding')

  return (
    <Tag type={onboardingStatusTagTypeMap[onboardingStatus]} {...props}>
      {t(`onboardingStatus.${onboardingStatus}`)}
    </Tag>
  )
}
