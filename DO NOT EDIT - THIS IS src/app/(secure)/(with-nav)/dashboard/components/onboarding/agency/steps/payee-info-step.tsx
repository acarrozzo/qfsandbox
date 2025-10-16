'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { OnboardingStepEnum } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Stepper } from '@mntn-dev/ui-components'

import { useMe } from '~/hooks/secure/use-me.ts'

import { StepActionButton } from './step-action-button.tsx'

const { 'payee-info': step } = OnboardingStepEnum

type Props = {
  complete: boolean
}

export const PayeeInfoStep = ({ complete }: Props) => {
  const router = useRouter()
  const { t } = useTranslation(['dashboard'])
  const {
    me: { organizationId },
  } = useMe()

  return (
    <Stepper.Step
      title={t(`dashboard:agency.onboarding.${step}.title`)}
      subtitle={t(`dashboard:agency.onboarding.${step}.subtitle`)}
      complete={complete}
    >
      <StepActionButton
        step={step}
        complete={complete}
        iconRight="chevron-right"
        onClick={() => {
          router.push(
            route(
              '/account/organizations/:organizationId/payments/setup'
            ).params({
              organizationId,
            })
          )
        }}
      >
        {t(`dashboard:agency.onboarding.${step}.action`)}
      </StepActionButton>
    </Stepper.Step>
  )
}
