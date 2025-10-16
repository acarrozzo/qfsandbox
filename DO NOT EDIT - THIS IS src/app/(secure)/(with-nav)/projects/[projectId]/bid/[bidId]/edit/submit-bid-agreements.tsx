'use client'

import { Stack } from '@mntn-dev/ui-components'

import { useBidContext } from '../../hooks/use-bid.ts'
import { MakerTermsAcceptedAgreement } from './make-terms-accepted-agreement.tsx'
import { MakerProjectPaymentTermsAgreement } from './maker-project-payment-terms-agreement.tsx'

type Props = {
  disabled: boolean
}

export const SubmitBidAgreements = ({ disabled }: Props) => {
  const {
    bidForm: {
      formState: { errors },
    },
  } = useBidContext()

  return (
    <Stack direction="col" gap="4">
      <MakerTermsAcceptedAgreement
        disabled={disabled}
        suppressErrorMessage={!!errors.makerProjectPaymentTermsAccepted}
      />
      <MakerProjectPaymentTermsAgreement disabled={disabled} />
    </Stack>
  )
}
