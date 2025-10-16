import { ProjectHighlightCardSkeleton } from '@mntn-dev/app-ui-components/project-highlight-card-skeleton'
import { Cards } from '@mntn-dev/ui-components'

export const ProjectHighlightListLoading = () => {
  return (
    <Cards>
      <ProjectHighlightCardSkeleton />
    </Cards>
  )
}
