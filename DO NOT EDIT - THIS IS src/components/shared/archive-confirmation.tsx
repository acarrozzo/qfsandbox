import { useTranslation } from '@mntn-dev/i18n'
import { ConfirmationModal, Text } from '@mntn-dev/ui-components'

type Props = {
  open: boolean
  resourceName: string
  isError: boolean
  isLoading: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ArchiveConfirmation = ({
  open,
  resourceName,
  isError,
  isLoading,
  onClose,
  onConfirm,
}: Props) => {
  const { t } = useTranslation(['archive', 'generic'])

  return (
    <ConfirmationModal
      open={open}
      suppressUserClose
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <ConfirmationModal.Header
        accent={{ name: 'error-warning', color: 'negative' }}
      >
        {t('title', { ns: 'archive' })}
      </ConfirmationModal.Header>

      <ConfirmationModal.Content>
        {t('description', { ns: 'archive', resourceName })}
      </ConfirmationModal.Content>

      {isError && (
        <Text fontWeight="medium" fontSize="base" textColor="negative">
          {t('error', { ns: 'archive', resourceName })}
        </Text>
      )}

      <ConfirmationModal.Footer>
        <ConfirmationModal.CancelButton disabled={isLoading}>
          {t('close', { ns: 'generic' })}
        </ConfirmationModal.CancelButton>
        <ConfirmationModal.ConfirmButton disabled={isLoading}>
          {t('archive', { ns: 'generic' })}
        </ConfirmationModal.ConfirmButton>
      </ConfirmationModal.Footer>
    </ConfirmationModal>
  )
}
