'use client'

import { OnboardingStepEnum } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Stepper } from '@mntn-dev/ui-components'

import { StepActionButton } from './step-action-button.tsx'

const { interview: step } = OnboardingStepEnum

type Props = {
  complete: boolean
}

export const InterviewStep = ({ complete }: Props) => {
  const { t } = useTranslation(['dashboard'])

  return (
    <Stepper.Step
      title={t(`dashboard:agency.onboarding.${step}.title`)}
      subtitle={t(`dashboard:agency.onboarding.${step}.subtitle`)}
      complete={complete}
    >
      <StepActionButton
        step={step}
        complete={complete}
        iconRight="new-tab"
        onClick={() => {
          window.open(
            process.env.NEXT_PUBLIC_ONBOARDING_INTERVIEW_URL ?? '',
            '_blank'
          )
        }}
      >
        {t(`dashboard:agency.onboarding.${step}.action`)}
      </StepActionButton>
    </Stepper.Step>
  )
}
