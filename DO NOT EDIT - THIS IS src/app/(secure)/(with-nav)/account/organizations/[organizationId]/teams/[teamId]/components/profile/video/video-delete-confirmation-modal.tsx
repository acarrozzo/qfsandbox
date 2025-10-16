import { useTranslation } from '@mntn-dev/i18n'
import { ConfirmationModal } from '@mntn-dev/ui-components'

export const VideoDeleteConfirmationModal = ({
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
  const { t } = useTranslation(['team-profile', 'generic'])

  return (
    <ConfirmationModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      dataTestId="video-delete-confirmation-modal"
      dataTrackingId="video-delete-confirmation-modal"
    >
      <ConfirmationModal.Header
        accent={{ name: 'error-warning', color: 'negative' }}
      >
        {t('team-profile:confirmation-modal.title')}
      </ConfirmationModal.Header>
      <ConfirmationModal.Content>
        {t('team-profile:confirmation-modal.content')}
      </ConfirmationModal.Content>
      <ConfirmationModal.Footer>
        <ConfirmationModal.CancelButton
          dataTestId="video-delete-confirmation-modal-cancel-button"
          dataTrackingId="video-delete-confirmation-modal-cancel-button"
        >
          {t('generic:cancel')}
        </ConfirmationModal.CancelButton>
        <ConfirmationModal.ConfirmButton
          loading={confirmIsLoading}
          dataTestId="video-delete-confirmation-modal-confirm-button"
          dataTrackingId="video-delete-confirmation-modal-confirm-button"
        >
          {t('team-profile:confirmation-modal.confirm-button')}
        </ConfirmationModal.ConfirmButton>
      </ConfirmationModal.Footer>
    </ConfirmationModal>
  )
}
