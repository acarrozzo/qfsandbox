import type { TFunction } from 'i18next'
import { useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { projectPostProductionReviewRoute } from '@mntn-dev/app-routing'
import type {
  ProjectStatus,
  ServiceWithDeliverables,
} from '@mntn-dev/domain-types'
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

import { useProjectMissingFinalAssetTags } from '#projects/hooks/use-project-missing-final-asset-tags.ts'
import { useMe } from '~/hooks/secure/use-me.ts'
import { sortDeliverablesByGroup } from '~/lib/deliverables/deliverable-helpers.ts'
import { getDeliverablesFromServices } from '~/lib/services/service-helpers.ts'

const getInfoText = (
  status: ProjectStatus,
  isMissingFinalAssetTags: boolean,
  canUploadFinalAssets: boolean,
  isBrand: boolean,
  t: TFunction<'projects'>
) => {
  if (status === 'post_production_complete') {
    return canUploadFinalAssets
      ? t('banners.you-can-upload-files')
      : t('banners.waiting-on-maker')
  }

  return isMissingFinalAssetTags
    ? t('banners.deliverables-are-pending', {
        adjective: isBrand ? t('banners.your') : t('banners.final'),
      })
    : t('banners.deliverables-are-ready', {
        adjective: isBrand ? t('banners.your') : t('banners.final'),
      })
}

export const ProjectCompleteBanner = ({
  project,
  deliverableServices,
}: {
  project: ProjectWithAcl
  deliverableServices: ServiceWithDeliverables<ProjectServiceWithAcl>[]
}) => {
  const { me } = useMe()
  const { t } = useTranslation(['projects'])
  const { status, origin } = project
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)

  const deliverables = getDeliverablesFromServices(deliverableServices)

  const sortedDeliverables = sortDeliverablesByGroup(
    deliverables,
    deliverableServices
  )
  const isMissingFinalAssetTags = useProjectMissingFinalAssetTags(
    project.projectId,
    deliverables
  )

  const firstDeliverable = sortedDeliverables.videos[0]
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

  const heading =
    status === 'post_production_complete'
      ? origin === 'qontrol'
        ? ''
        : t('projects:banners.all-deliverables-approved')
      : t('projects:banners.project-wrapped')

  const subheading =
    status === 'post_production_complete'
      ? t('projects:banners.roll-the-credits')
      : ''

  const infoText = getInfoText(
    status,
    isMissingFinalAssetTags,
    !!project.acl.canAttachFinalAssetToDeliverable,
    me.organizationType === 'brand',
    t
  )

  const canViewButton =
    project.acl.canAttachFinalAssetToDeliverable ||
    (status === 'complete' && !isMissingFinalAssetTags)

  const buttonText =
    status === 'post_production_complete'
      ? t('projects:banners.upload-now')
      : t('projects:banners.view-all')

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
            name="checkbox-circle"
            size="7xl"
            color="positive"
          />
          <Stack direction="col">
            {subheading && (
              <Heading textColor="secondary" fontSize="2xl">
                {subheading}
              </Heading>
            )}
            <Heading fontSize="3xl">{heading}</Heading>
          </Stack>

          <Text fontSize="sm" textColor="secondary">
            {infoText}
          </Text>

          {status === 'complete' && isMissingFinalAssetTags && (
            <Heading fontSize="xl" textColor="notice">
              {t('projects:banners.videos-processing')}
            </Heading>
          )}
        </Stack>

        {canViewButton && (
          <Button
            loading={isLoading}
            iconRight="arrow-right"
            onClick={handleButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </Surface.Body>
    </Surface>
  )
}
