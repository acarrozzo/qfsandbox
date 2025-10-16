import type { ExchangeUnit } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { FormModal, Heading, Text } from '@mntn-dev/ui-components'

import { useCurrency } from '#utils/use-currency.ts'

export const AcceptBidConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  confirmIsLoading,
  chargeToCredits,
  chargeToInvoice,
  chargeToCard,
  totalDollars,
  creditUnits,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  confirmIsLoading: boolean
  chargeToCredits: number
  chargeToInvoice: number
  chargeToCard: number
  totalDollars: number
  creditUnits?: ExchangeUnit
}) => {
  const { t } = useTranslation(['bids', 'generic', 'toast'])
  const { currency } = useCurrency()
  const payingWithCredits = !!chargeToCredits
  const payingByInvoice = !!chargeToInvoice
  const payingByCreditCard = !!chargeToCard && !chargeToInvoice
  const dollarCurrency = currency(totalDollars || 0)

  const renderChargeDetails = () => {
    if (payingWithCredits && creditUnits === 'mntn_credits') {
      if (payingByInvoice || payingByCreditCard) {
        return (
          <>
            <Heading fontSize="2xl">
              {`${chargeToCredits} ${t(`bids:billing-methods.${creditUnits ?? 'default'}`)} + ${dollarCurrency}`}
            </Heading>
            <Text textColor="secondary">
              {payingByCreditCard
                ? t('bids:accept-bid-modal.credits-and-card-remainder')
                : t('bids:accept-bid-modal.credits-and-invoice-remainder')}
            </Text>
          </>
        )
      }

      return (
        <>
          <Text textColor="secondary">
            {t('bids:accept-bid-modal.credits')}
          </Text>
          <Heading fontSize="2xl">
            {`${chargeToCredits} ${t(`bids:billing-methods.${creditUnits ?? 'default'}`)}`}
          </Heading>
        </>
      )
    }

    if (payingByInvoice || payingByCreditCard) {
      return (
        <>
          {payingByInvoice && (
            <Text textColor="secondary">
              {t('bids:accept-bid-modal.invoice')}
            </Text>
          )}
          <Heading fontSize="2xl">{dollarCurrency}</Heading>
          {payingByCreditCard && (
            <Text textColor="secondary">
              {t('bids:accept-bid-modal.credit-card')}
            </Text>
          )}
        </>
      )
    }

    return null
  }

  const chargeDetails = renderChargeDetails()

  return (
    <FormModal
      open={open}
      onClose={onClose}
      dataTestId="accept-bid-confirmation-modal"
      dataTrackingId="accept-bid-confirmation-modal"
    >
      <FormModal.Header title={t('bids:accept-bid')} />
      <FormModal.Body>
        <div className="flex flex-col gap-6">
          {chargeDetails && (
            <div className="flex flex-col">{chargeDetails}</div>
          )}
          <div className="flex flex-col">
            <Text textColor="brand">
              {t('bids:accept-bid-modal.agreement')}
            </Text>
          </div>
        </div>
      </FormModal.Body>
      <FormModal.Footer>
        <FormModal.AcceptButton
          loading={confirmIsLoading}
          onClick={onConfirm}
          dataTestId="accept-bid-confirmation-modal-confirm-button"
          dataTrackingId="accept-bid-confirmation-modal-confirm-button"
        >
          {t('bids:accept-bid')}
        </FormModal.AcceptButton>
        <FormModal.CancelButton
          onClick={onClose}
          dataTestId="accept-bid-confirmation-modal-cancel-button"
          dataTrackingId="accept-bid-confirmation-modal-cancel-button"
        >
          {t('generic:cancel')}
        </FormModal.CancelButton>
      </FormModal.Footer>
    </FormModal>
  )
}
