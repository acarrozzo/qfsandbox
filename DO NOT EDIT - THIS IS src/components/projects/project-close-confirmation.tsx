import { useTranslation } from '@mntn-dev/i18n'
import { ConfirmationModal } from '@mntn-dev/ui-components'

export const ProjectCloseConfirmation = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: {
  open: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}) => {
  const { t } = useTranslation(['project-close'])
  return (
    <ConfirmationModal open={open} onClose={onClose} onConfirm={onConfirm}>
      <ConfirmationModal.Header
        accent={{ name: 'error-warning', color: 'negative' }}
      >
        {t('project-close:title')}
      </ConfirmationModal.Header>
      <ConfirmationModal.Content>
        {t('project-close:content')}
      </ConfirmationModal.Content>
      <ConfirmationModal.Footer>
        <ConfirmationModal.CancelButton disabled={isLoading}>
          {t('project-close:action.cancel')}
        </ConfirmationModal.CancelButton>
        <ConfirmationModal.ConfirmButton
          disabled={isLoading}
          loading={isLoading}
          variant="destructive"
        >
          {t('project-close:action.close')}
        </ConfirmationModal.ConfirmButton>
      </ConfirmationModal.Footer>
    </ConfirmationModal>
  )
}
