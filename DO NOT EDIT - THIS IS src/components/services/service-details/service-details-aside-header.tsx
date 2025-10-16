'use client'

import { ProjectServiceUrn } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Heading, Text, useToast } from '@mntn-dev/ui-components'

import { FileUploadButton } from '~/components/projects/file-upload-button.tsx'

import { useServiceDetailsContext } from './use-service-details.ts'

const ServiceDetailsAsideHeader = () => {
  const { filesQuery, projectServiceId, service } = useServiceDetailsContext()

  const { t } = useTranslation(['edit-service', 'toast'])

  const { showToast } = useToast()

  const showAddFileButton = service.acl.canEditBrandNote

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
    <div className="flex justify-between w-full gap-2 pt-4 pb-6">
      <div className="flex flex-col items-start gap-2">
        <Heading
          fontSize="xl"
          dataTestId="service-files-header-title"
          dataTrackingId="service-files-header-title"
        >
          {t('files', { ns: 'edit-service' })}
        </Heading>
        <Text
          textColor="secondary"
          dataTestId="service-files-header-subtitle"
          dataTrackingId="service-files-header-subtitle"
        >
          {t('view-add-reference-files', { ns: 'edit-service' })}
        </Text>
      </div>

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

export { ServiceDetailsAsideHeader }
