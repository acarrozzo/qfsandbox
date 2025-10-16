'use client'

import { useController } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField } from '@mntn-dev/ui-components'

import { useBidContext } from '../../hooks/use-bid.ts'
import { BidAgreement } from '../bid-agreement.tsx'

type Props = {
  disabled: boolean
  suppressErrorMessage: boolean
}

export const MakerTermsAcceptedAgreement = ({
  disabled,
  suppressErrorMessage,
}: Props) => {
  const { t } = useTranslation(['bids'])

  const {
    agreements: { makerTerms },
    bidForm: { control },
  } = useBidContext()

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: 'makerTermsAccepted',
    rules: { required: t('bids:terms-required-error') },
  })

  return (
    <FormField hasError={!!error}>
      <BidAgreement
        agreementType="maker-terms"
        disabled={!makerTerms?.link || disabled}
        href={makerTerms?.link}
        {...field}
      />
      {!suppressErrorMessage && (
        <FormField.Error>{error?.message}</FormField.Error>
      )}
    </FormField>
  )
}
