import type { OnboardingStep } from '@mntn-dev/domain-types'

import { CertificationStep } from './certification-step.tsx'
import { InterviewStep } from './interview-step.tsx'
import { PayeeInfoStep } from './payee-info-step.tsx'
import { ProfileInfoStep } from './profile-info-step.tsx'

export const getStepComponent = (step: OnboardingStep) =>
  ({
    'profile-info': ProfileInfoStep,
    'payee-info': PayeeInfoStep,
    certification: CertificationStep,
    interview: InterviewStep,
  })[step]
