'use client'

import React, { useMemo } from 'react'

import { type OnboardingStep, OnboardingSteps } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Stepper, Text } from '@mntn-dev/ui-components'

import { useMe } from '~/hooks/secure/use-me.ts'

import { getStepComponent } from './steps/get-step-component.ts'

export function AgencyOnboarding() {
  const { t } = useTranslation(['dashboard'])
  const {
    me: { organization, firstName, organizationType },
  } = useMe()

  const showOnboarding = useMemo(
    () =>
      organization?.onboarding.status !== 'onboarded' &&
      organizationType === 'agency',
    [organization, organizationType]
  )

  const stepsCompleted = new Set<OnboardingStep>(
    organization?.onboarding.stepsCompleted ?? []
  )
  const isRejected = organization?.onboarding.status === 'interview-failed'

  if (!showOnboarding) {
    return null
  }

  return (
    <div className="w-full mb-16">
      {isRejected ? (
        <Text
          dataTestId="agency-onboarding-rejection-message"
          dataTrackingId="agency-onboarding-rejection-message"
          textColor="secondary"
        >
          {t('dashboard:agency.onboarding.rejection-message', { firstName })
            .split('\n')
            .map((line, i) => (
              <React.Fragment
                key={`line-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: Relax, it's all we have.
                  i
                }`}
              >
                {line}
                <br />
              </React.Fragment>
            ))}
        </Text>
      ) : (
        <Stepper
          title={t('dashboard:agency.onboarding.title')}
          subtitle={t('dashboard:agency.onboarding.subtitle')}
          completed={stepsCompleted.size}
          total={OnboardingSteps.length}
        >
          {OnboardingSteps.map((step) => {
            const StepComponent = getStepComponent(step)
            return (
              <StepComponent key={step} complete={stepsCompleted.has(step)} />
            )
          })}
        </Stepper>
      )}
    </div>
  )
}
