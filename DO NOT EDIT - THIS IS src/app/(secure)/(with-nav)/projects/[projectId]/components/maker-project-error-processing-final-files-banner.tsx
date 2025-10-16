import { useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { projectPostProductionReviewRoute } from '@mntn-dev/app-routing'
import type { ServiceWithDeliverables } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import {
  Button,
  Heading,
  Icon,
  Stack,
  Surface,
  Text,
} from '@mntn-dev/ui-components'
import { themeBorderColorMap } from '@mntn-dev/ui-theme'

import { getDeliverablesFromServices } from '~/lib/services/service-helpers.ts'

export const MakerProjectErrorProcessingFinalFilesBanner = ({
  project,
  deliverableServices,
}: {
  project: ProjectWithAcl
  deliverableServices: ServiceWithDeliverables<ProjectServiceWithAcl>[]
}) => {
  const { t } = useTranslation(['projects', 'post-production-review'])
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)

  const deliverables = getDeliverablesFromServices(deliverableServices)

  const firstDeliverable = deliverables[0]
  if (!firstDeliverable) {
    return
  }

  const handleButtonClick = () => {
    setLoading(true)
    router.push(
      projectPostProductionReviewRoute({
        projectId: project.projectId,
        deliverableId: firstDeliverable.deliverableId,
      })
    )
  }

  const heading = t('banners.project-complete')

  const infoText = t('banners.deliverables-are-pending', {
    adjective: t('banners.your'),
  })

  const buttonText = t('banners.re-upload-files')

  return (
    <Surface padding="8" marginBottom="8" className="shadow-blur">
      <Surface.Body
        className={`flex flex-col gap-8 text-center border rounded-lg ${themeBorderColorMap.muted}`}
      >
        <Stack
          direction="col"
          gap="2"
          justifyContent="center"
          alignItems="center"
        >
          <Icon
            fill="outline"
            name="error-warning"
            size="7xl"
            color="negative"
          />
          <Stack direction="col">
            <Heading fontSize="2xl">{heading}</Heading>
          </Stack>

          <Text fontSize="sm" textColor="secondary">
            {infoText}
          </Text>

          <Text fontSize="sm" fontWeight="bold" textColor="negative">
            {t('banners.file-processing-failed')}
          </Text>

          <Stack direction="row" gap="4" justifyContent="center">
            <Button
              loading={isLoading}
              iconRight="arrow-right"
              onClick={handleButtonClick}
              size="md"
            >
              {buttonText}
            </Button>
          </Stack>
        </Stack>
      </Surface.Body>
    </Surface>
  )
}
