import { DescriptionFieldModal } from '@mntn-dev/app-ui-components/description-field-modal'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, FieldModal, RichText } from '@mntn-dev/ui-components'

export const ServiceDescriptionModal = ({
  name,
  description,
  onClose,
  open,
}: {
  name: string
  description?: string
  onClose: () => void
  open: boolean
}) => {
  const { t } = useTranslation('generic')

  return (
    <DescriptionFieldModal onClose={onClose} open={open}>
      <FieldModal.Title>{name}</FieldModal.Title>
      <FieldModal.Main>
        <FieldModal.Controls>
          <RichText value={description} />
        </FieldModal.Controls>
        <FieldModal.Buttons>
          <Button variant="secondary" size="sm" onClick={onClose}>
            {t('close')}
          </Button>
        </FieldModal.Buttons>
      </FieldModal.Main>
    </DescriptionFieldModal>
  )
}
