import { useState } from 'react'

import type { ProjectDomainQueryModel } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, FullPageModal } from '@mntn-dev/ui-components'

import { ProjectThumbnail } from '~/components/projects/project-thumbnail.tsx'
import type { ComponentProps } from '~/types/props.ts'
import { evaluateStatus } from '~/utils/status-helpers.ts'

type Props = ComponentProps<{
  project: Pick<
    ProjectDomainQueryModel,
    'projectId' | 'status' | 'thumbnailFileId'
  >
  onClose?: () => void
}>

export const ProjectSubmittedCelebrationModal = ({
  project,
  onClose,
}: Props) => {
  const { t } = useTranslation('project-submitted-modal')
  const [isOpen, setIsOpen] = useState(true)
  const { isBiddingOpen } = evaluateStatus(project.status)

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const getDescription = () => {
    if (isBiddingOpen) {
      return t('description-maker-bidding')
    }

    return t('description')
  }

  return (
    <FullPageModal open={isOpen} onClose={handleClose}>
      <FullPageModal.Body>
        <FullPageModal.Title>{t('title')}</FullPageModal.Title>

        {project.thumbnailFileId && (
          <ProjectThumbnail canUpload={false} project={project} size="md" />
        )}

        <FullPageModal.Subtitle>{t('subtitle')}</FullPageModal.Subtitle>
      </FullPageModal.Body>

      <FullPageModal.Footer>
        <FullPageModal.Description>
          {getDescription()}
        </FullPageModal.Description>

        <Button onClick={handleClose}>{t('close-button')}</Button>
      </FullPageModal.Footer>
    </FullPageModal>
  )
}
