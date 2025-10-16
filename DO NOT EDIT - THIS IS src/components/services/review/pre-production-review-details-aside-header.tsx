'use client'

import { ProjectServiceUrn } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Tabs, useToast } from '@mntn-dev/ui-components'
import { cn } from '@mntn-dev/ui-utilities'

import { FileUploadButton } from '#components/projects/file-upload-button.tsx'
import {
  type AsideTab,
  usePreProductionReviewContext,
} from '#components/services/review/use-pre-production-review.ts'

const PreProductionReviewDetailsAsideHeader = () => {
  const {
    currentAsideTab,
    filesQuery,
    projectServiceId,
    review,
    setCurrentAsideTab,
  } = usePreProductionReviewContext()

  const { t } = useTranslation(['edit-service', 'toast'])

  const { showToast } = useToast()

  const showAddFileButton =
    review.acl.canUpdateFeedback || review.acl.canUpdateProposal

  const folderUrn = ProjectServiceUrn(projectServiceId)

  const handleAfterUpload = () => {
    filesQuery.refetch()

    showToast.info({
      title: t('toast:file.added.title'),
      body: t('toast:file.added.body'),
      dataTestId: 'file-added-info-toast',
      dataTrackingId: 'file-added-info-toast',
    })
  }

  return (
    <div className={cn('flex justify-between w-full')}>
      <Tabs<AsideTab>
        current={currentAsideTab}
        onClick={(id) => setCurrentAsideTab(id)}
        dataTestId="service-files-tabs"
        dataTrackingId="service-files-tabs"
      >
        <Tabs.Tab
          id="files"
          name={t('files', { ns: 'edit-service' })}
          dataTestId="service-files-tab-files"
          dataTrackingId="service-files-tab-files"
        />
        <Tabs.Tab
          id="activity"
          name={t('activity', { ns: 'edit-service' })}
          dataTestId="service-files-tab-activity"
          dataTrackingId="service-files-tab-activity"
        />
      </Tabs>
      {showAddFileButton && (
        <div className="flex justify-center items-start">
          <FileUploadButton
            fileArea="projects.services.assets.reference"
            folderUrn={folderUrn}
            onAfterUpload={handleAfterUpload}
            variant="secondary"
            iconLeft="add"
          >
            {t('add-file', { ns: 'edit-service' })}
          </FileUploadButton>
        </div>
      )}
    </div>
  )
}

export { PreProductionReviewDetailsAsideHeader }
