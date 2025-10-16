import { useTranslation } from '@mntn-dev/i18n'
import { ConfirmationModal } from '@mntn-dev/ui-components'

import { usePackageBrowserContext } from '#projects/hooks/use-package-browser.ts'

export const PackageCheckoutCancelModal = () => {
  const { t } = useTranslation(['generic', 'service-checkout'])
  const { isCanceling, setIsCanceling, onCancel } = usePackageBrowserContext()

  return (
    <ConfirmationModal
      open={isCanceling}
      onClose={() => setIsCanceling(false)}
      onConfirm={onCancel}
    >
      <ConfirmationModal.Header
        accent={{ name: 'error-warning', color: 'negative' }}
      >
        {t('cancel-order', { ns: 'service-checkout' })}
      </ConfirmationModal.Header>
      <ConfirmationModal.Content>
        {t('cancel-order-message', {
          ns: 'service-checkout',
        })}
      </ConfirmationModal.Content>
      <ConfirmationModal.Footer>
        <ConfirmationModal.CancelButton>
          {t('bring-me-back', { ns: 'service-checkout' })}
        </ConfirmationModal.CancelButton>
        <ConfirmationModal.ConfirmButton>
          {t('cancel', { ns: 'generic' })}
        </ConfirmationModal.ConfirmButton>
      </ConfirmationModal.Footer>
    </ConfirmationModal>
  )
}
