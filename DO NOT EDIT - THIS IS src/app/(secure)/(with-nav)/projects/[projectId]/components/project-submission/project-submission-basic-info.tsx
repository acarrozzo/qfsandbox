import { FormattedDate } from '@mntn-dev/app-ui-components'
import { useTranslation } from '@mntn-dev/i18n'
import type { ProjectWithAcl } from '@mntn-dev/project-service'
import { DataList, Stack } from '@mntn-dev/ui-components'

import { ProjectThumbnail } from '~/components/projects/project-thumbnail.tsx'

export const ProjectSubmissionBasicInfo = ({
  project,
}: {
  project: ProjectWithAcl
}) => {
  const { t } = useTranslation('project-details')

  return (
    <div className="w-full h-min p-8 flex-initial">
      <Stack gap="8">
        {project.thumbnailFileId && (
          <ProjectThumbnail canUpload={false} project={project} size="sm" />
        )}

        <DataList fontSize="sm" columnCount={6} className="grow">
          <DataList.Item columnSpan={6}>
            <DataList.Title>{t('type')}</DataList.Title>
            <DataList.Description maxHeight="44">
              {project.inherited.package.name}
            </DataList.Description>
          </DataList.Item>
          <DataList.Item columnSpan={2}>
            <DataList.Title>{t('bidding-close-date')}</DataList.Title>
            <DataList.Description>
              <FormattedDate
                date={project.biddingCloseDate}
                format="medium-date-alt"
                uppercase
              />
            </DataList.Description>
          </DataList.Item>
          <DataList.Item columnSpan={2}>
            <DataList.Title>{t('due-date')}</DataList.Title>
            <DataList.Description>
              <FormattedDate
                date={project.dueDate}
                format="medium-date-alt"
                uppercase
              />
            </DataList.Description>
          </DataList.Item>
          {project.brandCompanyName && (
            <DataList.Item columnSpan={2}>
              <DataList.Title>{t('team')}</DataList.Title>
              <DataList.Description>
                {project.brandCompanyName}
              </DataList.Description>
            </DataList.Item>
          )}
        </DataList>
      </Stack>
    </div>
  )
}
