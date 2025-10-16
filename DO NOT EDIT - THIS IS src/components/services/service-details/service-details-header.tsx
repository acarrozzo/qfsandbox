'use client'

import { useState } from 'react'

import { useTranslation } from '@mntn-dev/i18n'
import { Modal, PageHeader } from '@mntn-dev/ui-components'
import { defined } from '@mntn-dev/utilities'

import { ServiceDescriptionModal } from '#components/services/service-details/service-description-modal.tsx'

import { useServiceDetailsContext } from './use-service-details.ts'

const ServiceDetailsHeader = () => {
  const { projectServiceId, projectStatus, service } =
    useServiceDetailsContext()

  const { t } = useTranslation(['edit-service', 'generic'])

  const [showServiceDescription, setShowServiceDescription] = useState(false)

  const crumbs = defined([
    projectStatus === 'draft'
      ? t('add-brand-note', { ns: 'edit-service' })
      : undefined,
  ])

  return (
    <Modal.Overline>
      <PageHeader dataTestId={`service-edit-modal-${projectServiceId}`}>
        <PageHeader.Main>
          <PageHeader.TitleBreadcrumbs crumbs={[service.name, ...crumbs]} />
          <PageHeader.Subtitle subtitle={service.description} />
        </PageHeader.Main>
      </PageHeader>

      <ServiceDescriptionModal
        name={service.name}
        onClose={() => setShowServiceDescription(false)}
        open={showServiceDescription}
        description={service.description ?? ''}
      />
    </Modal.Overline>
  )
}

export { ServiceDetailsHeader }
