'use client'

import { useTranslation } from '@mntn-dev/i18n'
import { Button, Modal, PageHeader } from '@mntn-dev/ui-components'
import { defined } from '@mntn-dev/utilities'

import { usePreProductionReviewContext } from '#components/services/review/use-pre-production-review.ts'
import { getServiceSecondaryTitle } from '#components/services/review/utils.ts'

const PreProductionReviewDetailsHeader = () => {
  const {
    form: { watch },
    noteUpdateLoading,
    onSaveAndBack,
    preProductionReviewRounds,
    projectServiceId,
    projectStatus,
    proposalSaving,
    review,
    service,
    submitForm,
  } = usePreProductionReviewContext()

  const { t } = useTranslation(['edit-service', 'generic'])

  const noteValue = watch('note')

  const handleSubmitClick = () => {
    submitForm()
  }

  const crumbs = defined([
    getServiceSecondaryTitle({
      t,
      projectStatus,
      totalRounds: preProductionReviewRounds,
      review,
    }),
  ])

  return (
    <Modal.Overline>
      <PageHeader dataTestId={`service-review-modal-${projectServiceId}`}>
        <PageHeader.Main>
          <PageHeader.Overline
            dataTestId={`service-review-modal-title-info-${projectServiceId}`}
          >
            <PageHeader.OverlineLink
              onClick={onSaveAndBack}
              disabled={noteUpdateLoading}
              dataTestId={`service-review-modal-back-${projectServiceId}`}
            >
              {t('back', { ns: 'generic' })}
            </PageHeader.OverlineLink>
          </PageHeader.Overline>
          <PageHeader.TitleBreadcrumbs crumbs={[service.name, ...crumbs]} />
          <PageHeader.Subtitle subtitle={service.description} />
        </PageHeader.Main>
        <PageHeader.Controls>
          {review.acl.canSubmitProposal && (
            <Button
              disabled={!noteValue}
              onClick={handleSubmitClick}
              loading={proposalSaving}
              iconRight="arrow-right"
              dataTestId={`service-review-modal-submit-${projectServiceId}`}
            >
              {t('submit-service', { ns: 'edit-service', name: service.name })}
            </Button>
          )}
        </PageHeader.Controls>
      </PageHeader>
    </Modal.Overline>
  )
}

export { PreProductionReviewDetailsHeader }
