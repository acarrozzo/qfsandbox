import {
  isCreditProgramKind,
  isMNTNCreativeProgram,
  type ProjectDomainSelectModel,
} from '@mntn-dev/domain-types'

import { usePermissions } from '~/hooks/secure/use-permissions.ts'

export const shouldShowCreditValue = (project: ProjectDomainSelectModel) => {
  const { hasPermission } = usePermissions()
  return (
    isCreditProgramKind(project.chosenBillingMethod) &&
    (isMNTNCreativeProgram(project.chosenBillingMethod) ||
      hasPermission('project:administer'))
  )
}
