import type { OnboardingStepStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tag, type TagProps, type TagType } from '@mntn-dev/ui-components'

type OnboardingStepStatusTagProps = Omit<TagProps, 'children' | 'type'> & {
  status: OnboardingStepStatus
}

const onboardingStepStatusTagTypeMap: Record<OnboardingStepStatus, TagType> = {
  completed: 'success',
  pending: 'warning',
  failed: 'error',
}

export const OnboardingStepStatusTag = ({
  status,
  ...props
}: OnboardingStepStatusTagProps) => {
  const { t } = useTranslation('onboarding')
  return (
    <Tag type={onboardingStepStatusTagTypeMap[status]} {...props}>
      {t(`onboardingStepStatus.${status}`)}
    </Tag>
  )
}
