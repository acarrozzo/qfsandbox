import type { ProjectStatus } from '@mntn-dev/domain-types'
import type { ProjectServiceWithAcl } from '@mntn-dev/project-service'
import type { PreProductionSelectReviewOutput } from '@mntn-dev/review-service'
import { Blade, Icon, PopoutMenu, Stack, Text } from '@mntn-dev/ui-components'
import { isDefined } from '@mntn-dev/utilities'

import { getTotalNoteCount } from '#utils/project/review-helpers.ts'
import { getDeliverableName } from '~/lib/deliverables/deliverable-helpers.ts'

import { requiresCustomServiceBrandNote } from '../../../lib/services/service-helpers.ts'
import { ProjectServiceBladeTag } from './project-service-blade-tag.tsx'

type BladeProjectInfoProps = Readonly<{
  service: ProjectServiceWithAcl
  projectStatus: ProjectStatus
  review?: PreProductionSelectReviewOutput
  onRemove: () => void
  onServiceClick: (hasReview: boolean) => void
  showDescriptionClick: () => void
}>

export const ProjectServiceBlade = ({
  service,
  projectStatus,
  review,
  onRemove,
  onServiceClick,
  showDescriptionClick,
}: BladeProjectInfoProps) => {
  const canOpen =
    service.preProductionReview ||
    requiresCustomServiceBrandNote(projectStatus, service) ||
    isDefined(service.brandNote)

  const canBeRemoved = service.acl.canRemoveFromProject

  const totalNotes = getTotalNoteCount({ review, service })

  const handleRemoveClick = () => {
    onRemove()
  }

  const handleServiceClick = () => {
    if (canOpen) {
      onServiceClick(isDefined(review))
    } else {
      showDescriptionClick()
    }
  }

  return (
    <Blade
      gap="4"
      type="service"
      hasHoverState={true}
      onClick={handleServiceClick}
      dataTestId={`project-service-blade-${service.projectServiceId}`}
      dataTrackingId={`project-service-blade-${service.projectServiceId}`}
    >
      <Blade.Column
        justifyContent="start"
        alignItems="start"
        direction="col"
        paddingX="8"
        paddingY="2"
        grow
        shrink
      >
        <Blade.Title
          fontSize="base"
          dataTestId={`project-service-blade-title-${service.projectServiceId}`}
          dataTrackingId={`project-service-blade-title-${service.projectServiceId}`}
        >
          {service.name}
        </Blade.Title>
        {service.deliverables && service.deliverables.length > 0 && (
          <Stack direction="col" paddingTop="1.5" gap="1">
            {service.deliverables.map((deliverable) => (
              <Stack key={deliverable.deliverableId} gap="1">
                <Icon
                  name={
                    deliverable.details.category === 'video'
                      ? 'play-large'
                      : 'file'
                  }
                  color="secondary"
                  size="sm"
                />
                <Text fontSize="xs" textColor="secondary">
                  {getDeliverableName(deliverable.details, service.name)}
                </Text>
              </Stack>
            ))}
          </Stack>
        )}
      </Blade.Column>
      <Blade.Column justifyContent="end">
        <ProjectServiceBladeTag
          review={review}
          service={service}
          projectStatus={projectStatus}
        />
      </Blade.Column>
      <Blade.Column justifyContent="end">
        {projectStatus !== 'draft' && (
          <Blade.Chat numberOfComments={totalNotes} />
        )}
      </Blade.Column>
      <Blade.Column justifyContent="center" width="16" paddingX="2">
        {
          <PopoutMenu
            dataTestId={`project-service-blade-menu-${service.projectServiceId}`}
            dataTrackingId={`project-service-blade-menu-${service.projectServiceId}`}
          >
            <PopoutMenu.Item
              leftIcon="eye"
              onClick={handleServiceClick}
              dataTestId={`project-service-blade-view-${service.projectServiceId}`}
              dataTrackingId={`project-service-blade-view-${service.projectServiceId}`}
            >
              View
            </PopoutMenu.Item>
            {canBeRemoved && (
              <PopoutMenu.Item
                leftIcon={{ name: 'delete-bin', color: 'negative' }}
                onClick={handleRemoveClick}
                dataTestId={`project-service-blade-remove-${service.projectServiceId}`}
                dataTrackingId={`project-service-blade-remove-${service.projectServiceId}`}
              >
                Delete
              </PopoutMenu.Item>
            )}
          </PopoutMenu>
        }
      </Blade.Column>
    </Blade>
  )
}
