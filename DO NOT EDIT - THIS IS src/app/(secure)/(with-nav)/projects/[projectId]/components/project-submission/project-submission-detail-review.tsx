import { isCustomService } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import { Heading, List, RichText, Surface, Text } from '@mntn-dev/ui-components'

import { ProjectSubmissionBasicInfo } from '#projects/[projectId]/components/project-submission/project-submission-basic-info.tsx'
import { isIncludedRoundOfFeedback } from '~/lib/services/service-helpers.ts'

export const ProjectSubmissionDetailReview = ({
  project,
  services,
}: {
  project: ProjectWithAcl
  services: ProjectServiceWithAcl[]
}) => {
  const { t } = useTranslation(['project-details', 'project-services'])
  return (
    <Surface
      border
      className="w-full min-h-full flex flex-col divide-y divide-subtle"
    >
      <ProjectSubmissionBasicInfo project={project} />
      <div className="w-full h-full overflow-y-auto p-8 flex-1">
        <div className="flex flex-col gap-4 whitespace-pre text-left">
          <Heading fontSize="2xl">
            {t('description', { ns: 'project-details' })}
          </Heading>

          <RichText bounded value={project.description} />
        </div>
      </div>
      <div className="w-full h-min p-8 flex-initial">
        <div className="flex flex-col gap-4 pb-4 text-left">
          <Heading fontSize="2xl">
            {t('services', { ns: 'project-services' })}
          </Heading>

          {/* todo: Styled UI List Component? */}
          <List className="columns-2">
            {services.map(
              (service) =>
                !isIncludedRoundOfFeedback(service) && (
                  <List.Item key={service.projectServiceId}>
                    <span className="inline-flex gap-x-1">
                      {service.name}
                      {isCustomService(service) && (
                        <Text className="lowercase" textColor="notice">
                          ({t('custom', { ns: 'project-services' })})
                        </Text>
                      )}
                    </span>
                  </List.Item>
                )
            )}
          </List>
        </div>
      </div>
    </Surface>
  )
}
