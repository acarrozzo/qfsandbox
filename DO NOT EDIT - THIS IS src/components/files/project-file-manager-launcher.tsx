import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectId } from '@mntn-dev/domain-types'
import { useTranslation } from '@mntn-dev/i18n'
import { Button, type TestIds } from '@mntn-dev/ui-components'

type Props = TestIds & {
  className?: string
  projectId: ProjectId
  variant?: 'file-manager' | 'view-files'
}

export const ProjectFileManagerLauncher = ({
  className,
  dataTestId,
  dataTrackingId,
  projectId,
  variant = 'file-manager',
}: Props) => {
  const router = useRouter()

  const { t } = useTranslation('file-manager')

  const handleClick = () => {
    router.push(route('/projects/:projectId/files').params({ projectId }))
  }

  return (
    <Button
      variant="secondary"
      iconRight="file"
      iconFill="outline"
      onClick={handleClick}
      className={className}
      dataTestId={dataTestId}
      dataTrackingId={dataTrackingId}
    >
      {t(variant)}
    </Button>
  )
}
