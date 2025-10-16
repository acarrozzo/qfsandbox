import { useTranslation } from '@mntn-dev/i18n'
import { ConfirmationModal } from '@mntn-dev/ui-components'

export const BidWithdrawConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  confirmIsLoading,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  confirmIsLoading: boolean
}) => {
  const { t } = useTranslation(['bids', 'generic'])

  return (
    <ConfirmationModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      dataTestId="bid-withdraw-confirmation-modal"
      dataTrackingId="bid-withdraw-confirmation-modal"
    >
      <ConfirmationModal.Header
        accent={{ name: 'error-warning', color: 'caution' }}
      >
        {t('bids:withdraw-bid')}
      </ConfirmationModal.Header>
      <ConfirmationModal.Content>
        {t('bids:withdraw-bid-modal-content')}
      </ConfirmationModal.Content>
      <ConfirmationModal.Footer>
        <ConfirmationModal.CancelButton
          dataTestId="bid-withdraw-confirmation-modal-cancel-button"
          dataTrackingId="bid-withdraw-confirmation-modal-cancel-button"
        >
          {t('generic:cancel')}
        </ConfirmationModal.CancelButton>
        <ConfirmationModal.ConfirmButton
          loading={confirmIsLoading}
          dataTestId="bid-withdraw-confirmation-modal-confirm-button"
          dataTrackingId="bid-withdraw-confirmation-modal-confirm-button"
        >
          {t('bids:withdraw-bid-modal-confirm-button')}
        </ConfirmationModal.ConfirmButton>
      </ConfirmationModal.Footer>
    </ConfirmationModal>
  )
}
