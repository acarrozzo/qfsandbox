import type { TFunction } from 'i18next'
import { useState } from 'react'

import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { OrganizationType, ProjectStatus } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'
import { Button, Heading, Stack, Surface, Text } from '@mntn-dev/ui-components'

import { ProjectServiceBladeListHeaderTooltip } from '#components/services/service-blades/project-service-blade-list-header-tooltip.tsx'
import { useMe } from '~/hooks/secure/use-me.ts'

type ProjectServiceBladeListHeaderProps = {
  project: ProjectWithAcl
  projectServices: ProjectServiceWithAcl[]
  onRemoveService?: (serviceId: string) => void
}

const getSubheading = (
  status: ProjectStatus,
  t: TFunction<'project-services'>,
  organizationType?: OrganizationType
) => {
  // when in draft show tooltip with default header
  if (status === 'draft') {
    return (
      <Stack gap="1" justifyContent="center" alignItems="center">
        {t('services-subheading.default')}
        <ProjectServiceBladeListHeaderTooltip status={status} />
      </Stack>
    )
  }

  // when in preprod show custom message with tooltip that points to relevant article based on user type
  if (status === 'pre_production') {
    return (
      <Stack gap="1" justifyContent="center" alignItems="start">
        {t('services-subheading.pre-production')}
        <ProjectServiceBladeListHeaderTooltip
          status={status}
          organizationType={organizationType}
        />
      </Stack>
    )
  }

  // when in prod / postprod show custom message without tooltip
  if (['production', 'post_production'].includes(status)) {
    return t('services-subheading.post-production')
  }

  // for all other statuses show default message
  return t('services-subheading.default')
}

export const ProjectServiceBladeListHeader = ({
  project: { projectId, acl, status },
}: ProjectServiceBladeListHeaderProps) => {
  const { me } = useMe()
  const { t } = useTranslation('project-services')
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = useState(false)

  return (
    <Surface.Header className="p-8">
      <Stack justifyContent="between" shrink gap="8">
        <Stack direction="col" gap="1" shrink>
          <Heading
            fontSize="3xl"
            dataTestId={`project-service-heading-${projectId}`}
            dataTrackingId={`project-service-heading-${projectId}`}
          >
            {t('services-heading')}
          </Heading>
          <Text
            fontSize="sm"
            textColor="secondary"
            className="shrink"
            dataTestId={`project-service-subheading-${projectId}`}
            dataTrackingId={`project-service-subheading-${projectId}`}
          >
            {getSubheading(status, t, me.organizationType)}
          </Text>
        </Stack>
        {acl.canModifyProjectServices && (
          <Button
            variant="secondary"
            iconRight="add"
            loading={isRedirecting}
            onClick={() => {
              setIsRedirecting(true)
              router.push(
                route('/projects/:projectId/browse').params({ projectId })
              )
            }}
          >
            {t('add-services')}
          </Button>
        )}
        {acl.canAddProjectChangeOrder && (
          <Button
            variant="secondary"
            iconRight="add"
            loading={isRedirecting}
            onClick={() => {
              setIsRedirecting(true)
              router.push(
                route('/projects/:projectId/change-order').params({ projectId })
              )
            }}
          >
            {t('create-change-order')}
          </Button>
        )}
      </Stack>
    </Surface.Header>
  )
}
