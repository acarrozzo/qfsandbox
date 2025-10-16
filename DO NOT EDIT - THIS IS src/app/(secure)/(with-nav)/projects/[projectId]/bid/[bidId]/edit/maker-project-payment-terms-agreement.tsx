'use client'

import { useController } from '@mntn-dev/forms'
import { useTranslation } from '@mntn-dev/i18n'
import { FormField } from '@mntn-dev/ui-components'

import { useBidContext } from '../../hooks/use-bid.ts'
import { BidAgreement } from '../bid-agreement.tsx'

type Props = {
  disabled: boolean
}

export const MakerProjectPaymentTermsAgreement = ({ disabled }: Props) => {
  const { t } = useTranslation(['bids'])

  const {
    agreements: { makerProjectPaymentTerms },
    bidForm: { control },
  } = useBidContext()

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: 'makerProjectPaymentTermsAccepted',
    rules: { required: t('bids:terms-required-error') },
  })

  return (
    <FormField hasError={!!error}>
      <BidAgreement
        agreementType="maker-project-payment-terms"
        disabled={!makerProjectPaymentTerms?.link || disabled}
        href={makerProjectPaymentTerms?.link}
        {...field}
      />
      <FormField.Error>{error?.message}</FormField.Error>
    </FormField>
  )
}
