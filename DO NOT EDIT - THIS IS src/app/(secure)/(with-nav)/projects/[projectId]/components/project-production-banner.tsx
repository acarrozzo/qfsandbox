import type { ProjectId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import {
  Button,
  Heading,
  Icon,
  Surface,
  Text,
  useToast,
} from '@mntn-dev/ui-components'
import { themeBorderColorMap } from '@mntn-dev/ui-theme'

import { useRefetchProject } from '#components/projects/use-refetch-project.ts'
import { trpcReactClient } from '~/app/_trpc/trpc-react-client.ts'
import { useRefetchProjectServices } from '~/components/services/use-refetch-project-services'

export const ProjectProductionBanner = ({
  projectId,
  canSetProjectPostProduction,
}: {
  projectId: ProjectId
  canSetProjectPostProduction?: boolean
}) => {
  const { t } = useTranslation(['projects', 'toast'])
  const { showToast } = useToast()

  const refetchProject = useRefetchProject()
  const refetchProjectServices = useRefetchProjectServices({ projectId })
  const moveToPostProduction =
    trpcReactClient.projects.setProjectPostProduction.useMutation()

  const handleMoveToPostProduction = async () => {
    await moveToPostProduction.mutateAsync({ projectId })

    showToast.info({
      title: t('toast:project.post-production-started.title'),
      body: t('toast:project.post-production-started.body'),
      dataTestId: 'project-post-production-started-info-toast',
      dataTrackingId: 'project-post-production-started-info-toast',
    })

    await refetchProject({ projectId })
    await refetchProjectServices()
  }

  return (
    <Surface padding="8" marginBottom="8" className="shadow-blur">
      <Surface.Body
        className={`flex flex-col items-center justify-center text-center gap-6 border rounded-lg ${themeBorderColorMap.muted}`}
      >
        <Icon name="video" size="5xl" color="primary" />
        <Heading fontSize="3xl">{t('projects:banners.in-production')}</Heading>
        <Text fontSize="sm" textColor="secondary">
          {canSetProjectPostProduction
            ? t('projects:banners.start-post-production-text')
            : t('projects:banners.production-started-text')}
        </Text>
        {canSetProjectPostProduction && (
          <Button
            onClick={handleMoveToPostProduction}
            loading={moveToPostProduction.isPending}
            dataTestId="project-details-post-production-start-button"
            size="md"
          >
            {t('projects:banners.start-post-production-button-text')}
          </Button>
        )}
      </Surface.Body>
    </Surface>
  )
}
