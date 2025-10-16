'use client'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import { OnboardingStepEnum } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Stepper } from '@mntn-dev/ui-components'
import { first } from '@mntn-dev/utilities'

import { useMe } from '~/hooks/secure/use-me.ts'

import { StepActionButton } from './step-action-button.tsx'

const { 'profile-info': step } = OnboardingStepEnum

type Props = {
  complete: boolean
}

export const ProfileInfoStep = ({ complete }: Props) => {
  const router = useRouter()
  const {
    me: { organizationId, teamIds },
  } = useMe()
  const teamId = first(teamIds)
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
        iconRight="chevron-right"
        onClick={() => {
          router.push(
            teamId
              ? route(
                  '/account/organizations/:organizationId/teams/:teamId'
                ).params({
                  organizationId,
                  teamId,
                })
              : route('/account/organizations/:organizationId/teams').params({
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

ProfileInfoStep.step = step
