import { useTranslation } from '@mntn-dev/i18n'
import { Button, FullPageModal, Icon } from '@mntn-dev/ui-components'

import type { ComponentProps } from '~/types/props.ts'

type Props = ComponentProps<{
  onClose: () => void
  isLoading: boolean
}>

export const ProjectSetProductionModal = ({ onClose, isLoading }: Props) => {
  const { t } = useTranslation('project-set-production-modal')

  return (
    <FullPageModal open onClose={onClose} suppressUserClose>
      <FullPageModal.Body>
        <FullPageModal.Title>{t('title')}</FullPageModal.Title>
        <Icon name="CelebrationIcon" size="full" />
      </FullPageModal.Body>
      <FullPageModal.Footer>
        <FullPageModal.Description>
          {t('description')}
        </FullPageModal.Description>
        <Button onClick={onClose} loading={isLoading}>
          {t('close-button')}
        </Button>
      </FullPageModal.Footer>
    </FullPageModal>
  )
}
