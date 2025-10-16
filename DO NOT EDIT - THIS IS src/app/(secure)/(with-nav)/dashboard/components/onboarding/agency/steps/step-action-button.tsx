import type { OnboardingStep } from '@mntn-dev/domain-types'
import { Button, type ButtonProps } from '@mntn-dev/ui-components'

type Props = ButtonProps & {
  step: OnboardingStep
  complete: boolean
}

const baseActionProps: ButtonProps = {
  size: 'sm',
  width: '40',
}

const completeActionProps: ButtonProps = {
  ...baseActionProps,
  iconLeft: 'check',
  iconColor: 'positive',
  variant: 'secondary',
}

export const StepActionButton = ({
  step,
  complete,
  onClick,
  ...buttonProps
}: Props) => {
  const getProps = (): ButtonProps => {
    return { ...(complete ? completeActionProps : baseActionProps), onClick }
  }

  const dataId = `agency-onboarding-${step}-button-${complete ? 'complete' : 'incomplete'}`

  return (
    <Button
      dataTestId={dataId}
      dataTrackingId={dataId}
      {...getProps()}
      {...buttonProps}
    />
  )
}
