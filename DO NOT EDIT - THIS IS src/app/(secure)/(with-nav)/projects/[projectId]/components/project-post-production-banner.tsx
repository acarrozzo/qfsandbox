import { useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { projectPostProductionReviewRoute } from '@mntn-dev/app-routing'
import type { ServiceWithDeliverables } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import type { PostProductionSelectReviewOutput } from '@mntn-dev/review-service'
import {
  Button,
  Heading,
  Icon,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'
import { themeBorderColorMap } from '@mntn-dev/ui-theme'

import {
  getPostProductionProjectBanner,
  isLeavingFeedback,
  isLeavingProposal,
} from '#utils/project/review-helpers.ts'
import { sortDeliverablesByGroup } from '~/lib/deliverables/deliverable-helpers.ts'
import { getDeliverablesFromServices } from '~/lib/services/service-helpers.ts'

export const ProjectPostProductionBanner = ({
  project,
  deliverableServices,
  review,
}: {
  project: ProjectWithAcl
  deliverableServices: ServiceWithDeliverables<ProjectServiceWithAcl>[]
  review: PostProductionSelectReviewOutput
}) => {
  const { t } = useTranslation(['projects'])
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)

  if (!(isLeavingFeedback(review) || isLeavingProposal(review))) {
    return
  }

  const deliverables = getDeliverablesFromServices(deliverableServices)
  const sortedDeliverables = sortDeliverablesByGroup(
    deliverables,
    deliverableServices
  )

  // This takes the first video, even if it's already approved
  const firstDeliverable = sortedDeliverables.videos[0]
  if (!firstDeliverable) {
    return
  }

  const { button, header, subTitle } = getPostProductionProjectBanner(
    review,
    project,
    deliverables,
    t
  )

  const handleButtonClick = () => {
    setLoading(true)
    router.push(
      projectPostProductionReviewRoute({
        projectId: project.projectId,
        deliverableId: firstDeliverable.deliverableId,
      })
    )
  }

  return (
    <Surface
      padding="8"
      marginBottom="8"
      className="shadow-blur"
      dataTestId={`post-production-project-${project.projectId}-banner`}
    >
      <Surface.Body
        className={`flex flex-col gap-8 text-center border rounded-lg ${themeBorderColorMap.muted}`}
      >
        <Stack
          direction="col"
          gap="8"
          justifyContent="center"
          alignItems="center"
        >
          <Stack
            direction="col"
            gap="4"
            justifyContent="center"
            alignItems="center"
          >
            <Icon
              fill="outline"
              name="error-warning"
              size="5xl"
              color="caution"
            />
            <Stack direction="col" gap="2">
              <Heading fontSize="2xl">{header}</Heading>
              <Text fontSize="sm" textColor="secondary">
                {subTitle}
              </Text>
            </Stack>
          </Stack>

          <Button
            onClick={handleButtonClick}
            dataTestId="project-details-post-production-continue-button"
            size="md"
            loading={isLoading}
          >
            {button}
          </Button>
        </Stack>
      </Surface.Body>
    </Surface>
  )
}
