import { useMemo } from 'react'

import type { ServiceWithDeliverables } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service/client'
import {
  Collapsible,
  Heading,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'
import { themeDivideColorMap } from '@mntn-dev/ui-theme'
import { isNonEmptyArray } from '@mntn-dev/utilities'

import { ProjectMediaBladeListTooltip } from '#components/deliverables/project-media-blade-list-tooltip.tsx'
import { EmptyState } from '#components/shared/empty-state.tsx'
import { useMe } from '~/hooks/secure/use-me.ts'
import {
  getDeliverableService,
  sortDeliverablesByGroup,
} from '~/lib/deliverables/deliverable-helpers.ts'
import { getDeliverablesFromServices } from '~/lib/services/service-helpers.ts'

import { ProjectMediaBlade } from './project-media-blade.tsx'

export const ProjectMediaBladeList = ({
  project,
  review,
  services,
  finalCutsDescription,
}: {
  project: ProjectWithAcl
  review?: PostProductionSelectReviewOutput
  services: ServiceWithDeliverables<ProjectServiceWithAcl>[]
  finalCutsDescription?: string
}) => {
  const { me } = useMe()
  const { t } = useTranslation(['project-deliverables'])
  const { projectId, status: projectStatus } = project

  const { videos, files } = useMemo(
    () =>
      sortDeliverablesByGroup(getDeliverablesFromServices(services), services),
    [services]
  )

  const deliverableGroups = useMemo(
    () => [
      {
        title: `${t('project-deliverables:videos')} (${videos.length})`,
        deliverables: videos,
      },
      {
        title: `${t('project-deliverables:files')} (${files.length})`,
        deliverables: files,
      },
    ],
    [t, videos, files]
  )

  return (
    <Surface width="full" gap="0" border className="shadow-blur">
      <Surface.Header className="p-8">
        <Stack direction="col" gap="1" shrink>
          <Heading fontSize="3xl">
            {projectStatus === 'complete'
              ? t('project-deliverables:final-deliverables')
              : t('project-deliverables:deliverables')}
          </Heading>
          {finalCutsDescription && (
            <Stack gap="1" justifyContent="start" alignItems="center">
              <Text textColor="secondary">{finalCutsDescription}</Text>
              {['brand', 'agency'].includes(me.organizationType) &&
                projectStatus === 'post_production' && (
                  <ProjectMediaBladeListTooltip
                    status={projectStatus}
                    organizationType={me.organizationType}
                  />
                )}
            </Stack>
          )}
        </Stack>
      </Surface.Header>
      <Surface.Body
        className={`divide-y ${themeDivideColorMap.muted}`}
        dataTestId={`project-media-list-${projectId}`}
        dataTrackingId={`project-media-list-${projectId}`}
      >
        {!isNonEmptyArray(services) && (
          <EmptyState
            className="p-8"
            subTitle={t('project-deliverables:nothing-yet')}
          />
        )}
        {deliverableGroups.map(
          ({ title, deliverables }) =>
            isNonEmptyArray(deliverables) && (
              <Collapsible
                key={title}
                isOpen={projectStatus !== 'complete'}
                dataTestId={`project-${projectId}-deliverable-section-${title}`}
                dataTrackingId="previous-round-displayed-comment"
              >
                <Collapsible.Title title={title} />
                <Collapsible.Panel>
                  {deliverables.map((deliverable) => {
                    const service = getDeliverableService(deliverable, services)

                    return (
                      service && (
                        <ProjectMediaBlade
                          key={deliverable.deliverableId}
                          deliverable={deliverable}
                          serviceName={service.name}
                          review={review}
                          project={project}
                        />
                      )
                    )
                  })}
                </Collapsible.Panel>
              </Collapsible>
            )
        )}
      </Surface.Body>
    </Surface>
  )
}
