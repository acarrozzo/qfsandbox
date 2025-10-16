import type {
  ProjectDomainQueryModel,
  ProjectListItemServiceModel,
} from '@mntn-dev/domain-types'
import { Surface, Tag, Text } from '@mntn-dev/ui-components'
import { themeHoverBackgroundMap, themeHoverGlowMap } from '@mntn-dev/ui-theme'
import { cn } from '@mntn-dev/ui-utilities'

import { evaluateStatus } from '~/utils/status-helpers.ts'

// TODO: QF-3280 - pretty up this blade in QF-3280
export const ProjectListBlade = ({
  onClick,
  project,
}: {
  onClick?: () => void
  project: ProjectDomainQueryModel | ProjectListItemServiceModel
}) => {
  const { isAwarded, isBiddingOpen } = evaluateStatus(project.status)

  return (
    <Surface
      className={cn(
        'cursor-pointer w-full p-2',
        themeHoverBackgroundMap.tertiary,
        themeHoverGlowMap.info
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Tag type="brand" variant="primary">
          {isAwarded ? 'Awarded' : isBiddingOpen ? 'Opportunity' : 'Closed'}
        </Tag>
        <Text fontSize="lg">{project.name}</Text>
      </div>
    </Surface>
  )
}
