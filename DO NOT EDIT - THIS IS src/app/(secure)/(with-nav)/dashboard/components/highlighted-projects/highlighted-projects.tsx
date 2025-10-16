import { usePermissions } from '~/hooks/secure/use-permissions.ts'

import { AgencyHighlightedProjects } from './agency-highlighted-projects.tsx'
import { BrandHighlightedProjects } from './brand-highlighted-projects.tsx'

export const HighlightedProjects = () => {
  const { hasPermission } = usePermissions()

  return hasPermission('bid:create') ? (
    <AgencyHighlightedProjects />
  ) : hasPermission('project:submit') ? (
    <BrandHighlightedProjects />
  ) : null
}
