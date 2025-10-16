'use client'

import { useTranslation } from '@mntn-dev/i18n'
import type { ConfirmationModalProps } from '@mntn-dev/ui-components'
import { ConfirmationModal } from '@mntn-dev/ui-components'
import { usePreviousDistinct } from '@mntn-dev/ui-utilities'

type PackageDeleteConfirmationModalProps = Omit<
  ConfirmationModalProps,
  'children'
> &
  Readonly<{ isDeleting: boolean }>

const PackageDeleteConfirmationModal = ({
  isDeleting,
  ...props
}: PackageDeleteConfirmationModalProps) => {
  const { t } = useTranslation(['package-delete'])

  const wasDeleting = usePreviousDistinct(isDeleting)
  const isBusy = isDeleting || wasDeleting

  return (
    <ConfirmationModal {...props}>
      <ConfirmationModal.Header
        accent={{ name: 'error-warning', color: 'negative' }}
      >
        {t('package-delete:title')}
      </ConfirmationModal.Header>
      <ConfirmationModal.Content>
        {t('package-delete:content')}
      </ConfirmationModal.Content>
      <ConfirmationModal.Footer>
        <ConfirmationModal.CancelButton disabled={isBusy}>
          {t('action.cancel')}
        </ConfirmationModal.CancelButton>
        <ConfirmationModal.ConfirmButton
          disabled={isBusy}
          loading={isBusy}
          variant="destructive"
        >
          {t('action.delete')}
        </ConfirmationModal.ConfirmButton>
      </ConfirmationModal.Footer>
    </ConfirmationModal>
  )
}

export {
  PackageDeleteConfirmationModal,
  type PackageDeleteConfirmationModalProps,
}
