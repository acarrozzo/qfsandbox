import {
  isCreditProgramKind,
  type ProjectDomainSelectModel,
} from '@mntn-dev/domain-types'

import { usePermissions } from '~/hooks/secure/use-permissions.ts'

export const shouldShowBidAmount = (project: ProjectDomainSelectModel) => {
  const { hasPermission } = usePermissions()
  return (
    hasPermission('cost:view') ||
    !isCreditProgramKind(project.chosenBillingMethod)
  )
}
