'use client'

import { isCustomService } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, Surface } from '@mntn-dev/ui-components'

import { ButtonContainer } from '#components/services/service-details/common/button-container.tsx'
import { ContentContainer } from '#components/services/service-details/common/content-container.tsx'
import { ServiceNoteDisplay } from '#components/services/service-details/common/service-note-display.tsx'
import { ServiceNoteEdit } from '#components/services/service-details/common/service-note-edit.tsx'

import { useServiceDetailsContext } from '../../use-service-details.ts'

const BrandNote = () => {
  const { t } = useTranslation(['edit-service', 'generic'])

  const {
    brandNoteSaving,
    form: { watch },
    formId,
    onBack,
    projectServiceId,
    service,
  } = useServiceDetailsContext()

  const previousNote =
    service.brandNote || t('no-brand-note', { ns: 'edit-service' })

  const noteValue = watch('note')

  return (
    <Surface className="w-full p-0 gap-0 h-full overflow-hidden">
      <ContentContainer className="overflow-hidden">
        {service.acl.canEditBrandNote ? (
          <ServiceNoteEdit
            title={t('brand-note', { ns: 'edit-service' })}
            subtitle={t('brand-note-label', { ns: 'edit-service' })}
            isCustomService={isCustomService(service)}
          />
        ) : (
          <ServiceNoteDisplay note={previousNote} title={t('brand-note')} />
        )}
      </ContentContainer>
      <ButtonContainer>
        <Button
          variant="secondary"
          onClick={onBack}
          width="full"
          dataTestId={`service-edit-modal-close-${projectServiceId}`}
          dataTrackingId={`service-edit-modal-close-${projectServiceId}`}
        >
          {t('close', { ns: 'generic' })}
        </Button>
        {service.acl.canEditBrandNote && (
          <Button
            form={formId}
            disabled={!noteValue}
            loading={brandNoteSaving}
            type="submit"
            width="full"
            dataTestId={`service-edit-modal-save-${projectServiceId}`}
            dataTrackingId={`service-edit-modal-save-${projectServiceId}`}
          >
            {t('save-and-close', { ns: 'generic' })}
          </Button>
        )}
      </ButtonContainer>
    </Surface>
  )
}

export { BrandNote }
