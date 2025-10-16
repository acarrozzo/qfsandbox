import { useRouter } from '@mntn-dev/app-navigation'
import { route } from '@mntn-dev/app-routing'
import type { ProjectCardActionsComponentProps } from '@mntn-dev/app-ui-components/project-highlight-card'
import { Button } from '@mntn-dev/ui-components'

export const AgencyDraftActions = ({
  project,
}: ProjectCardActionsComponentProps) => {
  const router = useRouter()
  const handleClick = () => {
    router.push(
      route('/projects/:projectId').params({
        projectId: project.projectId,
      })
    )
  }
  return (
    <div>
      <Button variant="primary" iconRight="arrow-right" onClick={handleClick}>
        Complete Draft & Bid
      </Button>
    </div>
  )
}
