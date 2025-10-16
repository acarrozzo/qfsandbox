import type { ProjectDetailsUpdateFormModel } from '@mntn-dev/app-form-schemas'
import type {
  AfterUploadEvent,
  AfterUploadHandler,
} from '@mntn-dev/files-adapter-client'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import { useToast } from '@mntn-dev/ui-components'

import { ProjectInfoBoxEdit } from '#projects/[projectId]/components/project-details/project-info-box-edit.tsx'
import { ProjectInfoBox } from '~/components/projects/project-info-box.tsx'
import { ProjectThumbnail } from '~/components/projects/project-thumbnail.tsx'

export const ProjectInfoHeader = ({
  isEditing,
  project,
  projectServices,
  onProjectUpdate,
}: {
  isEditing: boolean
  project: ProjectWithAcl
  projectServices: ProjectServiceWithAcl[]
  onProjectUpdate: (updates: ProjectDetailsUpdateFormModel) => void
}) => {
  const { t } = useTranslation(['toast'])
  const { showToast } = useToast()
  const handleAfterUpload: AfterUploadHandler = (e: AfterUploadEvent) => {
    onProjectUpdate({
      thumbnailFileId: e.file.fileId,
    })

    showToast.info({
      title: t('toast:file.added.title'),
      body: t('toast:file.added.body'),
      dataTestId: 'file-added-info-toast',
      dataTrackingId: 'file-added-info-toast',
    })
  }

  return (
    <div className="flex items-start gap-6 self-stretch">
      <ProjectThumbnail
        project={project}
        canUpload={project.acl.canEditProject ?? false}
        size="xl"
        onAfterUpload={handleAfterUpload}
      />
      {isEditing ? (
        <ProjectInfoBoxEdit
          project={project}
          onProjectUpdate={onProjectUpdate}
        />
      ) : (
        <ProjectInfoBox project={project} projectServices={projectServices} />
      )}
    </div>
  )
}
