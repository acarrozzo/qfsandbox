import { useTranslation } from '@mntn-dev/i18n'
import { ConfirmationModal } from '@mntn-dev/ui-components'

export const RejectFinalBidConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  confirmIsLoading,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  confirmIsLoading: boolean
}) => {
  const { t } = useTranslation(['bids', 'generic'])

  return (
    <ConfirmationModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      dataTestId="reject-final-bid-confirmation-modal"
      dataTrackingId="reject-final-bid-confirmation-modal"
      dialogClassName="w-160"
    >
      <ConfirmationModal.Header
        accent={{ name: 'error-warning', color: 'caution' }}
      >
        {t('bids:out-of-bids')}
      </ConfirmationModal.Header>
      <ConfirmationModal.Content>
        {t('bids:out-of-bids-modal-content')}
      </ConfirmationModal.Content>
      <ConfirmationModal.Footer>
        <ConfirmationModal.CancelButton
          dataTestId="reject-final-bid-confirmation-modal-cancel-button"
          dataTrackingId="reject-final-bid-confirmation-modal-cancel-button"
        >
          {t('generic:cancel')}
        </ConfirmationModal.CancelButton>
        <ConfirmationModal.ConfirmButton
          loading={confirmIsLoading}
          dataTestId="reject-final-bid-confirmation-modal-confirm-button"
          dataTrackingId="reject-final-bid-confirmation-modal-confirm-button"
        >
          {t('bids:out-of-bids-modal-confirm-button')}
        </ConfirmationModal.ConfirmButton>
      </ConfirmationModal.Footer>
    </ConfirmationModal>
  )
}
