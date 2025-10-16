import type { JSX } from 'react'

import type { ProjectStatus } from '@mntn-dev/domain-types'
import type {
  ProjectServiceWithAcl,
  ProjectWithAcl,
} from '@mntn-dev/project-service'

import { MakerProjectAwardedFooter } from '#components/projects/footers/maker-project-awarded-footer.tsx'
import { MakerProjectBiddingFooter } from '#components/projects/footers/maker-project-bidding-footer.tsx'
import type { HasPermission } from '~/hooks/secure/use-permissions.ts'

import { BrandProjectBiddingFooter } from './brand-project-footer/brand-project-bidding-footer.tsx'
import { BrandProjectDraftFooter } from './brand-project-footer/brand-project-draft-footer.tsx'

export function getProjectFooter(
  project: ProjectWithAcl,
  projectServices: ProjectServiceWithAcl[],
  hasPermission: HasPermission,
  formId?: string,
  onSubmitChange?: () => void
) {
  // brand or internal (special projects)
  if (hasPermission('project:submit')) {
    return (
      brandFooterMap[project.status]?.(project, projectServices, formId) ?? null
    )
  }

  // maker
  if (hasPermission('bid:create')) {
    return (
      makerFooterMap[project.status]?.(
        project,
        projectServices,
        formId,
        onSubmitChange
      ) ?? null
    )
  }

  return null
}

type FooterMap = {
  [k in ProjectStatus]?: (
    project: ProjectWithAcl,
    projectServices: ProjectServiceWithAcl[],
    formId?: string,
    onSubmitChange?: () => void
  ) => JSX.Element
}

const brandFooterMap: FooterMap = {
  draft: (project, projectServices, formId) => (
    <BrandProjectDraftFooter
      formId={formId}
      project={project}
      projectServices={projectServices}
    />
  ),

  bidding_open: () => <BrandProjectBiddingFooter />,
}

const makerFooterMap: FooterMap = {
  bidding_open: (project, projectServices) => (
    <MakerProjectBiddingFooter
      project={project}
      projectServices={projectServices}
    />
  ),
  awarded: (project, _projectServices, _formId, onSubmitChange) => (
    <MakerProjectAwardedFooter
      project={project}
      onSubmitChange={onSubmitChange}
    />
  ),
}
