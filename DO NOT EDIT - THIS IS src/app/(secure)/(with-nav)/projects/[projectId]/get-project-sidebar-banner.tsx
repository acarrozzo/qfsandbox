import {
  PostProductionCompleteProjectStatuses,
  type ProjectStatus,
} from '@mntn-dev/domain-types'

export function getProjectSidebarBanner(
  projectStatus: ProjectStatus,
  canAttachFinalAssets: boolean,
  hasFileErrors?: boolean
) {
  if (
    canAttachFinalAssets &&
    projectStatus === 'processing_final_files' &&
    hasFileErrors
  ) {
    return 'fileErrors'
  }

  if (projectStatus === 'processing_final_files') {
    return 'processingFinalFiles'
  }

  if (PostProductionCompleteProjectStatuses.includes(projectStatus)) {
    return 'complete'
  }

  if (projectStatus === 'production') {
    return 'production'
  }

  if (projectStatus === 'post_production') {
    return 'post-production'
  }

  return 'default'
}
