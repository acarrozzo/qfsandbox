import { ProjectListCardSkeleton } from '@mntn-dev/app-ui-components/project-list-card-skeleton'
import { CardsCompact } from '@mntn-dev/ui-components'
import { makeRange } from '@mntn-dev/utilities'

export const ProjectListLoading = () => {
  return (
    <CardsCompact>
      {makeRange(4).map((index) => (
        <ProjectListCardSkeleton key={index} />
      ))}
    </CardsCompact>
  )
}
