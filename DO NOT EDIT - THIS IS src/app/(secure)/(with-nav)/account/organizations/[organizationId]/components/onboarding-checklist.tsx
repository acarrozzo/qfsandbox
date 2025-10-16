import {
  type OnboardingStep,
  type OnboardingStepStatus,
  OnboardingSteps,
  type OrganizationDomainSelectModel,
} from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Stack, Text } from '@mntn-dev/ui-components'
import { themeDivideColorMap } from '@mntn-dev/ui-theme'

import { OnboardingStepStatusTag } from '~/components/onboarding/onboarding-step-status-tag.tsx'

type OnboardingChecklistProps = {
  organization: OrganizationDomainSelectModel
  onOnboardingStatusChange: (props: {
    step: OnboardingStep
    status: OnboardingStepStatus
  }) => void
  isBusy: boolean
}

const getInverseStatus = (status: OnboardingStepStatus) =>
  status === 'completed' ? 'pending' : 'completed'

export const OnboardingChecklist = ({
  organization: { onboarding },
  onOnboardingStatusChange,
  isBusy,
}: OnboardingChecklistProps) => {
  const { t } = useTranslation(['onboarding', 'onboarding-checklist'])

  const handleStatusUpdateButtonClick =
    ({
      step,
      status,
    }: {
      step: OnboardingStep
      status: OnboardingStepStatus
    }) =>
    () => {
      onOnboardingStatusChange({
        step,
        status,
      })
    }

  const isDisabled = isBusy || onboarding.status === 'interview-failed'

  return (
    <ul className={`flex flex-col divide-y ${themeDivideColorMap.muted}`}>
      {OnboardingSteps.map((step) => {
        const status: OnboardingStepStatus =
          onboarding.status === 'interview-failed' && step === 'interview'
            ? 'failed'
            : onboarding.stepsCompleted.includes(step)
              ? 'completed'
              : 'pending'

        return (
          <li key={step} className="relative flex py-4">
            <Stack direction="col" gap="4" width="full">
              <Stack gap="4">
                <Text textColor="primary" fontWeight="bold">
                  {t(`onboarding:onboardingStep.${step}`)}
                </Text>
                <div className="grow" />
                <OnboardingStepStatusTag status={status} />
              </Stack>

              {{
                'profile-info': () => (
                  <Stack direction="col" gap="4">
                    <Text textColor="primary">
                      {t(`onboarding-checklist:description.${step}.${status}`)}
                    </Text>
                    <Button
                      size="sm"
                      variant="secondary"
                      borderColor={
                        getInverseStatus(status) === 'completed'
                          ? 'positive'
                          : 'caution'
                      }
                      width="fit"
                      onClick={handleStatusUpdateButtonClick({
                        step,
                        status: getInverseStatus(status),
                      })}
                      disabled={isDisabled}
                    >
                      {t(`onboarding-checklist:action.profile-info.${status}`)}
                    </Button>
                  </Stack>
                ),
                'payee-info': () => (
                  <Stack direction="col" gap="4">
                    <Text textColor="primary">
                      {t(`onboarding-checklist:description.${step}.${status}`)}
                    </Text>
                    <Button
                      size="sm"
                      variant="secondary"
                      borderColor={
                        getInverseStatus(status) === 'completed'
                          ? 'positive'
                          : 'caution'
                      }
                      width="fit"
                      onClick={handleStatusUpdateButtonClick({
                        step,
                        status: getInverseStatus(status),
                      })}
                      disabled={isDisabled}
                    >
                      {t(`onboarding-checklist:action.payee-info.${status}`)}
                    </Button>
                  </Stack>
                ),
                certification: () => (
                  <Stack direction="col" gap="4">
                    <Text textColor="primary">
                      {t(`onboarding-checklist:description.${step}.${status}`)}
                    </Text>
                    <Button
                      size="sm"
                      variant="secondary"
                      borderColor={
                        getInverseStatus(status) === 'completed'
                          ? 'positive'
                          : 'caution'
                      }
                      width="fit"
                      onClick={handleStatusUpdateButtonClick({
                        step,
                        status: getInverseStatus(status),
                      })}
                      disabled={isDisabled}
                    >
                      {t(`onboarding-checklist:action.certification.${status}`)}
                    </Button>
                  </Stack>
                ),
                interview: () => (
                  <Stack direction="col" gap="4">
                    <Text textColor="primary">
                      {t(`onboarding-checklist:description.${step}.${status}`)}
                    </Text>

                    <Stack gap="4">
                      {status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            borderColor="positive"
                            width="fit"
                            onClick={handleStatusUpdateButtonClick({
                              step,
                              status: 'completed',
                            })}
                            disabled={isDisabled}
                          >
                            {t(
                              'onboarding-checklist:action.interview.completed'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            borderColor="negative"
                            width="fit"
                            onClick={handleStatusUpdateButtonClick({
                              step,
                              status: 'failed',
                            })}
                            disabled={isDisabled}
                          >
                            {t('onboarding-checklist:action.interview.failed')}
                          </Button>
                        </>
                      )}
                      {['completed', 'failed'].includes(status) && (
                        <Button
                          size="sm"
                          variant="secondary"
                          borderColor="caution"
                          width="fit"
                          onClick={handleStatusUpdateButtonClick({
                            step,
                            status: 'pending',
                          })}
                          disabled={isBusy}
                        >
                          {t('onboarding-checklist:action.interview.pending')}
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                ),
              }[step]()}
            </Stack>
          </li>
        )
      })}
    </ul>
  )
}
